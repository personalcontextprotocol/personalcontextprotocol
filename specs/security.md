# Security

The reference server is designed for local-first development and demos.

- Bearer-token authentication is required.
- The server binds to `127.0.0.1` by default.
- Browser requests with an `Origin` header must match `PCP_ALLOWED_ORIGINS`.
- No OAuth is included in v0.1.
- Consent validation is separate from protocol dispatch.
- Method handlers do not trust client-provided identity beyond a validated grant.

This is not a production multi-tenant auth model. It is the smallest useful
security boundary for a local reference implementation.
