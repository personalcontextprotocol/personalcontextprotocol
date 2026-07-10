# What PCP Is

PCP stands for Personal Context Protocol. PCP v0.1 alpha is an open protocol
proposal and reference implementation, not a finished standard.

It is a way for an AI application to ask for personal context without taking
everything, guessing what it is allowed to know, or hiding how the information
was used.

In plain terms:

- A person owns context about themselves, their projects, decisions, goals, and preferences.
- An AI app asks for context for a specific purpose.
- A PCP server checks whether the app has consent.
- The server returns only the context allowed by that consent.
- Every context item includes where it came from, how reliable it is, how sensitive it is, and how fresh it is.
- Important access and write actions are recorded in an audit log.

## Why This Matters

Most AI applications need personal context to be useful. But without a protocol,
that context can become messy:

- apps collect too much
- users cannot see what was shared
- memory updates are mixed with guesses
- old information looks current
- sensitive information is hard to separate

PCP gives developers a clean boundary. The AI app does not directly own the
person's memory. It requests scoped context from a context server.

## Who Uses PCP

PCP has three main audiences:

- people who want control over what personal context an AI app can use
- AI application developers who need a consistent way to request relevant context
- server and SDK implementers who need a small, testable protocol contract

The v0.1 reference implementation is meant to make that contract concrete. It
is small enough to inspect, run locally, test, and adapt.

## Simple Analogy

Think of PCP like a library card for personal context.

The app does not walk into the whole library and copy every book. It presents a
grant, says what it is trying to do, and receives the books it is allowed to
use. The library records what was accessed.

## PCP Is Not

PCP is not a chatbot.

PCP is not a memory product by itself.

PCP is not MCP.

PCP is not a vector database or an LLM framework.

PCP is the protocol layer that lets those systems ask for personal context in a
structured, consent-aware, auditable way.

## How PCP Relates to MCP

MCP gives AI applications a standard way to connect to tools and external
systems. PCP focuses on a narrower boundary: consent-scoped personal context.

An AI application could use both. For example, it could use MCP to call tools
and use PCP to request only the personal context that a user has allowed for the
current task.

## What the Reference Server Is

The v0.1 reference server is configured for local development and protocol
review. It uses a local SQLite database, a demo bearer token, and seeded consent
grants so the protocol can be run and inspected with minimal setup.

It is not production authentication, not a hosted identity system, and not a
claim that v0.1 is complete.

That is a limit of the bundled reference server, not a deployment limit of PCP.
The protocol can also be implemented by self-hosted or hosted owner-controlled
services.
