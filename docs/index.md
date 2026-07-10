# PCP Documentation

This map routes each reader to the smallest useful set of pages.

## New to PCP

Start here if you want the concept before the implementation.

- [What PCP Is](what-is-pcp.md): plain-language overview and boundaries
- [How PCP Works](how-it-works.md): clients, grants, context items, and ContextPacks
- [Glossary](glossary.md): protocol terms in one place

## Trying the Reference Implementation

Use these pages to run the local demo and inspect what happens.

- [Getting Started](getting-started.md): install, seed, run, demo, and audit logs
- [Troubleshooting](troubleshooting.md): common setup and runtime issues
- [Examples](../specs/examples.md): curl and SDK examples

## Building an AI Application

Use these pages when your application wants to request personal context through
PCP.

- [SDK Guide](sdk/index.md): TypeScript and Rust SDK usage
- [Method Reference](../specs/methods.md): request and response payloads
- [Scopes](../specs/scopes.md): permissions required by each method
- [Protocol Transport](../specs/protocol.md): JSON-RPC envelope and errors

## Implementing PCP

Use these pages when you are building a compatible server, SDK, or test suite.

- [PCP v0.1 Specification](../specs/pcp-v0.1.md): normative v0.1 contract overview
- [Object Reference](../specs/objects.md): AppClient, ConsentGrant, ContextItem, ContextPack, MemoryProposal, and AuditLog
- [Lifecycle](../specs/lifecycle.md): expected client and grant flow
- [Security Model](../specs/security.md): required local-first security behavior
- [Audit](../specs/audit.md): auditable actions and storage model
- [Developer Guide](developer-guide.md): repository architecture and extension workflow

## Reviewing the Proposal

Use these pages to evaluate the protocol, its limits, and its release posture.

- [Whitepaper](../paper/pcp-v0.1-whitepaper.md): technical narrative and limitations
- [Release Readiness](release-readiness.md): public-alpha checklist and verification gate
- [SDK Verification Notes](sdk/verification.md): SDK conformance status
