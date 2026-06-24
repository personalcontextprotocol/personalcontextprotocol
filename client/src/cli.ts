import { PCP_PROTOCOL_VERSION } from "@pcp/protocol";
import { PcpClient } from "./PcpClient.js";

const endpoint = process.env.PCP_ENDPOINT ?? "http://127.0.0.1:8787/pcp";
const token = process.env.PCP_DEMO_TOKEN ?? "pcp_demo_token";
const command = process.argv[2] ?? "initialize";

const client = new PcpClient({ endpoint, token });

const grantId = process.env.PCP_GRANT_ID ?? "grant_demo_codex";

const commands: Record<string, () => Promise<unknown>> = {
  initialize: () =>
    client.initialize({
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
    }),
  context: () =>
    client.requestContext({
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
    }),
  search: () =>
    client.searchContext({
      grantId,
      query: process.argv.slice(3).join(" ") || "PCP protocol design",
      contextTypes: ["Project", "DecisionHistory", "MemoryItem"],
      limit: 10
    }),
  propose: () =>
    client.proposeMemory({
      grantId,
      proposedItem: {
        type: "DecisionHistory",
        content: {
          text: "The user decided PCP v0.1 should use JSON-RPC over HTTP with scoped ContextPacks, consent grants, and memory proposals."
        },
        tags: ["pcp", "protocol", "decision"],
        confidence: 0.9,
        sensitivity: "low",
        source: {
          type: "client_proposal",
          origin: "codex-local",
          method: "explicit_conversation_summary",
          capturedAt: new Date().toISOString()
        },
        freshness: {
          lastVerifiedAt: new Date().toISOString(),
          status: "fresh"
        }
      },
      reason: "This decision is useful for future PCP implementation continuity."
    }),
  consent: () => client.listConsent({ clientId: "codex-local" }),
  export: () => client.createExport({ grantId, format: "json" })
};

if (!commands[command]) {
  console.error(`Unknown command: ${command}`);
  console.error(`Available commands: ${Object.keys(commands).join(", ")}`);
  process.exit(1);
}

const result = await commands[command]();
console.log(JSON.stringify(result, null, 2));
