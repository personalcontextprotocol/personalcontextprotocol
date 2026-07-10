# Personal Context Protocol

PCP is the Personal Context Protocol v0.1 alpha. It is an open protocol proposal
and reference implementation for letting an AI application ask for only the
personal context it is allowed to use, for a stated purpose, and receive a
structured ContextPack with provenance, confidence, sensitivity, freshness, and
auditability built in.

PCP v0.1 is not a finished standard. The repository is intended to make the
model concrete enough to run, inspect, test, critique, and improve.

PCP is inspired by MCP's protocol discipline, but it is not MCP. MCP connects
AI systems to tools and external systems. PCP connects AI systems to
user-owned personal context.

This repository contains the runnable PCP v0.1 alpha reference implementation:

- `packages/protocol`: TypeScript/Zod schemas, JSON-RPC types, PCP errors, generated JSON Schema, generated contract metadata, and conformance fixtures.
- `server`: Fastify reference server configured for local development with SQLite persistence.
- `client`: TypeScript SDK and CLI.
- `sdk/rust/pcp-sdk`: Rust SDK crate.
- `examples`: Seed data, curl requests, a runnable demo client, and SDK examples.
- `specs`: Versioned protocol specification for implementers.
- `docs`: Plain-language guides for new users and developers.
- `paper`: Technical whitepaper for review.

## Alpha Status

PCP v0.1 is intentionally limited:

- it is a proposal, not a ratified standard
- the reference server is configured for local development and protocol review
- consent grants are seeded locally for demonstration
- the demo token is not a production identity model
- audit logs are stored locally in SQLite
- no compatibility promise is made beyond the v0.1 alpha line

Production systems should treat this repository as protocol groundwork and a
reference implementation, not as a packaged hosted context service.

## Choose Your Path

If you are new to PCP:

1. [Documentation Map](docs/index.md)
2. [What PCP Is](docs/what-is-pcp.md)
3. [Getting Started](docs/getting-started.md)
4. [How PCP Works](docs/how-it-works.md)

If you are building an AI application that consumes personal context:

1. [Getting Started](docs/getting-started.md)
2. [SDK Guide](docs/sdk/index.md)
3. [Method Reference](specs/methods.md)
4. [Scopes](specs/scopes.md)

If you are implementing a PCP server, SDK, or compatible client:

1. [Developer Guide](docs/developer-guide.md)
2. [PCP Specification](specs/index.md)
3. [Object Reference](specs/objects.md)
4. [Protocol Transport](specs/protocol.md)
5. [Security Model](specs/security.md)

If you are reviewing the proposal:

1. [Whitepaper](paper/pcp-v0.1-whitepaper.md)
2. [Security Model](specs/security.md)
3. [Audit Model](specs/audit.md)
4. [Production V1 Readiness](docs/production-v1-readiness.md)

## Quick Start

Requirements:

- Node.js 24 or newer
- Corepack

```bash
corepack enable
pnpm install
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
- audit logs are written to local SQLite

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
- delete memory only when `memory.write` is granted
- read its own consent grants
- revoke its own access
- list scoped audit entries
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

These are not deployment restrictions. A production implementation can add
hosted identity, stronger auth, encrypted storage, retrieval systems, or model
integrations around the protocol while preserving PCP's consent, scope,
provenance, sensitivity, freshness, and audit requirements.

## Basic Request

All protocol calls use JSON-RPC 2.0 over `POST /pcp`.

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "pcp.context.request",
  "params": {
    "grantId": "grant_demo_assistant",
    "purpose": "Help the user prepare for a project planning session",
    "task": "Summarize current goals, preferences, and relevant decisions",
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
- client `sample-assistant`
- grant `grant_demo_assistant`
- context items about PCP goals, preferences, decisions, and communication style

The demo grant includes every v0.1 scope so local examples can exercise the
whole protocol.

Inspect recent audit logs after running the demo:

```bash
pnpm audit:logs
```

Or query SQLite directly:

```sql
SELECT timestamp, action, result, client_id, grant_id, scope, resource_id
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 20;
```

## Main Commands

```bash
pnpm install             # install workspace dependencies
pnpm build               # build protocol, server, client, and demo
pnpm test                # run protocol, client, and server tests
pnpm typecheck           # typecheck all packages
pnpm check:release       # run the Node-side public-release gate
pnpm generate:schema     # regenerate JSON Schema from Zod schemas
pnpm check:schema        # verify generated JSON Schema is up to date
pnpm check:sdk-contracts # verify generated contract and SDK drift
pnpm seed                # seed the local SQLite demo database
pnpm dev                 # start the reference server
pnpm demo                # run the demo client
pnpm audit:logs          # inspect recent local audit log entries
```

Rust SDK checks require a Rust toolchain:

```bash
cargo fmt --all -- --check
cargo build --workspace
cargo test --workspace
```

## Repository Map

```text
packages/protocol/   Protocol source of truth, generated artifacts, conformance fixtures
server/              Reference server
client/              TypeScript SDK and CLI
sdk/rust/pcp-sdk/    Rust SDK crate
examples/            Demo client, curl scripts, seed context, SDK examples
specs/               Versioned protocol specification
docs/                Plain-language, developer, and SDK guides
paper/               PCP v0.1 technical whitepaper
```

## Learn More

- [What PCP Is](docs/what-is-pcp.md)
- [Getting Started](docs/getting-started.md)
- [How PCP Works](docs/how-it-works.md)
- [Glossary](docs/glossary.md)
- [Developer Guide](docs/developer-guide.md)
- [SDK Guide](docs/sdk/index.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Whitepaper](paper/pcp-v0.1-whitepaper.md)
- [Protocol Spec](specs/index.md)
- [Production V1 Readiness](docs/production-v1-readiness.md)
