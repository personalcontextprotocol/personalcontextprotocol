import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PCP_PROTOCOL_VERSION } from "@pcp/protocol";
import { createServer, seedDatabase } from "../dist/reference.js";

function testConfig() {
  const dir = mkdtempSync(join(tmpdir(), "pcp-server-test-"));
  return {
    host: "127.0.0.1",
    port: 0,
    demoToken: "pcp_demo_token",
    databasePath: join(dir, "pcp.sqlite"),
    allowedOrigins: ["http://127.0.0.1:8787"],
    defaultClientId: "codex-local"
  };
}

async function rpc(app, method, params) {
  const response = await app.inject({
    method: "POST",
    url: "/pcp",
    headers: {
      authorization: "Bearer pcp_demo_token",
      "content-type": "application/json"
    },
    payload: {
      jsonrpc: "2.0",
      id: "1",
      method,
      params
    }
  });

  assert.equal(response.statusCode, 200);
  return response.json();
}

describe("PCP reference server", () => {
  it("serves initialize, context, search, proposal, consent, and export flows", async () => {
    const config = testConfig();
    seedDatabase(config.databasePath);
    const app = createServer(config);

    const initialize = await rpc(app, "initialize", {
      protocolVersion: PCP_PROTOCOL_VERSION,
      clientInfo: {
        id: "codex-local",
        name: "Codex Local",
        version: "0.1.0"
      },
      capabilities: {
        context: {},
        memory: { propose: true }
      }
    });
    assert.equal(initialize.result.protocolVersion, PCP_PROTOCOL_VERSION);

    const context = await rpc(app, "pcp.context.request", {
      grantId: "grant_demo_codex",
      purpose: "Test context request",
      task: "Verify PCP server",
      contextTypes: ["Project", "DecisionHistory", "Preference"],
      maxItems: 10,
      freshnessPreference: "recent_first",
      includeSources: true,
      includeConfidence: true
    });
    assert.ok(context.result.contextPack.items.length > 0);

    const search = await rpc(app, "pcp.context.search", {
      grantId: "grant_demo_codex",
      query: "JSON-RPC",
      contextTypes: ["DecisionHistory"],
      limit: 5
    });
    assert.ok(search.result.total > 0);

    const proposal = await rpc(app, "pcp.memory.propose", {
      grantId: "grant_demo_codex",
      proposedItem: {
        type: "DecisionHistory",
        content: { text: "Server integration tests verify PCP v0.1 behavior." },
        tags: ["test", "pcp"],
        source: {
          type: "client_proposal",
          origin: "server-test",
          method: "node-test",
          capturedAt: new Date().toISOString()
        },
        confidence: 0.8,
        freshness: { status: "fresh" },
        sensitivity: "low"
      },
      reason: "Tests should preserve implementation continuity."
    });
    assert.equal(proposal.result.proposal.status, "pending");

    const consent = await rpc(app, "pcp.consent.list", { clientId: "codex-local" });
    assert.equal(consent.result.grants.length, 1);

    const exported = await rpc(app, "pcp.export.create", {
      grantId: "grant_demo_codex",
      format: "json"
    });
    assert.ok(exported.result.export.itemCount > 0);

    await app.close();
  });

  it("rejects missing bearer auth", async () => {
    const config = testConfig();
    seedDatabase(config.databasePath);
    const app = createServer(config);

    const response = await app.inject({
      method: "POST",
      url: "/pcp",
      payload: {
        jsonrpc: "2.0",
        id: "1",
        method: "initialize",
        params: {}
      }
    });

    assert.equal(response.statusCode, 401);
    assert.equal(response.json().error.code, -32001);
    await app.close();
  });
});
