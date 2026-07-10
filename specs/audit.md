# Audit

PCP audit logs make context access inspectable.

Servers MUST write audit entries for meaningful reads, writes, denials, grant
changes, audit listing, and exports.

## Audit Actions

Allowed actions:

- `context.requested`
- `context.returned`
- `context.searched`
- `memory.proposed`
- `memory.created`
- `memory.deleted`
- `consent.listed`
- `consent.revoked`
- `audit.listed`
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
  "clientId": "sample-assistant",
  "grantId": "grant_demo_assistant",
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

The reference server stores audit logs in the SQLite table:

```text
audit_logs
```

The table is defined in:

```text
server/src/db/schema.ts
```
