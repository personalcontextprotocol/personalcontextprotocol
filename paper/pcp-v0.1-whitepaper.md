# Personal Context Protocol v0.1 Alpha

An open protocol proposal and reference implementation for consent-scoped,
provenance-aware personal context exchange.

## Abstract

Personal AI systems increasingly need context about a person's projects,
preferences, decisions, history, and working style. Without a clear protocol,
that context tends to become over-collected, under-audited, stale, and difficult
to move between applications.

The Personal Context Protocol (PCP) v0.1 alpha proposes a small protocol model
for requesting personal context with explicit consent, scoped purpose, structured
provenance, confidence, sensitivity, freshness, and auditability. This paper
describes the v0.1 model, its relationship to MCP, the reference implementation,
and the known limitations of the alpha.

PCP v0.1 is not a finished standard. It is a concrete proposal intended for
review, experimentation, and implementation feedback.

## Motivation

Useful AI assistance often depends on personal context: what a person is
working on, what they previously decided, what they prefer, what constraints
matter, and what information should not be reused. Today this context is often
embedded inside individual applications or chat histories. That makes it hard
to inspect, hard to revoke, and hard to distinguish evidence from inference.

PCP starts from four goals:

1. Applications should request only the context they need for a stated purpose.
2. Consent should be explicit, scoped, revocable, and auditable.
3. Context should carry metadata about source, confidence, sensitivity, and freshness.
4. Memory updates should be proposals or explicitly granted writes, not hidden side effects.

The v0.1 reference implementation keeps the model small so developers can run it
locally and inspect every moving part.

## Relation to MCP

PCP is inspired by MCP's protocol discipline, but it is not MCP.

MCP connects AI systems to tools, data sources, and external systems. PCP
focuses on personal context: scoped retrieval, consent grants, provenance,
sensitivity, freshness, and audit logs around the use of information about a
person.

The two ideas can be complementary. An MCP-enabled agent could use a PCP server
as one source of personal context, but PCP does not require the MCP SDK and does
not define tool execution.

## Protocol Model

PCP v0.1 uses JSON-RPC 2.0 over HTTP. The reference server exposes one endpoint:

```text
POST /pcp
```

The protocol model has five main actors and objects:

- A user owns or controls personal context.
- An app client requests context for a purpose.
- A consent grant binds a client to scopes and status.
- Context items hold structured personal context plus metadata.
- ContextPacks return selected context for a particular request.

The v0.1 method set covers initialization, context request, context search,
memory proposal, direct memory create/delete with an explicit write scope,
consent listing, consent revocation, scoped audit listing, and context export.

## Consent and Scopes

Consent grants are the enforcement boundary in v0.1. A protected method checks
that the grant exists, is active, is not expired, and includes the scope required
for that method.

The v0.1 scope model is intentionally small:

- `context.read`
- `context.search`
- `context.audit.read`
- `memory.propose`
- `memory.write`
- `consent.read`
- `consent.revoke`
- `context.export`

This is not a complete production authorization model. It is a minimum shape for
reviewing whether context requests, memory proposals, and exports can be
separated in a clear protocol.

## ContextPacks

A ContextPack is the structured response to a context request. It contains the
context items selected for the task, plus request-level metadata such as purpose,
task, issued time, and grant identifier.

The goal of a ContextPack is to give an AI application useful context without
handing it an unbounded personal data dump. ContextPacks are intended to be
small, scoped, inspectable, and auditable.

## Provenance, Confidence, Sensitivity, and Freshness

Each context item carries metadata that helps downstream systems understand how
to use it:

- Provenance records where the item came from.
- Confidence represents how reliable the item is believed to be.
- Sensitivity marks whether an item is low, medium, high, or restricted.
- Freshness records timestamps and freshness semantics.

The reference server excludes `restricted` items from normal ContextPacks and
exports. This is a simple alpha policy, not a complete privacy framework.

## Memory Proposals

PCP separates memory proposals from direct memory writes.

`pcp.memory.propose` lets a client suggest a memory update with a reason. The
proposal is stored as pending. This supports review workflows where an owner or
trusted system can decide whether the proposal should become durable memory.

`pcp.memory.create` and `pcp.memory.delete` exist for clients with the explicit
`memory.write` scope. Production implementations should be careful with this
scope because it allows a client to mutate the personal context store directly.

## Auditability

The reference server writes audit entries for important reads, writes, denials,
revocations, and exports. Audit records include action, result, client, grant,
scope, resource, timestamp, and optional details.

For local verification, run:

```bash
pnpm audit:logs
```

Or inspect SQLite directly:

```sql
SELECT timestamp, action, result, client_id, grant_id, scope, resource_id
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 20;
```

The v0.1 audit model is deliberately simple. It demonstrates that auditability
belongs in the protocol and implementation path, but it does not yet define a
full operational audit review system.

Clients with `context.audit.read` can call `pcp.audit.list` to inspect scoped
audit entries visible under a grant.

## Reference Implementation

The repository includes:

- TypeScript/Zod protocol schemas and generated JSON Schema.
- Generated contract metadata and conformance fixtures.
- A Fastify reference server with local SQLite persistence.
- A TypeScript client and CLI.
- A Rust SDK crate.
- A demo client, curl examples, and SDK examples.
- Specs and plain-language documentation.

The demo path is:

```bash
pnpm install
pnpm seed
pnpm dev
pnpm demo
pnpm audit:logs
```

The reference server binds to `127.0.0.1` by default and uses a demo bearer
token. It is configured for protocol review and local development, not
production authentication.

## Limitations

PCP v0.1 alpha does not prescribe:

- OAuth or hosted identity
- production token rotation
- hosted multi-user or multi-tenant authorization
- owner-facing grant management UI
- vector retrieval
- LLM integration
- streaming
- encryption-at-rest policy
- distributed sync
- compatibility guarantees beyond v0.1 alpha

The bundled reference server should not be deployed as a public hosted service
without substantial additional security, privacy, operational, and application
work.
That deployment warning is about this implementation, not about the protocol's
ability to support hosted or self-hosted runtimes.

## Future Work

Open areas for future versions include:

- stronger grant issuance and owner approval flows
- production authentication profiles
- portable audit review formats
- richer freshness and expiration semantics
- memory proposal review lifecycle
- interoperability profiles with MCP-enabled applications
- broader conformance test coverage across independent implementations
- privacy-preserving sync and backup models
- clearer migration rules between protocol versions

## Rendering to PDF

The canonical source is this Markdown file. If Pandoc is available locally, a
PDF can be rendered with:

```bash
pandoc paper/pcp-v0.1-whitepaper.md -o paper/pcp-v0.1-whitepaper.pdf
```

PDF rendering is optional and is not required for the v0.1 alpha repository to
build or test.
