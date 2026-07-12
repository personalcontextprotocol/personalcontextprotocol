# PCP v0.1 Specification

PCP v0.1 defines a protocol for consent-scoped exchange of user-owned personal
context.

This specification is the public protocol reference for PCP v0.1 alpha. It is
an open protocol proposal. This repository also includes a reference
implementation, SDKs, examples, schemas, and conformance fixtures.

The key words `MUST`, `MUST NOT`, `REQUIRED`, `SHOULD`, `SHOULD NOT`,
`RECOMMENDED`, `MAY`, and `OPTIONAL` are normative only when written in all
capitals.

## Status

- Protocol line: `v0.1-alpha`
- Protocol version: `2026-06-24`
- Contract id: `pcp.v0.1`
- JSON-RPC version: `2.0`
- Transport profile: HTTP JSON-RPC `POST`
- Reference endpoint path: `/pcp`
- Reference server status: alpha implementation configured for local development and protocol review

The protocol is deployment-neutral: it can be implemented by a local app, a
personal server, a private cloud service, a containerized service, or another
owner-controlled runtime. The reference server in this repository defaults to
localhost, SQLite, seeded consent grants, and demo tokens so the protocol can be
run and inspected without hosted infrastructure.

PCP v0.1 does not prescribe a hosted identity provider, OAuth profile,
streaming transport, vector-search engine, LLM runtime, storage backend, or MCP
SDK dependency. PCP implementations MAY provide those pieces if they preserve
PCP's consent, scope, provenance, sensitivity, freshness, and audit
requirements.

## Capability Summary

PCP v0.1 supports:

- initialization and capability discovery
- consent-scoped context requests
- context search
- memory proposals
- direct memory create/delete for clients with `memory.write`
- consent grant listing and revocation
- scoped audit listing
- JSON export of permitted context
- provenance, confidence, sensitivity, and freshness metadata on context items
- audit logging for important access, mutation, denial, grant, audit, and export events

PCP v0.1 does not require a particular user interface, storage engine,
authentication provider, deployment target, retrieval algorithm, or model
provider.

## Normative Sources

The normative source for protocol literals, schemas, method names, defaults,
and contract metadata is the TypeScript/Zod source under:

```text
packages/protocol/src/
```

Generated contract artifacts:

- `packages/protocol/schemas/pcp-v0.1.schema.json`
- `packages/protocol/schemas/pcp-v0.1.contract.json`
- `packages/protocol/conformance/v0.1/`

Generated artifacts are checked in so SDKs and non-TypeScript implementations
can validate against the same contract without copying constants by hand.

See [schema.md](schema.md) for schema and generated-artifact rules.

## Specification Map

- [protocol.md](protocol.md): JSON-RPC envelope, HTTP transport, version negotiation, and errors
- [lifecycle.md](lifecycle.md): setup, initialize, operation, export, audit, and shutdown behavior
- [methods.md](methods.md): method params, results, defaults, and required scopes
- [objects.md](objects.md): protocol object shapes and allowed enum values
- [scopes.md](scopes.md): permission scopes and fail-closed authorization rule
- [authorization-consent.md](authorization-consent.md): draft app-binding and owner-consent profile
- [security.md](security.md): protocol security requirements, reference-server controls, and production implementation requirements
- [audit.md](audit.md): auditable actions and audit result model
- [schema.md](schema.md): schema source of truth, JSON Schema, contract metadata, and conformance fixtures
- [examples.md](examples.md): runnable examples for the reference server and SDK

## Base Protocol

All PCP v0.1 protocol calls use JSON-RPC 2.0 request and response envelopes.

Required protocol version:

```text
2026-06-24
```

Required JSON-RPC version:

```text
2.0
```

Required transport profile:

```text
HTTP POST carrying one JSON-RPC request object per call
```

Each request MUST use a method name defined by the v0.1 contract. Each
protected method MUST validate authentication, grant status, grant expiration,
and required scope before returning protected data or mutating state.

## Design Goals

- Use JSON-RPC 2.0 for messages.
- Use one HTTP endpoint for v0.1.
- Keep protocol schemas separate from server implementation.
- Keep protocol versions, method names, defaults, and compatibility metadata in
  the generated contract instead of SDK-local constants.
- Make consent and scopes explicit.
- Preserve provenance, confidence, sensitivity, and freshness on every context item.
- Write audit logs for meaningful access and mutation.
- Avoid requiring streaming, OAuth, vector search, LLM calls, hosted identity,
  storage backends, or MCP SDK dependencies in v0.1.

## Capabilities

A conforming v0.1 server MUST support:

- `initialize`
- `pcp.context.request`
- `pcp.context.search`
- `pcp.memory.propose`
- `pcp.memory.create`
- `pcp.memory.delete`
- `pcp.consent.list`
- `pcp.consent.revoke`
- `pcp.audit.list`
- `pcp.export.create`

The server advertises supported feature groups in the `initialize` result.
Clients MUST NOT assume support for a capability that the server did not
advertise.

## Required Core Objects

- `AppClient`
- `ConsentGrant`
- `ContextItem`
- `ContextPack`
- `MemoryProposal`
- `AuditLog`

See [objects.md](objects.md).

## Named Defaults

SDKs and servers MAY apply only the defaults named in the v0.1 contract:

- `contextRequestMaxItems`: `20`
- `contextRequestFreshnessPreference`: `recent_first`
- `contextRequestIncludeSources`: `true`
- `contextRequestIncludeConfidence`: `true`
- `contextSearchLimit`: `10`
- `exportFormat`: `json`

Implementations MUST NOT add hidden fallback defaults for endpoints, auth,
timeouts, identity, grant IDs, or method behavior. Convenience examples may use
local demo values only when the docs label them as demo configuration.

## Conformance

A conforming v0.1 server MUST:

- implement all required methods listed in this specification
- require authentication for protected methods
- validate JSON-RPC envelope shape
- validate request params and response results against the v0.1 contract
- validate grant status, grant expiration, and required scope for protected methods
- reject unsupported `protocolVersion` values during `initialize`
- use JSON-RPC `2.0`
- return structured JSON-RPC errors
- exclude restricted context from normal reads and exports
- write audit entries for important access, mutation, denial, and export events

A conforming v0.1 SDK or client MUST:

- reject unsupported `protocolVersion` values during `initialize`
- use JSON-RPC `2.0`
- validate request params and response results against the v0.1 contract
- expose protocol errors instead of hiding them behind generic transport errors
- keep auth, endpoint, and transport behavior explicit configuration

Conformance fixtures live in:

```text
packages/protocol/conformance/v0.1/
```

The v0.1 alpha contract is official for this repository, but it is not a broad
ecosystem standard. The included reference implementation does not claim
production hosted-service maturity.

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

These implementation choices prove the v0.1 contract can run end to end. They
are not protocol requirements unless this specification or the canonical schema
explicitly says so.
