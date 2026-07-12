# Production V1 Readiness

PCP v0.1 alpha is ready for protocol review when the release gates pass and the
public docs accurately describe the implemented contract. It is not a
production-ready V1 system.

This page tracks the main gaps between the v0.1 alpha reference implementation
and a future production-grade implementation or V1 profile.

## Current Alpha Baseline

The repository currently provides:

- an open protocol proposal for consent-scoped personal context exchange
- canonical TypeScript/Zod protocol sources under `packages/protocol/src/`
- generated JSON Schema, contract metadata, and conformance fixtures
- a Fastify reference server configured for local development and protocol review
- local SQLite persistence for the reference server
- TypeScript and Rust SDKs aligned to the canonical v0.1 alpha contract
- examples, specs, docs, a whitepaper, and release verification commands

The bundled reference server uses localhost defaults, seeded consent grants, and
a demo bearer token so implementers can inspect the protocol behavior. Those are
reference-server defaults, not protocol deployment requirements.

## Production Gaps

A production or hosted implementation should add and verify:

- real user authentication and account lifecycle controls
- owner-managed grant issuance, review, and revocation workflows
- token rotation, credential storage, and session management
- authorization boundaries suitable for multi-user or multi-tenant deployments
- encryption-at-rest policy and key-management practices
- backup, restore, retention, and deletion procedures
- operational logging, audit review tooling, and incident response process
- deployment hardening, rate limiting, and abuse protections
- privacy review for context ingestion, export, and memory-write flows
- migration rules for future protocol versions and compatibility lines

These are intentionally outside the v0.1 alpha reference server.

## Protocol And Implementation Boundaries

PCP defines consent-scoped personal context exchange. It does not run an LLM,
choose a model, provide vector search, replace MCP, or act as a hosted identity
provider.

PCP implementations can add retrieval systems, model integrations, hosted
identity, or owner-facing UI if they preserve the protocol's consent, scope,
provenance, sensitivity, freshness, and audit requirements.

## Release Relationship

Use the verification commands in the README and SDK verification notes when
checking a public v0.1 alpha release candidate.

Use this page when evaluating whether an implementation is ready for production
or V1 claims. Passing the v0.1 alpha release gate does not by itself satisfy the
production gaps listed here.
