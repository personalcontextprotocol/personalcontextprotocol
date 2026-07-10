# Method Reference

All methods use JSON-RPC 2.0 envelopes. This page documents the `params` and
`result` payloads.

Method behavior described as "reference server" behavior is not a protocol
restriction unless the canonical schema or this specification says it is.

## `initialize`

Negotiates protocol version and discovers server capabilities.

### Params

```json
{
  "protocolVersion": "2026-06-24",
  "clientInfo": {
    "id": "sample-assistant",
    "name": "Sample Assistant",
    "version": "0.1.0",
    "description": "Local assistant demo",
    "type": "local_cli"
  },
  "capabilities": {
    "context": {},
    "memory": {
      "propose": true
    }
  }
}
```

### Result

```json
{
  "protocolVersion": "2026-06-24",
  "serverInfo": {
    "name": "pcp-reference-server",
    "version": "0.1.0",
    "description": "Reference PCP server"
  },
  "capabilities": {
    "context": {
      "request": true,
      "search": true
    },
    "memory": {
      "propose": true,
      "create": true
    },
    "consent": {
      "list": true,
      "revoke": true
    },
    "export": {
      "create": true
    },
    "audit": {
      "enabled": true
    }
  },
  "instructions": "This PCP server provides scoped personal context packs with provenance, confidence, sensitivity, and freshness metadata."
}
```

## `pcp.context.request`

Returns a scoped ContextPack for a declared purpose and task.

Required scope: `context.read`

### Params

```json
{
  "grantId": "grant_demo_assistant",
  "purpose": "Help the user prepare for a planning session",
  "task": "Summarize current goals, preferences, and relevant decisions",
  "contextTypes": ["Project", "DecisionHistory", "MemoryItem"],
  "maxItems": 20,
  "freshnessPreference": "recent_first",
  "includeSources": true,
  "includeConfidence": true
}
```

`freshnessPreference` can be:

- `recent_first`
- `verified_first`
- `any`

### Result

```json
{
  "contextPack": {
    "id": "context-pack-id",
    "userId": "user_demo",
    "clientId": "sample-assistant",
    "grantId": "grant_demo_assistant",
    "purpose": "Help the user prepare for a planning session",
    "generatedAt": "2026-06-24T00:00:00.000Z",
    "expiresAt": "2026-06-24T01:00:00.000Z",
    "items": [],
    "warnings": [],
    "limits": {
      "maxItems": 20,
      "sensitiveItemsExcluded": 0
    }
  }
}
```

## `pcp.context.search`

Searches context available under the grant.

Required scope: `context.search`

### Params

```json
{
  "grantId": "grant_demo_assistant",
  "query": "planning decisions",
  "contextTypes": ["Project", "DecisionHistory", "MemoryItem"],
  "limit": 10
}
```

### Result

```json
{
  "items": [],
  "total": 0
}
```

## `pcp.memory.propose`

Stores a pending memory proposal. This lets a client suggest a memory update
without directly modifying personal context.

Required scope: `memory.propose`

### Params

```json
{
  "grantId": "grant_demo_assistant",
  "proposedItem": {
    "type": "DecisionHistory",
    "content": {
      "text": "The user wants planning summaries to separate confirmed facts from assumptions."
    },
    "tags": ["planning", "decision"],
    "confidence": 0.9,
    "sensitivity": "low",
    "source": {
      "type": "client_proposal",
      "origin": "sample-assistant",
      "method": "explicit_conversation_summary",
      "capturedAt": "2026-06-24T00:00:00.000Z"
    },
    "freshness": {
      "lastVerifiedAt": "2026-06-24T00:00:00.000Z",
      "status": "fresh"
    }
  },
  "reason": "This planning preference may be useful in future sessions."
}
```

### Result

```json
{
  "proposal": {
    "id": "proposal-id",
    "status": "pending",
    "createdAt": "2026-06-24T00:00:00.000Z"
  }
}
```

## `pcp.memory.create`

Creates a ContextItem directly.

Required scope: `memory.write`

Protocol requirement: the grant must include `memory.write`.

Reference server note: the local reference server also requires the demo admin
bearer token for direct memory creation.

### Params

```json
{
  "grantId": "grant_demo_assistant",
  "item": {
    "type": "MemoryItem",
    "content": {
      "text": "A directly created memory."
    },
    "tags": ["demo"],
    "confidence": 0.8,
    "sensitivity": "low",
    "source": {
      "type": "manual_user_entry",
      "origin": "local-admin",
      "method": "demo",
      "capturedAt": "2026-06-24T00:00:00.000Z"
    },
    "freshness": {
      "status": "fresh"
    }
  }
}
```

### Result

```json
{
  "item": {
    "id": "context-item-id",
    "userId": "user_demo",
    "type": "MemoryItem",
    "content": {
      "text": "A directly created memory."
    },
    "tags": ["demo"],
    "source": {
      "type": "manual_user_entry",
      "origin": "local-admin",
      "method": "demo",
      "capturedAt": "2026-06-24T00:00:00.000Z"
    },
    "confidence": 0.8,
    "freshness": {
      "status": "fresh"
    },
    "sensitivity": "low",
    "createdAt": "2026-06-24T00:00:00.000Z",
    "updatedAt": "2026-06-24T00:00:00.000Z"
  }
}
```

## `pcp.memory.delete`

Deletes an existing ContextItem.

Required scope: `memory.write`

Protocol requirement: the grant must include `memory.write`.

Reference server note: the local reference server also requires the demo admin
bearer token for direct memory deletion.

### Params

```json
{
  "grantId": "grant_demo_assistant",
  "itemId": "context-item-id"
}
```

### Result

```json
{
  "item": {
    "id": "context-item-id",
    "userId": "user_demo",
    "type": "MemoryItem",
    "content": {
      "text": "A directly created memory."
    },
    "tags": ["demo"],
    "source": {
      "type": "manual_user_entry",
      "origin": "local-admin",
      "method": "demo",
      "capturedAt": "2026-06-24T00:00:00.000Z"
    },
    "confidence": 0.8,
    "freshness": {
      "status": "fresh"
    },
    "sensitivity": "low",
    "createdAt": "2026-06-24T00:00:00.000Z",
    "updatedAt": "2026-06-24T00:00:00.000Z"
  }
}
```

## `pcp.consent.list`

Returns grants for the authenticated client.

Required scope: `consent.read`

### Params

```json
{
  "clientId": "sample-assistant"
}
```

### Result

```json
{
  "grants": []
}
```

## `pcp.consent.revoke`

Revokes a grant.

Required scope: `consent.revoke`

### Params

```json
{
  "grantId": "grant_demo_assistant"
}
```

### Result

```json
{
  "grant": {
    "id": "grant_demo_assistant",
    "status": "revoked"
  }
}
```

The real result includes the full `ConsentGrant`.

## `pcp.audit.list`

Lists audit entries visible under a grant.

Required scope: `context.audit.read`

### Params

```json
{
  "grantId": "grant_demo_assistant",
  "clientId": "sample-assistant",
  "actions": ["context.requested", "context.searched"],
  "results": ["success"],
  "resourceId": "context-pack-id",
  "since": "2026-06-24T00:00:00.000Z",
  "until": "2026-06-25T00:00:00.000Z",
  "limit": 100
}
```

All filters except `grantId` are optional. The default `limit` is `100`.

### Result

```json
{
  "logs": [],
  "total": 0
}
```

## `pcp.export.create`

Exports permitted context as JSON.

Required scope: `context.export`

### Params

```json
{
  "grantId": "grant_demo_assistant",
  "format": "json",
  "contextTypes": ["Project", "DecisionHistory"]
}
```

### Result

```json
{
  "export": {
    "id": "export-id",
    "format": "json",
    "createdAt": "2026-06-24T00:00:00.000Z",
    "itemCount": 2,
    "data": {
      "contextItems": []
    }
  }
}
```
