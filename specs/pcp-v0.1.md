# PCP v0.1 Specification

PCP v0.1 defines a small local-first protocol for scoped access to user-owned
personal context.

PCP v0.1 now has an official alpha contract in this repository. The normative
source is the TypeScript/Zod schema set under `packages/protocol/src`; generated
artifacts are checked in for SDKs and non-TypeScript implementations.

Generated contract artifacts:

- `packages/protocol/schemas/pcp-v0.1.schema.json`
- `packages/protocol/schemas/pcp-v0.1.contract.json`
- `packages/protocol/conformance/v0.1/`

Required protocol version:

```text
2026-06-24
```

Required JSON-RPC version:

```text
2.0
```

Required reference transport:

```text
HTTP POST carrying one JSON-RPC request object per call
```

## Design Goals

- Use JSON-RPC 2.0 for messages.
- Use one HTTP endpoint for v0.1.
- Keep protocol schemas separate from server implementation.
- Keep protocol versions, method names, defaults, and compatibility metadata in
  the generated contract instead of SDK-local constants.
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

## Named Defaults

SDKs and servers may apply only the defaults named in the v0.1 contract:

- `contextRequestMaxItems`: `20`
- `contextRequestFreshnessPreference`: `recent_first`
- `contextRequestIncludeSources`: `true`
- `contextRequestIncludeConfidence`: `true`
- `contextSearchLimit`: `10`
- `exportFormat`: `json`

Implementations must not add hidden fallback defaults for endpoints, auth,
timeouts, identity, grant IDs, or method behavior. Convenience examples may use
local demo values only when the docs label them as demo configuration.

## Compatibility

The compatibility line is `v0.1-alpha`.

A conforming v0.1 SDK or server must:

- reject unsupported `protocolVersion` values during `initialize`
- use JSON-RPC `2.0`
- validate request params and response results against the v0.1 contract
- expose protocol errors instead of hiding them behind generic transport errors
- keep auth, endpoint, and transport behavior explicit configuration

The v0.1 alpha contract is official for this repository, but it is not a broad
ecosystem standard and does not claim production hosted-service maturity.

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
- generated contract metadata
- shared conformance fixtures
- Fastify HTTP server
- SQLite persistence
- TypeScript SDK
- Rust SDK
- CLI and curl examples
- tests
- demo seed data
