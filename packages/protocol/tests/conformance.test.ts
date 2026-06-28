import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  ContextRequestParamsSchema,
  InitializeParamsSchema,
  InitializeResultSchema,
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
  PCP_DEFAULTS,
  PCP_METHODS,
  PCP_PROTOCOL_VERSION,
  PCP_CONTRACT
} from "../src/index.js";

const testDir = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = resolve(testDir, "../conformance/v0.1");

async function readFixture(path: string): Promise<unknown> {
  return JSON.parse(await readFile(resolve(fixtureRoot, path), "utf8"));
}

describe("PCP v0.1 conformance fixtures", () => {
  it("keeps the contract metadata aligned with exported constants", () => {
    expect(PCP_CONTRACT.protocolVersion).toBe(PCP_PROTOCOL_VERSION);
    expect(PCP_CONTRACT.methods.contextRequest).toBe(PCP_METHODS.contextRequest);
    expect(PCP_CONTRACT.defaults.contextRequestMaxItems).toBe(
      PCP_DEFAULTS.contextRequestMaxItems
    );
  });

  it("accepts the shared initialize request and response fixtures", async () => {
    const request = JsonRpcRequestSchema.parse(
      await readFixture("valid/initialize.request.json")
    );
    expect(request.method).toBe(PCP_METHODS.initialize);
    InitializeParamsSchema.parse(request.params);

    const response = JsonRpcResponseSchema.parse(
      await readFixture("valid/initialize.response.json")
    );
    expect("result" in response).toBe(true);
    if ("result" in response) {
      InitializeResultSchema.parse(response.result);
    }
  });

  it("applies named defaults to the context request fixture", async () => {
    const request = JsonRpcRequestSchema.parse(
      await readFixture("valid/context-request.request.json")
    );
    expect(request.method).toBe(PCP_METHODS.contextRequest);

    const params = ContextRequestParamsSchema.parse(request.params);
    expect(params.maxItems).toBe(PCP_DEFAULTS.contextRequestMaxItems);
    expect(params.freshnessPreference).toBe(
      PCP_DEFAULTS.contextRequestFreshnessPreference
    );
    expect(params.includeSources).toBe(PCP_DEFAULTS.contextRequestIncludeSources);
    expect(params.includeConfidence).toBe(
      PCP_DEFAULTS.contextRequestIncludeConfidence
    );
  });

  it("accepts the shared JSON-RPC error response fixture", async () => {
    const response = JsonRpcResponseSchema.parse(
      await readFixture("valid/scope-denied.response.json")
    );
    expect("error" in response && response.error.code).toBe(-32002);
  });

  it("rejects initialize requests with unsupported protocol versions", async () => {
    const request = JsonRpcRequestSchema.parse(
      await readFixture("invalid/unsupported-version.request.json")
    );
    expect(() => InitializeParamsSchema.parse(request.params)).toThrow();
  });
});
