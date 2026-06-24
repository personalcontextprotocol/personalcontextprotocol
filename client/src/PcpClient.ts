import {
  PCP_METHODS,
  type ConsentListParams,
  type ConsentRevokeParams,
  type ContextRequestParams,
  type ContextSearchParams,
  type ExportCreateParams,
  type InitializeParams,
  type JsonRpcErrorResponse,
  type JsonRpcSuccessResponse,
  type MemoryCreateParams,
  type MemoryProposeParams
} from "@pcp/protocol";

export type PcpClientOptions = {
  endpoint: string;
  token: string;
  fetchImpl?: typeof fetch;
};

export class PcpClient {
  private nextId = 1;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly options: PcpClientOptions) {
    this.fetchImpl = options.fetchImpl ?? fetch;
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

  async request(method: string, params: unknown) {
    const response = await this.fetchImpl(this.options.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${this.options.token}`
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: String(this.nextId++),
        method,
        params
      })
    });

    const body = (await response.json()) as JsonRpcSuccessResponse | JsonRpcErrorResponse;
    if ("error" in body) {
      throw new Error(`${body.error.code} ${body.error.message}`);
    }

    return body.result;
  }
}
