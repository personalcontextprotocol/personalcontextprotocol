# Examples

## Demo Client

```bash
pnpm seed
pnpm dev
```

In another terminal:

```bash
pnpm demo
```

## Curl Examples

With the server running:

```bash
examples/curl/initialize.sh
examples/curl/request-context.sh
examples/curl/search.sh
examples/curl/propose-memory.sh
```

## TypeScript Client

```ts
import { PcpClient } from "@pcp/client";
import { PCP_PROTOCOL_VERSION } from "@pcp/protocol";

const client = new PcpClient({
  endpoint: "http://127.0.0.1:8787/pcp",
  token: "pcp_demo_token"
});

await client.initialize({
  protocolVersion: PCP_PROTOCOL_VERSION,
  clientInfo: {
    id: "sample-assistant",
    name: "Sample Assistant",
    version: "0.1.0",
    type: "local_cli"
  },
  capabilities: {
    context: {},
    memory: { propose: true }
  }
});

const result = await client.requestContext({
  grantId: "grant_demo_assistant",
  purpose: "Help the user prepare for a planning session",
  task: "Read relevant goals, preferences, and decisions",
  contextTypes: ["Project", "DecisionHistory"],
  maxItems: 10,
  freshnessPreference: "recent_first",
  includeSources: true,
  includeConfidence: true
});

console.log(result);
```
