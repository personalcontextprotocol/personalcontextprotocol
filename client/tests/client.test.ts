import { describe, expect, it } from "vitest";
import { PcpClient } from "../src/PcpClient.js";

describe("PcpClient", () => {
  it("sends JSON-RPC requests with bearer auth", async () => {
    const calls: RequestInit[] = [];
    const client = new PcpClient({
      endpoint: "http://127.0.0.1:8787/pcp",
      token: "token",
      fetchImpl: (async (_url, init) => {
        calls.push(init ?? {});
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id: "1", result: { ok: true } }),
          { headers: { "content-type": "application/json" } }
        );
      }) as typeof fetch
    });

    const result = await client.request("initialize", {});

    expect(result).toEqual({ ok: true });
    expect(calls[0]?.headers).toMatchObject({
      authorization: "Bearer token"
    });
  });
});
