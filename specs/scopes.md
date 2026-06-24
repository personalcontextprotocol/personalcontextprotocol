# Scopes

PCP v0.1 defines explicit permission scopes:

- `context.read`
- `context.search`
- `memory.propose`
- `memory.write`
- `consent.read`
- `consent.revoke`
- `context.export`

Handlers fail closed when a grant is missing, revoked, expired, bound to a
different client, or missing the method's required scope.
