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
});
