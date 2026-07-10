# PCP Agent Development Notes

## Repository Standard

- Treat PCP as a public v0.1 alpha protocol repository and reference implementation, not a finished standard or production hosted service.
- Keep the public posture precise: "v0.1 alpha", "open protocol proposal", and "reference implementation" are acceptable; do not claim ecosystem ratification or production deployment maturity.
- Preserve the protocol boundary. PCP defines consent-scoped personal context exchange; do not blur it into MCP, hosted identity, vector search, a frontend product, or an LLM runtime.
- Do not push changes. The maintainer performs manual review, commits, tags, publishing, release announcements, and any paper submission.

## Contract-First Workflow

- `packages/protocol/src/` is the source of truth for protocol literals, schemas, method names, scopes, and generated contract metadata.
- Generated files must flow from the canonical protocol sources. Do not hand-edit generated schema or Rust generated contract constants except to inspect drift.
- Keep TypeScript and Rust SDK behavior aligned with the canonical contract and shared conformance fixtures.
- Keep protocol examples, specs, docs, tests, and SDK helpers synchronized when behavior changes.
- Avoid hidden defaults, mock-only behavior, hardcoded private values, or duplicated protocol constants.

## Code Patterns

- Protocol schemas live in `packages/protocol/src/schemas/`.
- Method registration lives in `packages/protocol/src/method-registry.ts`.
- Reference server behavior lives under `server/src/`, with protocol dispatch separated from HTTP wiring and persistence services.
- TypeScript SDK behavior lives under `client/src/`.
- Rust SDK behavior lives under `sdk/rust/pcp-sdk/src/`.
- Conformance fixtures live under `packages/protocol/conformance/v0.1/` and should be reused across implementations.
- Keep comments sparse and useful. Prefer tests and clear names over explanatory comments.

## Security and Privacy

- Preserve consent, scope, provenance, sensitivity, freshness, and audit boundaries.
- Any read, denial, mutation, export, or consent action that matters to owner trust should have audit coverage in the reference server.
- Keep the reference server local-first and explicit about alpha security limits.
- Do not introduce production-sounding security claims unless the implementation and tests actually support them.

## Required Verification

Before claiming PCP changes are ready, run:

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm check:schema
pnpm check:sdk-contracts
cargo fmt --all -- --check
cargo build --workspace
cargo test --workspace
```

Use `pnpm check:release` for the Node-side release gate. Run Rust checks separately unless the task is clearly docs-only and cannot affect Rust.

For schema or contract changes, run `pnpm generate:schema` first, then re-run the required checks.
