import { describe, expect, it } from "vitest";
import {
  ContextRequestParamsSchema,
  InitializeParamsSchema,
  PCP_PROTOCOL_VERSION
} from "../src/index.js";

describe("protocol schemas", () => {
  it("accepts the required initialize request shape", () => {
    const parsed = InitializeParamsSchema.parse({
      protocolVersion: PCP_PROTOCOL_VERSION,
      clientInfo: {
        id: "codex-local",
        name: "Codex Local",
        version: "0.1.0",
        description: "Local coding assistant"
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
      grantId: "grant_demo_codex",
      purpose: "Help with PCP",
      task: "Implement PCP v0.1",
      contextTypes: ["Project"]
    });

    expect(parsed.maxItems).toBe(20);
    expect(parsed.freshnessPreference).toBe("recent_first");
  });
});
