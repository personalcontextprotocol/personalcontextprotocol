# Security Model

PCP v0.1 is local-first. The reference implementation is meant for development,
experimentation, and protocol validation.

It is not a hosted multi-tenant identity system.

## Reference Server Controls

- Bearer-token authentication is required.
- The server binds to `127.0.0.1` by default.
- Browser requests with an `Origin` header must match `PCP_ALLOWED_ORIGINS`.
- Consent validation is separate from protocol dispatch.
- Each protected method validates grant status and required scope.
- Restricted context items are excluded from normal reads and exports.
- Audit entries are written for important access, mutation, denial, and export events.

## Default Token

The demo token is:

```text
pcp_demo_token
```

Override it with:

```bash
PCP_DEMO_TOKEN=your_token pnpm dev
```

## Default Bind Address

The default host is:

```text
127.0.0.1
```

Override it with:

```bash
PCP_HOST=127.0.0.1 PCP_PORT=8788 pnpm dev
```

## Consent Validation

For each protected method, the server checks:

1. grant exists
2. grant status is `active`
3. grant is not expired
4. grant includes the required scope

## Sensitivity Handling

Context items can be:

- `low`
- `medium`
- `high`
- `restricted`

The reference server excludes `restricted` items from ContextPacks and exports.

## Production Notes

A production implementation should add:

- real user authentication
- token rotation
- owner-managed grant issuance
- stricter client identity binding
- durable audit review tooling
- encryption-at-rest policy
- explicit production deployment hardening

Those are intentionally outside the v0.1 reference server.
