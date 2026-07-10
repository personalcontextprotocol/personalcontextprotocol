# Getting Started

This guide gets the local PCP v0.1 alpha reference implementation running on
your machine.

The reference server is local-first. It is useful for protocol review,
development, and demos, but it is not production authentication infrastructure.

## Requirements

- Node.js 24 or newer
- Corepack

Check your Node version:

```bash
node --version
```

## 1. Install Dependencies

From the repository root:

```bash
corepack enable
pnpm install
```

## 2. Build and Test

```bash
pnpm build
pnpm test
```

Both commands should finish without failures.

## 3. Seed Demo Data

```bash
pnpm seed
```

This creates a local SQLite database at `.pcp/pcp.sqlite`.

The seeded demo includes:

- user `user_demo`
- client `sample-assistant`
- grant `grant_demo_assistant`
- several context items about PCP

## 4. Start the Server

```bash
pnpm dev
```

The server listens on:

```text
http://127.0.0.1:8787/pcp
```

## 5. Run the Demo Client

Open a second terminal and run:

```bash
pnpm demo
```

You should see JSON output with:

- server information
- capabilities
- context item count
- search result count
- a pending memory proposal
- consent grant count
- export item count

## 6. Try a Curl Request

With the server still running:

```bash
examples/curl/request-context.sh
```

All curl examples use the demo token:

```text
pcp_demo_token
```

## 7. Inspect Audit Logs

The demo writes local audit entries for important reads, writes, denials, and
exports. After running `pnpm demo`, inspect recent entries:

```bash
pnpm audit:logs
```

The command reads the local SQLite database and prints JSON.

You can also inspect the table directly with SQLite tooling:

```sql
SELECT timestamp, action, result, client_id, grant_id, scope, resource_id
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 20;
```

## Where Data Lives

The reference server stores local data in SQLite:

```text
.pcp/pcp.sqlite
```

This path is ignored by git.

To start over, stop the server, delete `.pcp/pcp.sqlite`, and run:

```bash
pnpm seed
```

## Alpha Limitations

PCP v0.1 does not include OAuth, hosted identity, production token rotation,
multi-tenant authorization, encryption-at-rest policy, vector search, an LLM, or
a frontend UI. Those omissions keep the proposal inspectable and local-first.
