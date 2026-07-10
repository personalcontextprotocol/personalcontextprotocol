# PCP Specification

This directory contains the versioned public specification for PCP v0.1 alpha.

PCP is a deployment-neutral protocol for consent-scoped personal context
exchange. The reference implementation in this repository is configured for
local development and protocol review, but the protocol can be implemented by
local apps, self-hosted services, private cloud services, containers, or other
owner-controlled runtimes.

## Current Version

- [PCP v0.1 Specification](pcp-v0.1.md)
- Protocol version: `2026-06-24`
- Compatibility line: `v0.1-alpha`
- Contract id: `pcp.v0.1`

## Reference Sections

- [Protocol Transport](protocol.md): JSON-RPC envelope, HTTP transport, version negotiation, and errors
- [Lifecycle](lifecycle.md): setup, initialization, operation, audit, export, and shutdown
- [Methods](methods.md): method params, result payloads, defaults, and required scopes
- [Objects](objects.md): protocol object shapes and enum values
- [Scopes](scopes.md): permission scopes and fail-closed authorization
- [Security](security.md): protocol security requirements and reference-server controls
- [Audit](audit.md): audit actions and result model
- [Schema Reference](schema.md): canonical schema source, generated artifacts, and conformance fixtures
- [Examples](examples.md): runnable examples for the reference implementation and SDK

## Machine-Readable Contract

The canonical protocol source lives under:

```text
packages/protocol/src/
```

Generated artifacts live under:

```text
packages/protocol/schemas/pcp-v0.1.schema.json
packages/protocol/schemas/pcp-v0.1.contract.json
packages/protocol/conformance/v0.1/
```

## Status

PCP v0.1 alpha is an open protocol proposal. This repository includes a
reference implementation for public review and implementation feedback. PCP
v0.1 is not a ratified standard, and this release does not ship a production
hosted service.
