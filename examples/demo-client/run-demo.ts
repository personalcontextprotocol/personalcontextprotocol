import { PcpClient } from "@pcp/client";
import { PCP_PROTOCOL_VERSION } from "@pcp/protocol";

const client = new PcpClient({
  endpoint: process.env.PCP_ENDPOINT ?? "http://127.0.0.1:8787/pcp",
  token: process.env.PCP_DEMO_TOKEN ?? "pcp_demo_token"
});

const grantId = "grant_demo_codex";

const initialize = await client.initialize({
  protocolVersion: PCP_PROTOCOL_VERSION,
  clientInfo: {
    id: "codex-local",
    name: "Codex Local",
    version: "0.1.0",
    description: "Local coding assistant",
    type: "local_cli"
  },
  capabilities: {
    context: {},
    memory: { propose: true }
  }
});

const context = await client.requestContext({
  grantId,
  purpose: "Help the user continue PCP design and implementation",
  task: "Implement PCP v0.1 reference server",
  contextTypes: [
    "UserProfile",
    "Project",
    "Preference",
    "Goal",
    "DecisionHistory",
    "CommunicationStyle",
    "MemoryItem"
  ],
  maxItems: 20,
  freshnessPreference: "recent_first",
  includeSources: true,
  includeConfidence: true
});

const search = await client.searchContext({
  grantId,
  query: "PCP protocol design",
  contextTypes: ["Project", "DecisionHistory", "MemoryItem"],
  limit: 10
});

const proposal = await client.proposeMemory({
  grantId,
  proposedItem: {
    type: "DecisionHistory",
    content: {
      text: "PCP v0.1 has a working reference implementation with protocol schemas, a local server, a client, examples, and tests."
    },
    tags: ["pcp", "implementation", "decision"],
    confidence: 0.9,
    sensitivity: "low",
    source: {
      type: "client_proposal",
      origin: "pcp-demo-client",
      method: "demo_run",
      capturedAt: new Date().toISOString()
    },
    freshness: {
      lastVerifiedAt: new Date().toISOString(),
      status: "fresh"
    }
  },
  reason: "This records the demo-confirmed implementation state."
});

const consent = await client.listConsent({ clientId: "codex-local" });
const exported = await client.createExport({ grantId, format: "json" });

console.log(
  JSON.stringify(
    {
      initialize,
      contextItemCount: (context as { contextPack: { items: unknown[] } }).contextPack.items.length,
      searchResultCount: (search as { total: number }).total,
      proposal,
      consentGrantCount: (consent as { grants: unknown[] }).grants.length,
      exportItemCount: (exported as { export: { itemCount: number } }).export.itemCount
    },
    null,
    2
  )
);
