# How PCP Works

PCP has four main ideas:

1. clients
2. consent grants
3. context items
4. ContextPacks

## Client

A client is the app asking for context.

In the demo, the client is:

```text
codex-local
```

The client initializes with the server and receives the server's supported
capabilities.

## Consent Grant

A consent grant says what a client is allowed to do.

Example scopes:

- `context.read`
- `context.search`
- `context.audit.read`
- `memory.propose`
- `memory.write`
- `consent.read`
- `consent.revoke`
- `context.export`

If a method requires a scope and the grant does not include it, the server
returns an error.

## Context Item

A ContextItem is one piece of personal context.

It has:

- type, such as `Project`, `Preference`, or `DecisionHistory`
- content text
- tags
- source provenance
- confidence
- freshness
- sensitivity
- created and updated timestamps

This means context is not just text. It carries the metadata needed for a
responsible AI system to decide how much to trust it and how carefully to use
it.

## ContextPack

A ContextPack is the response to a scoped context request.

It includes:

- the user id
- the client id
- the grant id
- the purpose
- generated and expiration timestamps
- matching context items
- warnings
- limits

The ContextPack is the main object an AI client uses.

## Normal Flow

```text
client -> initialize
client -> pcp.context.request with grantId, purpose, task
server -> checks auth, grant status, and scope
server -> returns ContextPack
server -> writes audit log entries
```

## Memory Flow

Clients should normally propose memory instead of writing it directly:

```text
client -> pcp.memory.propose
server -> stores proposal as pending
```

Direct memory creation exists in v0.1, but it requires `memory.write` and is
limited in the reference server to the demo admin token. Direct memory deletion
uses the same scope and local demo-admin restriction.

## Audit Flow

Audit listing requires `context.audit.read`.

```text
client -> pcp.audit.list
server -> checks auth, grant status, and audit-read scope
server -> returns matching audit entries
server -> writes an audit.listed entry
```

## Export Flow

Exports require `context.export`.

The v0.1 reference server exports allowed context as JSON. Restricted
sensitivity items are excluded.
