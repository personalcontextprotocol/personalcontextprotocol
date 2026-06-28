import { PcpClient } from "@pcp/client";
import {
  PCP_BEARER_AUTH_SCHEME,
  PCP_PROTOCOL_VERSION
} from "@pcp/protocol";

const endpoint = process.env.PCP_ENDPOINT ?? "http://127.0.0.1:8787/pcp";
const token = process.env.PCP_DEMO_TOKEN;

if (!token) {
  throw new Error("Set PCP_DEMO_TOKEN before running the TypeScript SDK example.");
}

const client = new PcpClient({
  endpoint,
  auth: {
    scheme: PCP_BEARER_AUTH_SCHEME,
    token
  }
});

const result = await client.initialize({
  protocolVersion: PCP_PROTOCOL_VERSION,
  clientInfo: {
    id: "typescript-sdk-example",
    name: "TypeScript SDK Example",
    version: "0.1.0",
    type: "local_cli"
  },
  capabilities: {
    context: {},
    memory: {
      propose: true
    }
  }
});

console.log(JSON.stringify(result, null, 2));
