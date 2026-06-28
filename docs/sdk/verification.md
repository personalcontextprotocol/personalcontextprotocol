# SDK Verification Notes

Last local verification: 2026-06-28.

## Passed Locally

```bash
pnpm typecheck
pnpm test
pnpm build
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

- generated Rust contract constants match `pcp-v0.1.contract.json`
- shared conformance fixtures match the canonical contract
- the context request fixture omits fields that must exercise named defaults
- the Rust crate remains `publish = false`
- Rust source files do not reintroduce protocol literals outside
  `generated_contract.rs`

## Generated Artifacts

`pnpm check:schema` regenerated `packages/protocol/schemas/pcp-v0.1.schema.json`
`packages/protocol/schemas/pcp-v0.1.contract.json`, and
`sdk/rust/pcp-sdk/src/generated_contract.rs`.

In this uncommitted worktree, `pnpm check:schema` exits non-zero because the
checked-in generated files intentionally differ from `HEAD`; the expected
schema change is that JSON-RPC success responses now require `result`, and the
Rust contract module is generated from the v0.1 contract metadata.

After these changes are committed, CI should run the same command from a clean
checkout.

## Rust Toolchain

Rust verification was completed locally with `cargo 1.96.0` and
`rustc 1.96.0`.
