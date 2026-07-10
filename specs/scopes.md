# Scopes

Scopes define what a client is allowed to do.

## Scope Table

| Scope | Allows |
| --- | --- |
| `context.read` | Request ContextPacks with `pcp.context.request` |
| `context.search` | Search context with `pcp.context.search` |
| `context.audit.read` | Read scoped audit entries with `pcp.audit.list` |
| `memory.propose` | Submit memory proposals with `pcp.memory.propose` |
| `memory.write` | Create or delete memory directly with `pcp.memory.create` and `pcp.memory.delete` |
| `consent.read` | List grants with `pcp.consent.list` |
| `consent.revoke` | Revoke grants with `pcp.consent.revoke` |
| `context.export` | Export context with `pcp.export.create` |
| `context.sync` | Reserved for future sync profiles; not used by the v0.1 reference server |
| `grants.manage` | Reserved for future owner-managed grant issuance; not used by the v0.1 reference server |

## Fail-Closed Rule

If a grant is missing, revoked, expired, or missing the required scope, the
server must reject the method call.

## Reference Demo Grant

The demo grant includes all v0.1 scopes so every example can run locally:

```text
grant_demo_codex
```

Production implementations should issue narrower grants.
