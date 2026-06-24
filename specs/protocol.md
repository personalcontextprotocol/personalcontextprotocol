# Protocol

PCP v0.1 uses JSON-RPC 2.0 request and response envelopes.

## Transport

- HTTP `POST /pcp`
- `Content-Type: application/json`
- `Authorization: Bearer <token>`

## Request

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "pcp.context.request",
  "params": {}
}
```

## Success

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {}
}
```

## Error

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "error": {
    "code": -32001,
    "message": "Consent grant is missing or revoked",
    "data": {}
  }
}
```

PCP uses standard JSON-RPC error codes where appropriate and reserves
`-32001` through `-32007` for PCP-specific access and validation failures.
