# Security Policy

PCP v0.1 alpha is an open protocol proposal and local-first reference
implementation. It is intended for development, review, interoperability
experiments, and protocol discussion.

The reference server is not production authentication infrastructure. It uses a
single bearer token, localhost binding by default, local SQLite storage, and
basic origin checks so implementers can inspect the protocol behavior.

## Supported Versions

| Version | Status |
| --- | --- |
| 0.1.x | Alpha security fixes and responsible disclosure accepted |

## Reporting a Vulnerability

Do not open a public issue for a suspected vulnerability.

Use GitHub's private vulnerability reporting path for this repository:

```text
https://github.com/gitxpress/pcp/security/advisories/new
```

If GitHub does not show the private reporting form, contact the maintainers
through the repository owner profile without including exploit details in a
public issue.

Include:

- affected package or component
- steps to reproduce
- expected impact
- any local logs or request examples that help reproduce the issue

We will acknowledge valid reports, investigate, and publish fixes or mitigation
notes when appropriate.

## Scope

In scope:

- consent or scope bypasses in the reference server
- audit log omission for meaningful access, denial, mutation, or export events
- context exposure beyond the requested grant
- unsafe defaults that affect local-first use
- dependency vulnerabilities that affect supported commands

Out of scope:

- production deployment hardening not claimed by this repository
- missing OAuth, hosted identity, or multi-tenant authorization
- denial-of-service concerns for public hosting of the reference server
- vulnerabilities that require modifying local demo seed data or source code

## Security Expectations

Production implementations should add real user authentication, token rotation,
owner-managed grant issuance, encryption-at-rest policy, deployment hardening,
and operational audit review tooling. Those are intentionally outside the v0.1
reference server.
