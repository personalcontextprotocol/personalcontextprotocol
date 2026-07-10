# Lifecycle

PCP v0.1 has a simple lifecycle.

## 1. Setup

An owner, setup script, trusted admin process, or production provisioning flow
creates:

- an `AppClient`
- one or more `ConsentGrant` records
- initial `ContextItem` records

The reference server does this locally through:

```bash
pnpm seed
```

Servers that support app-initiated consent MAY instead use the draft
[Authorization And Consent Profile](authorization-consent.md). In that flow, an
app requests access, the owner approves or denies it, and the server creates a
client binding plus consent grant.

## 2. Initialize

The client MUST call:

```text
initialize
```

The server returns:

- negotiated protocol version
- server information
- supported capabilities
- instructions

Servers MAY also advertise optional authorization profile discovery under
`capabilities.authorization`.

Initialization does not create a long-lived streaming session in v0.1.

## 3. Request Context

The client MAY call:

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

The server MUST validate authentication, grant status, grant expiration, and
`context.read` before returning a `ContextPack`.

## 4. Search Context

The client MAY call:

```text
pcp.context.search
```

The reference server performs simple SQLite text matching. PCP v0.1 does not
require embeddings or vector search.

## 5. Propose or Create Memory

Clients SHOULD normally use:

```text
pcp.memory.propose
```

Direct creation through `pcp.memory.create` requires `memory.write`.

## 6. List or Revoke Consent

Clients MAY inspect or revoke their access:

```text
pcp.consent.list
pcp.consent.revoke
```

## 7. Export

Clients with `context.export` MAY request a JSON export:

```text
pcp.export.create
```

## 8. Audit

The server MUST write audit entries for important reads, writes, denials, grant
changes, audit listing, and exports.

## 9. Shutdown

PCP v0.1 defines no protocol-specific shutdown message. Clients and servers
SHOULD use the underlying transport lifecycle.
