# Audit

PCP audit logs make context access inspectable.

The server should write audit entries for meaningful reads, writes, denials,
and exports.

## Audit Actions

Allowed actions:

- `context.requested`
- `context.returned`
- `context.searched`
- `memory.proposed`
- `memory.created`
- `consent.listed`
- `consent.revoked`
- `export.created`
- `auth.denied`

## Audit Results

Allowed results:

- `success`
- `denied`
- `error`

## Example

```json
{
  "id": "audit-id",
  "userId": "user_demo",
  "clientId": "codex-local",
  "grantId": "grant_demo_codex",
  "action": "context.returned",
  "scope": "context.read",
  "resourceId": "context-pack-id",
  "timestamp": "2026-06-24T00:00:00.000Z",
  "result": "success",
  "details": {
    "itemCount": 5
  }
}
```

## Reference Server Storage

The reference server stores audit logs in SQLite table:

```text
audit_logs
```

The table is defined in:

```text
server/src/db/schema.ts
```
