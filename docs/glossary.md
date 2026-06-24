# Glossary

## AppClient

The application asking for personal context. In the demo, this is
`codex-local`.

## AuditLog

A record of an important access, write, denial, or export event.

## ConsentGrant

A permission record that says what a client can do. It contains scopes such as
`context.read` or `memory.propose`.

## ContextItem

One piece of personal context, such as a preference, project detail, goal, or
decision.

## ContextPack

A scoped bundle of context returned to a client for a specific purpose and
task.

## Freshness

Metadata that says whether context is fresh, aging, stale, or unknown.

## Memory Proposal

A suggested memory update. It is stored as pending instead of immediately
becoming trusted context.

## Provenance

Information about where a context item came from and how it was captured.

## Scope

A permission string that allows one kind of action, such as `context.search`.

## Sensitivity

Metadata that marks context as `low`, `medium`, `high`, or `restricted`.

Restricted context is excluded from normal reads and exports in the reference
server.
