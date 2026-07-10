import type { AppClient, ConsentGrant, ContextItem } from "@pcp/protocol";

const now = "2026-06-24T00:00:00.000Z";

export const demoClient: AppClient = {
  id: "sample-assistant",
  name: "Sample Assistant",
  version: "0.1.0",
  description: "Local assistant demo",
  type: "local_cli",
  createdAt: now
};

export const demoGrant: ConsentGrant = {
  id: "grant_demo_assistant",
  userId: "user_demo",
  clientId: "sample-assistant",
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
  purpose: "Allow the local demo assistant to request scoped personal context.",
  status: "active",
  createdAt: now,
  expiresAt: "2027-06-24T00:00:00.000Z"
};

export const demoContextItems: ContextItem[] = [
  {
    id: "ctx_project_planning",
    userId: "user_demo",
    type: "Project",
    content: {
      text: "The user is preparing a product planning session and wants the assistant to use only relevant, consent-scoped personal context."
    },
    tags: ["planning", "project"],
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
    id: "ctx_decision_morning_reviews",
    userId: "user_demo",
    type: "DecisionHistory",
    content: {
      text: "The user decided that planning reviews should start with current goals, recent decisions, and open follow-up items."
    },
    tags: ["planning", "decision"],
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
      text: "The user prefers assistants to ask for the smallest useful amount of context and explain why it is needed."
    },
    tags: ["privacy", "preference"],
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
    id: "ctx_goal_launch_plan",
    userId: "user_demo",
    type: "Goal",
    content: {
      text: "The user wants a short launch plan that separates confirmed facts, assumptions, and tasks that still need owner approval."
    },
    tags: ["planning", "goal"],
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
      text: "The user prefers concise, practical responses that state concrete next steps and avoid unnecessary theory."
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
