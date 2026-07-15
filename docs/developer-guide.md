# Developer Guide

This guide is for developers who want to understand or extend the PCP v0.1
alpha reference implementation.

PCP v0.1 is an open protocol proposal and runnable reference implementation,
not a finished standard.

## Architecture

```text
packages/protocol
  TypeScript/Zod protocol source of truth
  JSON-RPC envelope types
  PCP-specific error codes
  generated JSON Schema
  generated v0.1 contract metadata
  shared conformance fixtures

server
  Fastify HTTP server
  one JSON-RPC endpoint: POST /pcp
  bearer auth and origin guard
  SQLite persistence
  consent and scope validation
  protocol dispatcher and handlers
  audit logging

sdk/typescript
  TypeScript SDK
  CLI wrapper

sdk/rust
  Rust SDK crate
  async transport abstraction
  conformance tests over shared fixtures

examples
  demo client
  curl scripts
  seed context sample
```

## Protocol Source of Truth

The canonical schemas live in:

```text
packages/protocol/src/schemas/
```

After editing schemas, regenerate JSON Schema:

```bash
pnpm generate:schema
```

Before submitting a change, verify the checked-in generated schema is current:

```bash
pnpm check:schema
```

The generated files are:

```text
packages/protocol/schemas/pcp-v0.1.schema.json
packages/protocol/schemas/pcp-v0.1.contract.json
```

The shared conformance fixtures live in:

```text
packages/protocol/conformance/v0.1/
```

SDKs should consume those generated artifacts and fixtures rather than copying
method names, protocol versions, JSON-RPC versions, or named defaults into
package-local constants.

## Server Request Path

The server request path is:

```text
server/src/http/pcpRoute.ts
server/src/protocol/dispatcher.ts
server/src/protocol/handlers/*
server/src/services/*
server/src/db/*
```

The route handles HTTP concerns:

- bearer auth
- origin validation
- JSON-RPC response transport

The dispatcher handles protocol method selection.

Handlers parse method params and call services.

Services own consent checks, context retrieval, memory writes, exports, and
audit logging.

## Adding a Method

1. Add method name to `packages/protocol/src/constants.ts`.
2. Add param and result schemas to `packages/protocol/src/schemas/methods.ts`.
3. Export any new types through `packages/protocol/src/schemas/types.ts`.
4. Add a handler under `server/src/protocol/handlers/`.
5. Wire the handler in `server/src/protocol/dispatcher.ts`.
6. Add or update service code under `server/src/services/`.
7. Add tests.
8. Regenerate JSON Schema.
9. Update `specs/methods.md`.
10. Add or update shared conformance fixtures.
11. Update SDK tests if the method surface changes.

## Local Database

The reference server uses Node's built-in SQLite support through
`node:sqlite`.

Default database path:

```text
.pcp/pcp.sqlite
```

Schema definition:

```text
server/src/db/schema.ts
```

Demo seed:

```text
server/src/demo/seedContext.ts
server/src/db/seed.ts
```

## Security Boundary

For the v0.1 reference server, security is configured for local development:

- one bearer token from environment config
- localhost bind by default
- browser Origin validation
- every protected method validates grant status and scope
- direct memory creation requires `memory.write`
- restricted sensitivity context is excluded from context packs and exports

Do not treat the v0.1 reference server as a production hosted multi-tenant auth
system. The PCP protocol itself is deployment-neutral; production or hosted
servers need stronger identity, key-management, audit-review, and operational
controls.

## Audit Inspection

The reference server writes audit entries to the local SQLite database for
meaningful access, mutation, denial, and export events.

After running the demo, inspect recent audit logs:

```bash
pnpm audit:logs
```

Equivalent SQLite query:

```sql
SELECT timestamp, action, result, client_id, grant_id, scope, resource_id
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 20;
```

## Testing

Run all checks:

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm check:schema
```

Rust SDK checks:

```bash
cargo fmt --all -- --check
cargo build --workspace
cargo test --workspace
```

Server integration tests use Node's built-in test runner because the server
uses the Node `node:sqlite` runtime module.

## Environment Variables

See `.env.example`.

Important variables:

- `PCP_HOST`
- `PCP_PORT`
- `PCP_DEMO_TOKEN`
- `PCP_DATABASE_PATH`
- `PCP_ALLOWED_ORIGINS`
