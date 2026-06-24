# Personal Context Protocol

PCP is an open protocol for connecting AI systems to user-owned personal
context. It is inspired by MCP's discipline, but it is not MCP: PCP v0.1 is
focused only on scoped context access, provenance-rich ContextPacks, consent
grants, memory proposals, exports, and audit logging.

This repository contains a working PCP v0.1 reference implementation:

- `packages/protocol`: TypeScript and Zod protocol schemas plus generated JSON Schema.
- `server`: Local-first Fastify reference server using JSON-RPC 2.0 over one HTTP endpoint.
- `client`: Small TypeScript client and CLI.
- `examples`: Seed context, curl examples, and a runnable demo client.
- `specs`: Human-readable protocol specification.

## Quick Start

```bash
corepack enable
pnpm install
pnpm build
pnpm test
pnpm --filter @pcp/server seed
pnpm --filter @pcp/server dev
```

In another terminal:

```bash
pnpm --filter @pcp/demo-client demo
```

The reference server binds to `127.0.0.1:8787` by default and expects:

```bash
Authorization: Bearer pcp_demo_token
```

The demo seed creates:

- client `codex-local`
- user `user_demo`
- grant `grant_demo_codex`
- context items covering PCP design, goals, preferences, and decisions

## JSON-RPC Endpoint

All protocol requests use `POST /pcp` with JSON-RPC 2.0 envelopes:

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

## v0.1 Methods

- `initialize`
- `pcp.context.request`
- `pcp.context.search`
- `pcp.memory.propose`
- `pcp.memory.create`
- `pcp.consent.list`
- `pcp.consent.revoke`
- `pcp.export.create`

## Security

PCP v0.1 is intentionally local-first:

- Bearer-token auth from `.env`
- localhost binding by default
- browser Origin validation
- grant status and scope validation for every method
- audit logging for meaningful reads, writes, denials, and exports

See [specs/security.md](specs/security.md) and [specs/audit.md](specs/audit.md).
