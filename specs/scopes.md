# Scopes

Scopes define what a client is allowed to do.

## Scope Table

| Scope | Allows |
| --- | --- |
| `context.read` | Request ContextPacks with `pcp.context.request` |
| `context.search` | Search context with `pcp.context.search` |
| `memory.propose` | Submit memory proposals with `pcp.memory.propose` |
| `memory.write` | Create memory directly with `pcp.memory.create` |
| `consent.read` | List grants with `pcp.consent.list` |
| `consent.revoke` | Revoke grants with `pcp.consent.revoke` |
| `context.export` | Export context with `pcp.export.create` |

## Fail-Closed Rule

If a grant is missing, revoked, expired, or missing the required scope, the
server must reject the method call.

## Reference Demo Grant

The demo grant includes all v0.1 scopes so every example can run locally:

```text
grant_demo_codex
```

Production implementations should issue narrower grants.
