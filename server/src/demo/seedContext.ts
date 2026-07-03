import type { AppClient, ConsentGrant, ContextItem } from "@pcp/protocol";

const now = "2026-06-24T00:00:00.000Z";

export const demoClient: AppClient = {
  id: "codex-local",
  name: "Codex Local",
  version: "0.1.0",
  description: "Local coding assistant",
  type: "local_cli",
  createdAt: now
};

export const demoGrant: ConsentGrant = {
  id: "grant_demo_codex",
  userId: "user_demo",
  clientId: "codex-local",
  scopes: [
    "context.read",
    "context.search",
    "memory.propose",
    "memory.write",
    "consent.read",
    "consent.revoke",
    "context.audit.read",
    "context.export"
  ],
  purpose: "Allow the local Codex client to help build PCP v0.1.",
  status: "active",
  createdAt: now,
  expiresAt: "2027-06-24T00:00:00.000Z"
};

export const demoContextItems: ContextItem[] = [
  {
    id: "ctx_project_pcp",
    userId: "user_demo",
    type: "Project",
    content: {
      text: "PCP is the Personal Context Protocol: an open protocol for connecting AI systems to user-owned personal context."
    },
    tags: ["pcp", "protocol", "project"],
    source: {
      type: "system_seed",
      origin: "pcp-reference-server",
      method: "demo_seed",
      capturedAt: now
    },
    confidence: 1,
    freshness: { lastVerifiedAt: now, status: "fresh" },
    sensitivity: "low",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "ctx_decision_jsonrpc",
    userId: "user_demo",
    type: "DecisionHistory",
    content: {
      text: "PCP v0.1 uses JSON-RPC 2.0 over one HTTP endpoint with a small initialization handshake and protocol version negotiation."
    },
    tags: ["pcp", "json-rpc", "decision"],
    source: {
      type: "system_seed",
      origin: "pcp-reference-server",
      method: "demo_seed",
      capturedAt: now
    },
    confidence: 1,
    freshness: { lastVerifiedAt: now, status: "fresh" },
    sensitivity: "low",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "ctx_preference_scope",
    userId: "user_demo",
    type: "Preference",
    content: {
      text: "Keep PCP v0.1 small and working: no OAuth, no streaming, no vector database, no LLM dependency, and no MCP SDK internals."
    },
    tags: ["pcp", "scope", "preference"],
    source: {
      type: "system_seed",
      origin: "pcp-reference-server",
      method: "demo_seed",
      capturedAt: now
    },
    confidence: 1,
    freshness: { lastVerifiedAt: now, status: "fresh" },
    sensitivity: "low",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "ctx_goal_working_protocol",
    userId: "user_demo",
    type: "Goal",
    content: {
      text: "The immediate goal is a real working PCP v0.1 protocol package, reference server, example client, tests, docs, and demo seed data."
    },
    tags: ["pcp", "goal", "v0.1"],
    source: {
      type: "system_seed",
      origin: "pcp-reference-server",
      method: "demo_seed",
      capturedAt: now
    },
    confidence: 1,
    freshness: { lastVerifiedAt: now, status: "fresh" },
    sensitivity: "low",
    createdAt: now,
    updatedAt: now
  },
  {
    id: "ctx_style_pragmatic",
    userId: "user_demo",
    type: "CommunicationStyle",
    content: {
      text: "The user prefers concise, pragmatic implementation updates with concrete verification rather than theoretical protocol discussion."
    },
    tags: ["communication", "preference"],
    source: {
      type: "system_seed",
      origin: "pcp-reference-server",
      method: "demo_seed",
      capturedAt: now
    },
    confidence: 0.95,
    freshness: { lastVerifiedAt: now, status: "fresh" },
    sensitivity: "medium",
    createdAt: now,
    updatedAt: now
  }
];
