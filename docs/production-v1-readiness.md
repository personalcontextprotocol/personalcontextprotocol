# PCP Production V1 Readiness

This document lists what is still missing before PCP should be called
production-ready V1.

PCP v0.1 alpha is ready for public review as an open protocol proposal,
reference implementation, schemas, conformance fixtures, and SDK surface. It is
not yet a production hosted service or ratified standard.

## Deployment Clarification

PCP is deployment-neutral. A PCP server can run:

- inside a local desktop app
- inside a local Docker container
- on a self-hosted server
- in a private cloud service
- in another owner-controlled runtime

A local Docker container can look operationally similar to a remote server: it
has an HTTP endpoint, environment configuration, logs, storage, and service
boundaries. The difference is readiness evidence. A production remote service
also needs real identity, TLS, secrets management, backups, monitoring, abuse
controls, operational runbooks, and deployment hardening.

The current reference server defaults to localhost, SQLite, demo tokens, and
seeded grants so the protocol can be inspected quickly. Those defaults are not
protocol restrictions.

## V1 Protocol Requirements

Before V1, PCP should have:

- a stable compatibility policy beyond `v0.1-alpha`
- a versioned change process for protocol additions and deprecations
- a clearer extension mechanism for implementation-specific metadata
- multiple independent implementation reports or adapters
- expanded conformance fixtures covering every method, denial path, and edge case
- formal error semantics for malformed grants, expired grants, unsupported
  methods, invalid payloads, and authorization failures
- documented backwards-compatibility guarantees for SDKs and servers

## V1 Security And Consent Requirements

Before production V1, implementations should provide:

- real user authentication
- client identity binding beyond demo bearer tokens
- token/session rotation and revocation
- owner-managed grant issuance
- user-visible consent review
- grant expiry, renewal, and revocation UX
- least-privilege scope recommendations
- sensitive-data handling rules for each sensitivity level
- explicit retention and deletion behavior
- audit log review and export tools

The draft PCP [Authorization And Consent Profile](../specs/authorization-consent.md)
is the intended starting point for these requirements. It still needs
implementation reports, conformance fixtures, and production hardening before
it can be treated as V1-stable.

## V1 Storage And Data Protection Requirements

Before production V1, a production implementation should provide:

- durable database support beyond demo SQLite defaults
- migrations and schema-version tracking
- backup and restore procedures
- encryption-at-rest policy
- key-management design
- deletion and retention workflows
- data portability checks
- corruption recovery and integrity checks

## V1 Hosted Or Remote Deployment Requirements

For a hosted, remote, or public deployment, add:

- TLS termination and secure headers
- host and origin validation
- production secret management
- rate limiting and abuse controls
- request size and timeout limits
- structured logs without leaking sensitive context
- health checks and readiness checks
- metrics, tracing, and alerting
- deployment runbooks
- incident response process
- backup restore drills

## V1 SDK And Developer Experience Requirements

Before V1, SDKs should provide:

- stable published package metadata
- explicit compatibility matrix
- typed helpers for all methods
- structured error mapping for all PCP errors
- clear timeout and retry configuration
- conformance tests shared across TypeScript and Rust
- complete examples for local, self-hosted, and hosted endpoints

## V1 Governance Requirements

Before V1, the project should define:

- release process
- security disclosure process
- contribution process for protocol changes
- compatibility and deprecation policy
- ownership and maintainer responsibilities
- issue labels or templates for spec feedback, SDK bugs, and security concerns

## Current V0.1 Alpha Boundary

The current release is credible as:

- an open protocol proposal
- a versioned alpha specification
- a runnable reference implementation
- a TypeScript protocol package
- TypeScript and Rust SDK surfaces
- generated JSON Schema and contract metadata
- conformance fixtures
- a public-review baseline

It should not be presented as:

- a finished standard
- a production hosted service
- a complete identity system
- a complete security or privacy framework
- a multi-tenant SaaS deployment
- a final V1 compatibility contract
