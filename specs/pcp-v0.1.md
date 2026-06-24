# PCP v0.1 Specification

PCP v0.1 defines a small local-first protocol for scoped access to user-owned
personal context.

Required protocol version:

```text
2026-06-24
```

## Design Goals

- Use JSON-RPC 2.0 for messages.
- Use one HTTP endpoint for v0.1.
- Keep protocol schemas separate from server implementation.
- Make consent and scopes explicit.
- Preserve provenance, confidence, sensitivity, and freshness on every context item.
- Write audit logs for meaningful access and mutation.
- Avoid streaming, OAuth, vector search, LLM calls, and MCP SDK dependencies in v0.1.

## Required Capabilities

A conforming v0.1 server should support:

- `initialize`
- `pcp.context.request`
- `pcp.context.search`
- `pcp.memory.propose`
- `pcp.memory.create`
- `pcp.consent.list`
- `pcp.consent.revoke`
- `pcp.export.create`

## Required Core Objects

- `AppClient`
- `ConsentGrant`
- `ContextItem`
- `ContextPack`
- `MemoryProposal`
- `AuditLog`

See [objects.md](objects.md).

## Required Security Behavior

- Reject unauthenticated requests.
- Validate grant status.
- Validate grant expiration.
- Validate required scope for each protected method.
- Exclude restricted context from normal reads and exports.
- Record audit entries for important access, mutation, denial, and export events.

See [security.md](security.md) and [audit.md](audit.md).

## Reference Implementation Status

This repository implements PCP v0.1 with:

- TypeScript schemas
- generated JSON Schema
- Fastify HTTP server
- SQLite persistence
- TypeScript client
- CLI and curl examples
- tests
- demo seed data
