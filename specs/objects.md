# Objects

The canonical machine-readable schemas live in `packages/protocol/src/schemas`
and generate `packages/protocol/schemas/pcp-v0.1.schema.json`.

Core objects:

- AppClient
- ConsentGrant
- PermissionScope
- ContextItem
- ContextPack
- MemoryProposal
- AuditLog

Every ContextItem must include source provenance, confidence, sensitivity, and
freshness metadata.
