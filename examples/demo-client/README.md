# PCP Demo Client

Run this after seeding and starting the reference server:

```bash
pnpm --filter @pcp/server seed
pnpm --filter @pcp/server dev
pnpm --filter @pcp/demo-client demo
```

The demo initializes the client, requests a ContextPack, searches context,
proposes a memory, lists consent grants, and exports context JSON.
