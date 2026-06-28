import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  InitializeParamsSchema,
  InitializeResultSchema,
  JSON_RPC_VERSION,
  JsonRpcRequestSchema,
  JsonRpcResponseSchema,
  PCP_BEARER_AUTH_SCHEME,
  PCP_HTTP_JSON_RPC_METHOD,
  PCP_METHODS
} from "@pcp/protocol";
import {
  FetchPcpTransport,
  PcpClient,
  PcpProtocolError,
  PcpValidationError
} from "../src/PcpClient.js";

const testDir = dirname(fileURLToPath(import.meta.url));
const fixtureRoot = resolve(testDir, "../../packages/protocol/conformance/v0.1");

function readFixture(path: string): unknown {
  return JSON.parse(readFileSync(resolve(fixtureRoot, path), "utf8"));
}

const initializeRequest = JsonRpcRequestSchema.parse(
  readFixture("valid/initialize.request.json")
);
const initializeParams = InitializeParamsSchema.parse(initializeRequest.params);
const initializeResponse = JsonRpcResponseSchema.parse(
  readFixture("valid/initialize.response.json")
);
if (!("result" in initializeResponse)) {
  throw new Error("initialize response fixture must be a success response");
}
const initializeResult = InitializeResultSchema.parse(initializeResponse.result);
const scopeDeniedResponse = JsonRpcResponseSchema.parse(
  readFixture("valid/scope-denied.response.json")
);

describe("PcpClient", () => {
  it("sends validated JSON-RPC requests with explicit bearer auth", async () => {
    const calls: RequestInit[] = [];
    const client = new PcpClient({
      endpoint: "http://127.0.0.1:8787/pcp",
      auth: { scheme: PCP_BEARER_AUTH_SCHEME, token: "token" },
      idFactory: () => String(initializeRequest.id),
      fetchImpl: (async (_url, init) => {
        calls.push(init ?? {});
        return new Response(JSON.stringify(initializeResponse), {
          headers: { "content-type": "application/json" }
        });
      }) as typeof fetch
    });

    const result = await client.initialize(initializeParams);

    expect(result).toEqual(initializeResult);
    expect(calls[0]?.method).toBe(PCP_HTTP_JSON_RPC_METHOD);
    expect(calls[0]?.headers).toMatchObject({
      authorization: "Bearer token"
    });
    expect(JSON.parse(String(calls[0]?.body))).toMatchObject({
      jsonrpc: JSON_RPC_VERSION,
      id: initializeRequest.id,
      method: PCP_METHODS.initialize,
      params: initializeParams
    });
  });

  it("fails before transport when request params violate the protocol schema", async () => {
    const client = new PcpClient({
      transport: {
        send: async () => {
          throw new Error("transport should not be called");
        }
      }
    });

    await expect(client.initialize({} as never)).rejects.toBeInstanceOf(
      PcpValidationError
    );
  });

  it("turns shared JSON-RPC error fixtures into structured protocol errors", async () => {
    const transport = new FetchPcpTransport({
      endpoint: "http://127.0.0.1:8787/pcp",
      fetchImpl: (async () =>
        new Response(JSON.stringify(scopeDeniedResponse), {
          headers: { "content-type": "application/json" }
        })) as typeof fetch
    });

    const client = new PcpClient({ transport });
    await expect(client.initialize(initializeParams)).rejects.toMatchObject({
      name: "PcpProtocolError",
      code: -32002,
      data: { requiredScope: "memory.write" }
    } satisfies Partial<PcpProtocolError>);
  });
});
