# Lifecycle

1. A local owner or trusted setup process creates an AppClient and ConsentGrant.
2. A client calls `initialize` with protocol version and client capabilities.
3. The server returns negotiated protocol version and supported capabilities.
4. The client uses a grant id when requesting or searching context.
5. The server validates auth, grant status, grant client binding, and method scope.
6. Every meaningful read or mutation writes an audit event.
7. The client can revoke its own grant with `pcp.consent.revoke`.

PCP v0.1 is session-light. The initialization handshake is capability discovery,
not a durable session object.
