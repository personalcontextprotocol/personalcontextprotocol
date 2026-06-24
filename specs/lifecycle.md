# Lifecycle

PCP v0.1 has a simple lifecycle.

## 1. Setup

A local owner, setup script, or trusted admin process creates:

- an `AppClient`
- one or more `ConsentGrant` records
- initial `ContextItem` records

The reference server does this through:

```bash
pnpm seed
```

## 2. Initialize

The client calls:

```text
initialize
```

The server returns:

- negotiated protocol version
- server information
- supported capabilities
- instructions

Initialization does not create a long-lived streaming session in v0.1.

## 3. Request Context

The client calls:

```text
pcp.context.request
```

The request includes:

- grant id
- purpose
- task
- requested context types
- item limit
- freshness preference

The server validates the grant and returns a `ContextPack`.

## 4. Search Context

The client calls:

```text
pcp.context.search
```

The server performs simple SQLite text matching. v0.1 does not use embeddings.

## 5. Propose or Create Memory

Clients should normally use:

```text
pcp.memory.propose
```

Direct creation through `pcp.memory.create` requires `memory.write`.

## 6. List or Revoke Consent

Clients can inspect or revoke their access:

```text
pcp.consent.list
pcp.consent.revoke
```

## 7. Export

Clients with `context.export` can request a JSON export:

```text
pcp.export.create
```

## 8. Audit

The server writes audit entries throughout the lifecycle.
