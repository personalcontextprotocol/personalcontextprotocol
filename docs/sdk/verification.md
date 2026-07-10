# SDK Verification Notes

Last local verification: 2026-07-06.

## Passed Locally

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

The local `pnpm test` run now exercises shared PCP v0.1 conformance fixtures
through:

- `packages/protocol/tests/conformance.test.ts`
- `client/tests/client.test.ts`
- `server/tests/server.test.mjs`

The Rust SDK also exercises the same fixtures in
`sdk/rust/pcp-sdk/tests/conformance.rs`.

`pnpm check:sdk-contracts` verifies, without a Rust toolchain, that:

- generated Rust contract constants, including method names and reference-server
  initialize metadata, match `pcp-v0.1.contract.json`
- shared conformance fixtures match the canonical contract
- the context request fixture omits fields that must exercise named defaults
- the Rust crate remains `publish = false`
- Rust source files do not reintroduce protocol literals outside
  `generated_contract.rs`

## Generated Artifacts

`pnpm check:schema` regenerates and compares:

- `packages/protocol/schemas/pcp-v0.1.schema.json`
- `packages/protocol/schemas/pcp-v0.1.contract.json`
- `sdk/rust/pcp-sdk/src/generated_contract.rs`

The check is content-based, so it works in an uncommitted worktree and fails
only when checked-in generated artifacts do not match the canonical sources.

## Rust Toolchain

Rust verification was completed locally with `cargo 1.96.0` and
`rustc 1.96.0`.
