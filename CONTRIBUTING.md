# Contributing to PCP

PCP v0.1 alpha is an open protocol proposal and reference implementation. The
goal of this repository is to make the protocol reviewable, runnable, and
honest about its limits.

## What to Contribute

Good alpha contributions include:

- bug fixes
- documentation corrections
- tests for existing protocol behavior
- schema/spec consistency fixes
- clarity improvements for consent, provenance, sensitivity, freshness, and auditability
- implementation fixes that keep the reference server local-first

Avoid adding new protocol features unless they are needed to make v0.1 credible
or to remove ambiguity in the existing model.

## Local Setup

Requirements:

- Node.js 24 or newer
- Corepack

```bash
corepack enable
pnpm install
pnpm typecheck
pnpm build
pnpm test
pnpm check:schema
pnpm check:sdk-contracts
```

## Demo Path

```bash
pnpm install
pnpm seed
pnpm dev
pnpm demo
```

Run `pnpm dev` and `pnpm demo` in separate terminals.

## Schema Changes

Protocol schemas are authored in:

```text
packages/protocol/src/schemas/
```

After changing schemas, run:

```bash
pnpm generate:schema
pnpm check:schema
```

Commit generated schema changes with the source changes.

## Contract and SDK Drift

PCP keeps one canonical contract and verifies generated artifacts and SDK
constants against it. Before claiming a protocol, SDK, or reference server
change is ready, run:

```bash
pnpm check:release
cargo fmt --all -- --check
cargo build --workspace
cargo test --workspace
```

`pnpm check:release` runs the Node-side typecheck, build, tests, generated
schema check, and SDK contract drift check.

## Pull Requests

Before opening a pull request:

- run typecheck, build, tests, schema check, SDK drift check, and Rust checks
- update specs or docs when behavior changes
- keep protocol claims precise
- call out any security or privacy implications
- avoid unrelated formatting churn

## Code of Conduct

Participation is covered by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Security

Report suspected vulnerabilities privately. See [SECURITY.md](SECURITY.md).
