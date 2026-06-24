# PCP v0.1

PCP v0.1 defines a small local-first protocol for scoped access to user-owned
personal context.

The protocol uses JSON-RPC 2.0 over a single HTTP endpoint. It intentionally
does not include streaming, OAuth, vector search, LLM calls, or MCP SDK
dependencies.

Required protocol version: `2026-06-24`.

## Mission

A PCP client can:

1. Initialize and discover capabilities.
2. Request scoped personal context for a task.
3. Receive a provenance-rich ContextPack.
4. Search personal context.
5. Propose memory updates.
6. Create memory only when `memory.write` is granted.
7. Read its own consent grants.
8. Revoke its own access.
9. Export context when scope allows it.
10. Preserve provenance, confidence, sensitivity, and freshness metadata.
11. Audit every meaningful access or mutation.
