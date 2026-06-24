# Personal Context Protocol

PCP is the Personal Context Protocol. It lets an AI application ask for only
the personal context it is allowed to use, for a stated purpose, and receive a
structured ContextPack with provenance, confidence, sensitivity, freshness, and
auditability built in.

PCP is inspired by MCP's protocol discipline, but it is not MCP. MCP connects
AI systems to tools and external systems. PCP connects AI systems to
user-owned personal context.

This repository contains a complete PCP v0.1 reference implementation:

- `packages/protocol`: TypeScript/Zod schemas, JSON-RPC types, PCP errors, and generated JSON Schema.
- `server`: Local-first Fastify reference server with SQLite persistence.
- `client`: Small TypeScript client and CLI.
- `examples`: Seed data, curl requests, and a runnable demo client.
- `specs`: Protocol reference for implementers.
- `docs`: Plain-language guides for new users and developers.

## Who This Is For

If you are not a protocol expert, start here:

1. [Documentation Map](docs/index.md)
2. [What PCP Is](docs/what-is-pcp.md)
3. [Getting Started](docs/getting-started.md)
4. [How PCP Works](docs/how-it-works.md)

If you are building an implementation:

1. [Developer Guide](docs/developer-guide.md)
2. [Method Reference](specs/methods.md)
3. [Object Reference](specs/objects.md)
4. [Security Model](specs/security.md)

## Quick Start

Requirements:

- Node.js 24 or newer
- Corepack

```bash
corepack enable
pnpm install
pnpm build
pnpm test
pnpm seed
pnpm dev
```

In another terminal:

```bash
pnpm demo
```

Expected demo result:

- initialization succeeds
- server capabilities are returned
- a ContextPack is returned
- context search returns matching items
- a memory proposal is stored as `pending`
- consent grants are listed
- context export returns JSON

The reference server runs at:

```text
http://127.0.0.1:8787/pcp
```

It expects:

```text
Authorization: Bearer pcp_demo_token
```

## What PCP v0.1 Can Do

A PCP client can:

- initialize and discover server capabilities
- request scoped personal context for a task
- receive a ContextPack
- search personal context
- propose a memory update
- create memory only when `memory.write` is granted
- read its own consent grants
- revoke its own access
- export context as JSON
- preserve provenance, confidence, sensitivity, and freshness metadata
- write audit logs for meaningful reads, writes, denials, and exports

## What PCP v0.1 Does Not Include

PCP v0.1 is intentionally small:

- no OAuth
- no hosted identity system
- no vector database
- no LLM dependency
- no streaming
- no frontend UI
- no MCP SDK dependency

Those omissions keep the protocol understandable, testable, and easy to run
locally.

## Basic Request

All protocol calls use JSON-RPC 2.0 over `POST /pcp`.

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "pcp.context.request",
  "params": {
    "grantId": "grant_demo_codex",
    "purpose": "Help the user continue PCP design and implementation",
    "task": "Implement PCP v0.1 reference server",
    "contextTypes": ["Project", "DecisionHistory", "MemoryItem"],
    "maxItems": 20,
    "freshnessPreference": "recent_first",
    "includeSources": true,
    "includeConfidence": true
  }
}
```

Successful responses look like this:

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {}
}
```

Errors look like this:

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "error": {
    "code": -32001,
    "message": "Consent grant is missing or revoked",
    "data": {}
  }
}
```

## Demo Data

The demo seed creates:

- user `user_demo`
- client `codex-local`
- grant `grant_demo_codex`
- context items about PCP goals, preferences, decisions, and communication style

The demo grant includes every v0.1 scope so local examples can exercise the
whole protocol.

## Main Commands

```bash
pnpm install          # install workspace dependencies
pnpm build            # build protocol, server, client, and demo
pnpm test             # run protocol, client, and server tests
pnpm typecheck        # typecheck all packages
pnpm generate:schema  # regenerate JSON Schema from Zod schemas
pnpm seed             # seed the local SQLite demo database
pnpm dev              # start the reference server
pnpm demo             # run the demo client
```

## Repository Map

```text
packages/protocol/   Protocol source of truth
server/              Reference server
client/              Reference client and CLI
examples/            Demo client, curl scripts, seed context
specs/               Implementer-facing protocol reference
docs/                Plain-language and developer guides
```

## Learn More

- [What PCP Is](docs/what-is-pcp.md)
- [Getting Started](docs/getting-started.md)
- [How PCP Works](docs/how-it-works.md)
- [Glossary](docs/glossary.md)
- [Developer Guide](docs/developer-guide.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Protocol Spec](specs/pcp-v0.1.md)
