# Troubleshooting

## `pnpm: command not found`

Enable Corepack:

```bash
corepack enable
```

Then retry:

```bash
pnpm install
```

## Server Returns `401`

The server requires a bearer token.

Use:

```text
Authorization: Bearer pcp_demo_token
```

The demo token can be changed with:

```bash
PCP_DEMO_TOKEN=your_token pnpm dev
```

## Server Returns `-32002 PCP_SCOPE_DENIED`

The consent grant does not include the scope required by the method.

Check scopes in:

```text
server/src/demo/seedContext.ts
```

Then reseed the database:

```bash
pnpm seed
```

## Server Cannot Bind to Port `8787`

Another process may already be using the port.

Run the server on another port:

```bash
PCP_PORT=8788 pnpm dev
```

Then point clients at:

```bash
PCP_ENDPOINT=http://127.0.0.1:8788/pcp pnpm demo
```

## Demo Search Returns No Results

Confirm the database was seeded:

```bash
pnpm seed
```

Then rerun:

```bash
pnpm demo
```

## Reset Local Data

Stop the server, then remove the local database:

```bash
rm .pcp/pcp.sqlite
pnpm seed
```

The `.pcp/` directory is ignored by git.
