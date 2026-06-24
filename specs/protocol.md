# Protocol Transport

PCP v0.1 uses JSON-RPC 2.0 over HTTP.

## Endpoint

```text
POST /pcp
```

## Headers

```text
Content-Type: application/json
Authorization: Bearer <token>
```

Browser requests that include an `Origin` header must use an allowed origin.

## Request Envelope

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "pcp.context.request",
  "params": {}
}
```

## Success Envelope

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {}
}
```

## Error Envelope

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "error": {
    "code": -32001,
    "message": "Consent grant is missing or revoked",
    "data": {
      "grantId": "grant_demo_codex"
    }
  }
}
```

## Standard JSON-RPC Error Codes

- `-32700`: Parse error
- `-32600`: Invalid request
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32603`: Internal error

## PCP Error Codes

- `-32001`: `PCP_CONSENT_REQUIRED`
- `-32002`: `PCP_SCOPE_DENIED`
- `-32003`: `PCP_GRANT_REVOKED`
- `-32004`: `PCP_GRANT_EXPIRED`
- `-32005`: `PCP_CONTEXT_NOT_FOUND`
- `-32006`: `PCP_VALIDATION_FAILED`
- `-32007`: `PCP_EXPORT_DENIED`

## Version Negotiation

The client sends `protocolVersion` in `initialize`.

For PCP v0.1, the required value is:

```text
2026-06-24
```

The server returns the negotiated protocol version and capabilities.
