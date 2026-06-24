# Audit

The server writes AuditLog entries for:

- context requests
- returned ContextPacks
- searches
- memory proposals
- direct memory writes
- consent listing
- consent revocation
- exports
- auth denials
- validation errors

Audit entries include user id, client id, grant id, action, scope, resource id,
timestamp, result, and optional details.
