# PCP v0.1 Alpha Release Readiness

This document is the maintainer-facing release checklist for PCP v0.1 alpha.
It prepares the repository for public review without performing manual release
actions such as pushing, tagging, publishing packages, posting announcements, or
submitting the whitepaper.

## Public Positioning

Use this wording:

- PCP v0.1 alpha
- open protocol proposal
- local-first reference implementation
- TypeScript and Rust SDKs for the canonical v0.1 alpha contract

Avoid this wording:

- finished standard
- ratified ecosystem protocol
- production hosted context service
- complete security or privacy framework

## Repository Requirements

Before public release, the repository should contain:

- clear README quick start and status boundaries
- protocol specs under `specs/`
- user and implementer docs under `docs/`
- canonical TypeScript protocol package under `packages/protocol/`
- TypeScript client under `client/`
- Rust SDK under `sdk/rust/pcp-sdk/`
- local-first reference server under `server/`
- runnable examples under `examples/`
- governance files: `LICENSE`, `SECURITY.md`, `CONTRIBUTING.md`,
  `CODE_OF_CONDUCT.md`, `CHANGELOG.md`, and `CITATION.cff`
- GitHub issue templates, pull request template, and CI workflow
- PCP-scoped `AGENTS.md` for repeatable agent behavior

## Required Verification

Run the Node-side release gate:

```bash
pnpm check:release
```

Run Rust SDK checks:

```bash
cargo fmt --all -- --check
cargo build --workspace
cargo test --workspace
```

For schema or contract changes, run this first and commit generated artifacts
with the source change:

```bash
pnpm generate:schema
```

## Manual Release Actions

The maintainer owns these actions after review:

- inspect `git diff`
- commit changes
- push to GitHub
- create or update repository description and topics
- enable private vulnerability reporting if desired
- create a GitHub release or tag
- publish npm or Rust packages if and when package publication is desired
- publish announcements or submit the whitepaper

## Current Launch Standard

PCP is ready for public release when the repository can honestly support this
claim:

> PCP v0.1 alpha is a runnable, documented, contract-first open protocol
> proposal and reference implementation for consent-scoped, provenance-aware
> personal context exchange. It is ready for public review and implementation
> feedback, but it is not a ratified standard or production hosted service.
