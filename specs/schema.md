# Schema Reference

PCP v0.1 uses schema-first protocol definition.

The canonical schema source is:

```text
packages/protocol/src/
```

The generated machine-readable artifacts are:

```text
packages/protocol/schemas/pcp-v0.1.schema.json
packages/protocol/schemas/pcp-v0.1.contract.json
packages/protocol/conformance/v0.1/
```

## Source of Truth

Protocol versions, JSON-RPC versions, method names, default values, error codes,
scope names, object shapes, and enum values MUST come from
`packages/protocol/src/`.

SDKs and reference implementations MUST NOT copy those values into package-local
constants unless they are generated from the canonical contract.

## JSON Schema

`pcp-v0.1.schema.json` is generated from the TypeScript/Zod schemas. It is
intended for validation, documentation, and non-TypeScript implementations.

Consumers SHOULD treat the generated JSON Schema as read-only output. Changes
belong in the canonical TypeScript/Zod source, followed by regeneration.

## Contract Metadata

`pcp-v0.1.contract.json` contains the v0.1 contract metadata used by SDKs and
contract verifiers:

- contract id
- protocol version
- compatibility line
- JSON-RPC version
- reference transport metadata
- supported auth scheme metadata
- named defaults
- canonical method names
- reference server information

## Conformance Fixtures

The conformance fixtures under `packages/protocol/conformance/v0.1/` are shared
test inputs and outputs for SDKs, servers, and independent implementations.

Conforming implementations SHOULD run fixture-backed tests that prove:

- supported initialize requests are accepted
- unsupported protocol versions are rejected
- named defaults are applied consistently
- scope-denied errors use the canonical error shape
- JSON-RPC request and response envelopes are handled consistently

## Generated Artifact Rules

After changing protocol source files, run:

```bash
pnpm generate:schema
pnpm check:schema
pnpm check:sdk-contracts
```

Generated artifacts MUST be committed with the source change that produced them.
Release verification MUST fail if generated artifacts drift from canonical
sources.
