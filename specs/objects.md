# Object Reference

The canonical machine-readable schemas live in:

```text
packages/protocol/src/schemas/
```

The generated JSON Schema lives in:

```text
packages/protocol/schemas/pcp-v0.1.schema.json
```

## `AppClient`

Represents an application asking for personal context.

```json
{
  "id": "codex-local",
  "name": "Codex Local",
  "version": "0.1.0",
  "description": "Local coding assistant",
  "type": "local_cli",
  "createdAt": "2026-06-24T00:00:00.000Z"
}
```

Allowed `type` values:

- `local_cli`
- `ai_assistant`
- `ide_agent`
- `web_app`
- `desktop_app`
- `other`

## `ConsentGrant`

Defines what a client can do.

```json
{
  "id": "grant_demo_codex",
  "userId": "user_demo",
  "clientId": "codex-local",
  "scopes": ["context.read", "context.search", "memory.propose"],
  "purpose": "Allow the local Codex client to help build PCP v0.1.",
  "status": "active",
  "createdAt": "2026-06-24T00:00:00.000Z",
  "expiresAt": "2027-06-24T00:00:00.000Z"
}
```

Allowed `status` values:

- `active`
- `revoked`
- `expired`

## `PermissionScope`

Allowed scopes:

- `context.read`
- `context.search`
- `memory.propose`
- `memory.write`
- `consent.read`
- `consent.revoke`
- `context.export`

## `ContextItem`

One piece of personal context.

```json
{
  "id": "ctx_decision_jsonrpc",
  "userId": "user_demo",
  "type": "DecisionHistory",
  "content": {
    "text": "PCP v0.1 uses JSON-RPC 2.0 over one HTTP endpoint.",
    "data": {}
  },
  "tags": ["pcp", "json-rpc", "decision"],
  "source": {
    "type": "system_seed",
    "origin": "pcp-reference-server",
    "method": "demo_seed",
    "capturedAt": "2026-06-24T00:00:00.000Z",
    "reference": "optional-reference"
  },
  "confidence": 1,
  "freshness": {
    "lastVerifiedAt": "2026-06-24T00:00:00.000Z",
    "expiresAt": "2027-06-24T00:00:00.000Z",
    "status": "fresh"
  },
  "sensitivity": "low",
  "createdAt": "2026-06-24T00:00:00.000Z",
  "updatedAt": "2026-06-24T00:00:00.000Z"
}
```

Allowed `type` values:

- `UserProfile`
- `Preference`
- `Project`
- `Goal`
- `MemoryItem`
- `DecisionHistory`
- `CommunicationStyle`

Allowed source `type` values:

- `manual_user_entry`
- `imported`
- `client_proposal`
- `model_inference`
- `system_seed`

Allowed freshness `status` values:

- `fresh`
- `aging`
- `stale`
- `unknown`

Allowed `sensitivity` values:

- `low`
- `medium`
- `high`
- `restricted`

## `ContextPack`

A scoped bundle of context returned to a client.

```json
{
  "id": "context-pack-id",
  "userId": "user_demo",
  "clientId": "codex-local",
  "grantId": "grant_demo_codex",
  "purpose": "Help with PCP implementation",
  "generatedAt": "2026-06-24T00:00:00.000Z",
  "expiresAt": "2026-06-24T01:00:00.000Z",
  "items": [],
  "warnings": [],
  "limits": {
    "maxItems": 20,
    "sensitiveItemsExcluded": 0
  }
}
```

## `MemoryProposal`

A proposed context item that has not been accepted into memory yet.

```json
{
  "id": "proposal-id",
  "userId": "user_demo",
  "clientId": "codex-local",
  "grantId": "grant_demo_codex",
  "proposedItem": {
    "type": "DecisionHistory",
    "content": {
      "text": "A proposed decision."
    },
    "tags": ["decision"],
    "source": {
      "type": "client_proposal",
      "origin": "codex-local",
      "method": "summary",
      "capturedAt": "2026-06-24T00:00:00.000Z"
    },
    "confidence": 0.9,
    "freshness": {
      "status": "fresh"
    },
    "sensitivity": "low"
  },
  "reason": "Useful for future continuity.",
  "status": "pending",
  "createdAt": "2026-06-24T00:00:00.000Z"
}
```

Allowed `status` values:

- `pending`
- `accepted`
- `rejected`
- `accepted_with_edits`
- `expired`

## `AuditLog`

Records meaningful access, mutation, denial, and export events.

```json
{
  "id": "audit-id",
  "userId": "user_demo",
  "clientId": "codex-local",
  "grantId": "grant_demo_codex",
  "action": "context.requested",
  "scope": "context.read",
  "resourceId": "context-pack-id",
  "timestamp": "2026-06-24T00:00:00.000Z",
  "result": "success",
  "details": {
    "itemCount": 5
  }
}
```
