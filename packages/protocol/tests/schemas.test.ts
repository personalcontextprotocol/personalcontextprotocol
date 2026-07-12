import { describe, expect, it } from "vitest";
import {
  ContextRequestParamsSchema,
  PcpAuthorizationBindingResultSchema,
  PcpAuthorizationCodeExchangeSchema,
  PcpAuthorizationRequestSchema,
  InitializeParamsSchema,
  InitializeResultSchema,
  PCP_PROTOCOL_VERSION
} from "../src/index.js";

describe("protocol schemas", () => {
  it("accepts the required initialize request shape", () => {
    const parsed = InitializeParamsSchema.parse({
      protocolVersion: PCP_PROTOCOL_VERSION,
      clientInfo: {
        id: "sample-assistant",
        name: "Sample Assistant",
        version: "0.1.0",
        description: "Local assistant demo"
      },
      capabilities: {
        context: {},
        memory: { propose: true }
      }
    });

    expect(parsed.clientInfo.type).toBe("other");
  });

  it("defaults context request limits and flags", () => {
    const parsed = ContextRequestParamsSchema.parse({
      grantId: "grant_demo_assistant",
      purpose: "Help with PCP",
      task: "Summarize current goals, preferences, and relevant decisions",
      contextTypes: ["Project"]
    });

    expect(parsed.maxItems).toBe(20);
    expect(parsed.freshnessPreference).toBe("recent_first");
  });

  it("accepts the authorization and consent profile request shape", () => {
    const parsed = PcpAuthorizationRequestSchema.parse({
      clientName: "Sample Assistant",
      clientUri: "https://assistant.example.com",
      redirectUri: "http://127.0.0.1:45678/callback",
      purpose: "Retrieve task-relevant personal context with owner consent.",
      scopes: ["context.search", "memory.write", "context.audit.read"],
      state: "setup-state",
      codeChallenge: "a".repeat(43),
      codeChallengeMethod: "S256"
    });

    expect(parsed.scopes).toContain("context.search");
  });

  it("rejects invalid authorization profile URLs and scopes", () => {
    expect(() =>
      PcpAuthorizationRequestSchema.parse({
        clientName: "Sample Assistant",
        redirectUri: "not-a-url",
        purpose: "Retrieve task-relevant personal context.",
        scopes: ["unknown.scope"],
        codeChallenge: "a".repeat(43),
        codeChallengeMethod: "S256"
      })
    ).toThrow();
  });

  it("validates authorization code exchange payloads", () => {
    const parsed = PcpAuthorizationCodeExchangeSchema.parse({
      code: "pcp_code_12345678901234567890",
      codeVerifier: "v".repeat(64)
    });

    expect(parsed.codeVerifier).toHaveLength(64);
    expect(() =>
      PcpAuthorizationCodeExchangeSchema.parse({
        code: "short",
        codeVerifier: "too-short"
      })
    ).toThrow();
  });

  it("validates authorization binding results", () => {
    const parsed = PcpAuthorizationBindingResultSchema.parse({
      client: {
        id: "client_sample_assistant",
        name: "Sample Assistant",
        clientUri: "https://assistant.example.com"
      },
      grant: {
        id: "grant_sample_assistant",
        userId: "user_demo",
        clientId: "client_sample_assistant",
        scopes: ["context.search", "memory.write"],
        purpose: "Retrieve task-relevant personal context.",
        status: "active",
        createdAt: "2026-07-10T00:00:00.000Z"
      },
      pcp: {
        endpoint: "https://context.example.com/pcp",
        authorization: "Bearer <token>",
        token: "pcp_token_shown_once"
      }
    });

    expect(parsed.pcp.authorization).toBe("Bearer <token>");
  });

  it("keeps initialize result authorization discovery optional", () => {
    InitializeResultSchema.parse({
      protocolVersion: PCP_PROTOCOL_VERSION,
      serverInfo: {
        name: "pcp-reference-server",
        version: "0.1.0",
        description: "Reference PCP server"
      },
      capabilities: {
        context: { request: true, search: true },
        memory: { propose: true, create: true },
        consent: { list: true, revoke: true },
        export: { create: true },
        audit: { enabled: true }
      },
      instructions:
        "This PCP server provides scoped personal context packs with provenance, confidence, sensitivity, and freshness metadata."
    });

    const withDiscovery = InitializeResultSchema.parse({
      protocolVersion: PCP_PROTOCOL_VERSION,
      serverInfo: {
        name: "pcp-reference-server",
        version: "0.1.0",
        description: "Reference PCP server"
      },
      capabilities: {
        context: { request: true, search: true },
        memory: { propose: true, create: true },
        consent: { list: true, revoke: true },
        export: { create: true },
        audit: { enabled: true },
        authorization: {
          appBinding: {
            supported: true,
            authorizeEndpoint: "https://context.example.com/authorize",
            tokenEndpoint: "https://context.example.com/pcp/oauth/token"
          }
        }
      },
      instructions:
        "This PCP server provides scoped personal context packs with provenance, confidence, sensitivity, and freshness metadata."
    });

    expect(withDiscovery.capabilities.authorization?.appBinding.supported).toBe(true);
  });
});
