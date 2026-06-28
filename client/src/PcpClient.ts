import {
  JSON_RPC_VERSION,
  JsonRpcResponseSchema,
  PCP_BEARER_AUTH_SCHEME,
  PCP_HTTP_JSON_RPC_METHOD,
  PCP_METHODS,
  PCP_METHOD_REGISTRY,
  type ConsentListParams,
  type ConsentRevokeParams,
  type ContextRequestParams,
  type ContextSearchParams,
  type ExportCreateParams,
  type InitializeParams,
  type JsonRpcErrorResponse,
  type JsonRpcId,
  type JsonRpcRequest,
  type JsonRpcResponse,
  type JsonRpcSuccessResponse,
  type MemoryCreateParams,
  type MemoryProposeParams,
  type PcpMethodName,
  type PcpMethodSpec
} from "@pcp/protocol";

export type PcpBearerAuth = {
  scheme: typeof PCP_BEARER_AUTH_SCHEME;
  token: string;
};

export type PcpFetchTransportOptions = {
  endpoint: string;
  auth?: PcpBearerAuth;
  fetchImpl?: typeof fetch;
  headers?: Record<string, string>;
};

export type PcpTransport = {
  send(request: JsonRpcRequest): Promise<JsonRpcResponse>;
};

export type PcpClientOptions = {
  transport: PcpTransport;
  idFactory?: () => JsonRpcId;
};

export type PcpEndpointClientOptions = Omit<PcpFetchTransportOptions, "auth"> & {
  token?: string;
  auth?: PcpBearerAuth;
  idFactory?: () => JsonRpcId;
};

export class PcpClientError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "PcpClientError";
  }
}

export class PcpProtocolError extends PcpClientError {
  readonly code: number;
  readonly data: unknown;

  constructor(error: JsonRpcErrorResponse["error"]) {
    super(`${error.code} ${error.message}`);
    this.name = "PcpProtocolError";
    this.code = error.code;
    this.data = error.data;
  }
}

export class PcpTransportError extends PcpClientError {
  readonly status: number;
  readonly responseText: string;

  constructor(status: number, responseText: string) {
    super(`PCP transport failed with HTTP ${status}`);
    this.name = "PcpTransportError";
    this.status = status;
    this.responseText = responseText;
  }
}

export class PcpValidationError extends PcpClientError {
  readonly issues: PcpValidationIssue[];

  constructor(message: string, error: { issues: PcpValidationIssue[] }) {
    super(message);
    this.name = "PcpValidationError";
    this.issues = error.issues;
  }
}

export type PcpValidationIssue = {
  code: string;
  path: Array<string | number>;
  message: string;
};

export class FetchPcpTransport implements PcpTransport {
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly options: PcpFetchTransportOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async send(request: JsonRpcRequest): Promise<JsonRpcResponse> {
    const response = await this.fetchImpl(this.options.endpoint, {
      method: PCP_HTTP_JSON_RPC_METHOD,
      headers: this.headers(),
      body: JSON.stringify(request)
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new PcpTransportError(response.status, responseText);
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(responseText) as unknown;
    } catch (error) {
      throw new PcpClientError("PCP transport returned invalid JSON", {
        cause: error
      });
    }
    const parsedResponse = JsonRpcResponseSchema.safeParse(parsedJson);
    if (!parsedResponse.success) {
      throw new PcpValidationError("Invalid PCP JSON-RPC response", parsedResponse.error);
    }

    return parsedResponse.data;
  }

  private headers(): Record<string, string> {
    const headers = {
      "content-type": "application/json",
      ...this.options.headers
    };

    if (!this.options.auth) {
      return headers;
    }

    return {
      ...headers,
      authorization: `${this.options.auth.scheme} ${this.options.auth.token}`
    };
  }
}

export class PcpClient {
  private nextId = 1;
  private readonly idFactory: () => JsonRpcId;
  private readonly transport: PcpTransport;

  constructor(options: PcpClientOptions);
  constructor(options: PcpEndpointClientOptions);
  constructor(options: PcpClientOptions | PcpEndpointClientOptions) {
    if ("transport" in options) {
      this.transport = options.transport;
      this.idFactory = options.idFactory ?? (() => String(this.nextId++));
      return;
    }

    const auth = options.auth ?? bearerAuthFromToken(options.token);
    this.transport = new FetchPcpTransport({ ...options, auth });
    this.idFactory = options.idFactory ?? (() => String(this.nextId++));
  }

  initialize(params: InitializeParams) {
    return this.request(PCP_METHODS.initialize, params);
  }

  requestContext(params: ContextRequestParams) {
    return this.request(PCP_METHODS.contextRequest, params);
  }

  searchContext(params: ContextSearchParams) {
    return this.request(PCP_METHODS.contextSearch, params);
  }

  proposeMemory(params: MemoryProposeParams) {
    return this.request(PCP_METHODS.memoryPropose, params);
  }

  createMemory(params: MemoryCreateParams) {
    return this.request(PCP_METHODS.memoryCreate, params);
  }

  listConsent(params: ConsentListParams = {}) {
    return this.request(PCP_METHODS.consentList, params);
  }

  revokeConsent(params: ConsentRevokeParams) {
    return this.request(PCP_METHODS.consentRevoke, params);
  }

  createExport(params: ExportCreateParams) {
    return this.request(PCP_METHODS.exportCreate, params);
  }

  async request<TMethod extends PcpMethodName>(
    method: TMethod,
    params: PcpMethodSpec[TMethod]["params"]
  ): Promise<PcpMethodSpec[TMethod]["result"]> {
    const definition = PCP_METHOD_REGISTRY[method];
    const parsedParams = definition.paramsSchema.safeParse(params);
    if (!parsedParams.success) {
      throw new PcpValidationError("Invalid PCP request params", parsedParams.error);
    }

    const response = await this.transport.send({
      jsonrpc: JSON_RPC_VERSION,
      id: this.idFactory(),
      method,
      params: parsedParams.data
    });

    const parsedResponse = responseSchema(response);
    if ("error" in parsedResponse) {
      throw new PcpProtocolError(parsedResponse.error);
    }

    const parsedResult = definition.resultSchema.safeParse(parsedResponse.result);
    if (!parsedResult.success) {
      throw new PcpValidationError("Invalid PCP response result", parsedResult.error);
    }

    return parsedResult.data as PcpMethodSpec[TMethod]["result"];
  }
}

function bearerAuthFromToken(token: string | undefined): PcpBearerAuth | undefined {
  if (token === undefined) {
    return undefined;
  }

  return {
    scheme: PCP_BEARER_AUTH_SCHEME,
    token
  };
}

function responseSchema(response: JsonRpcResponse): JsonRpcSuccessResponse | JsonRpcErrorResponse {
  if (response.jsonrpc !== JSON_RPC_VERSION) {
    throw new PcpClientError(`Unsupported JSON-RPC version: ${response.jsonrpc}`);
  }

  return response;
}
