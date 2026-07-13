#!/usr/bin/env node

import { PCP_PROTOCOL_VERSION } from "@pcp/protocol";
import { PcpClient } from "./PcpClient.js";

const endpoint = process.env.PCP_ENDPOINT ?? "http://127.0.0.1:8787/pcp";
const token = process.env.PCP_DEMO_TOKEN ?? "pcp_demo_token";
const command = process.argv[2] ?? "initialize";

const client = new PcpClient({ endpoint, token });

const grantId = process.env.PCP_GRANT_ID ?? "grant_demo_assistant";

const commands: Record<string, () => Promise<unknown>> = {
  initialize: () =>
    client.initialize({
      protocolVersion: PCP_PROTOCOL_VERSION,
      clientInfo: {
        id: "sample-assistant",
        name: "Sample Assistant",
        version: "0.1.0",
        description: "Local assistant demo",
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
      purpose: "Help the user prepare for a planning session",
      task: "Summarize current goals, preferences, and relevant decisions",
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
      query: process.argv.slice(3).join(" ") || "planning decisions",
      contextTypes: ["Project", "DecisionHistory", "MemoryItem"],
      limit: 10
    }),
  propose: () =>
    client.proposeMemory({
      grantId,
      proposedItem: {
        type: "DecisionHistory",
        content: {
          text: "The user wants planning summaries to separate confirmed facts from assumptions."
        },
        tags: ["planning", "decision"],
        confidence: 0.9,
        sensitivity: "low",
        source: {
          type: "client_proposal",
          origin: "sample-assistant",
          method: "explicit_conversation_summary",
          capturedAt: new Date().toISOString()
        },
        freshness: {
          lastVerifiedAt: new Date().toISOString(),
          status: "fresh"
        }
      },
      reason: "This planning preference may be useful in future sessions."
    }),
  consent: () => client.listConsent({ clientId: "sample-assistant" }),
  export: () => client.createExport({ grantId, format: "json" })
};

if (!commands[command]) {
  console.error(`Unknown command: ${command}`);
  console.error(`Available commands: ${Object.keys(commands).join(", ")}`);
  process.exit(1);
}

const result = await commands[command]();
console.log(JSON.stringify(result, null, 2));
