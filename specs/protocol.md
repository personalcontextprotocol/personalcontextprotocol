# Protocol Transport

PCP v0.1 uses JSON-RPC 2.0 over HTTP.

All protocol messages MUST be UTF-8 encoded JSON.

## Endpoint

```text
POST /pcp
```

The v0.1 transport profile uses one HTTP endpoint. The reference server uses
`/pcp`. Other deployments MAY expose the PCP endpoint at a different path, but
clients MUST be configured with the exact endpoint.

## Headers

```text
Content-Type: application/json
Authorization: Bearer <token>
```

Clients MUST send `Content-Type: application/json`.

The v0.1 reference server requires bearer-token authentication. Other
implementations MAY use different authentication schemes, but they MUST reject
unauthenticated protected method calls.

Browser requests that include an `Origin` header MUST use an allowed origin.

## Request Envelope

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "pcp.context.request",
  "params": {}
}
```

Requests MUST include:

- `jsonrpc: "2.0"`
- `id` as a string, number, or `null`
- `method` as a non-empty string
- `params` when required by the method

PCP v0.1 does not define JSON-RPC notifications or streaming responses.

## Success Envelope

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {}
}
```

Success responses MUST include the same `id` as the request and a `result`
field.

## Error Envelope

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "error": {
    "code": -32001,
    "message": "Consent grant is missing or revoked",
    "data": {
      "grantId": "grant_demo_assistant"
    }
  }
}
```

Error responses MUST include the same `id` as the request when the request id
can be read. Error responses MUST include integer `code` and string `message`
fields.

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

The server MUST return the negotiated protocol version and capabilities. A
conforming v0.1 server MUST reject unsupported protocol versions rather than
silently falling back to a different protocol line.
