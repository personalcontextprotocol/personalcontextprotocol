# Developer Guide

This guide is for developers who want to understand or extend the PCP v0.1
reference implementation.

## Architecture

```text
packages/protocol
  TypeScript/Zod protocol source of truth
  JSON-RPC envelope types
  PCP-specific error codes
  generated JSON Schema

server
  Fastify HTTP server
  one JSON-RPC endpoint: POST /pcp
  bearer auth and origin guard
  SQLite persistence
  consent and scope validation
  protocol dispatcher and handlers
  audit logging

client
  small TypeScript JSON-RPC client
  CLI wrapper

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

The generated file is:

```text
packages/protocol/schemas/pcp-v0.1.schema.json
```

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

For v0.1, security is local-first:

- one bearer token from environment config
- localhost bind by default
- browser Origin validation
- every protected method validates grant status and scope
- direct memory creation requires `memory.write`
- restricted sensitivity context is excluded from context packs and exports

Do not treat the v0.1 reference server as a production hosted multi-tenant auth
system.

## Testing

Run all checks:

```bash
pnpm typecheck
pnpm build
pnpm test
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
