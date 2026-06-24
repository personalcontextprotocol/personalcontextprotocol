export const JSON_RPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603
} as const;

export const PCP_ERROR_CODES = {
  PCP_CONSENT_REQUIRED: -32001,
  PCP_SCOPE_DENIED: -32002,
  PCP_GRANT_REVOKED: -32003,
  PCP_GRANT_EXPIRED: -32004,
  PCP_CONTEXT_NOT_FOUND: -32005,
  PCP_VALIDATION_FAILED: -32006,
  PCP_EXPORT_DENIED: -32007
} as const;

export type JsonRpcErrorCode =
  (typeof JSON_RPC_ERROR_CODES)[keyof typeof JSON_RPC_ERROR_CODES];

export type PcpErrorCode = (typeof PCP_ERROR_CODES)[keyof typeof PCP_ERROR_CODES];

export class PcpError extends Error {
  readonly code: JsonRpcErrorCode | PcpErrorCode;
  readonly data: unknown;

  constructor(
    code: JsonRpcErrorCode | PcpErrorCode,
    message: string,
    data?: unknown
  ) {
    super(message);
    this.name = "PcpError";
    this.code = code;
    this.data = data;
  }
}
