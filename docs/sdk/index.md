# PCP SDK Guide

PCP currently provides two SDK surfaces:

- `client`: TypeScript SDK and CLI
- `sdk/rust/pcp-sdk`: Rust SDK crate

Both SDKs target the official PCP v0.1 alpha contract in this repository. The
contract is official for this repo, but PCP v0.1 remains an alpha protocol line,
not a ratified ecosystem standard.

## Contract Source

The normative source is:

```text
packages/protocol/src/
```

Generated artifacts for SDKs and non-TypeScript implementations:

```text
packages/protocol/schemas/pcp-v0.1.schema.json
packages/protocol/schemas/pcp-v0.1.contract.json
packages/protocol/conformance/v0.1/
```

Do not copy protocol versions, JSON-RPC versions, method names, defaults, or
compatibility claims into SDK-local constants. Add them to the protocol source,
regenerate artifacts, and update conformance fixtures.

## TypeScript

Install from the workspace during local development:

```bash
pnpm --filter @pcp/client build
```

Minimal initialize flow:

```ts
import { PcpClient } from "@pcp/client";
import { PCP_BEARER_AUTH_SCHEME, PCP_PROTOCOL_VERSION } from "@pcp/protocol";

const client = new PcpClient({
  endpoint: "http://127.0.0.1:8787/pcp",
  auth: {
    scheme: PCP_BEARER_AUTH_SCHEME,
    token: process.env.PCP_DEMO_TOKEN ?? ""
  }
});

const result = await client.initialize({
  protocolVersion: PCP_PROTOCOL_VERSION,
  clientInfo: {
    id: "my-typescript-app",
    name: "My TypeScript App",
    version: "0.1.0",
    type: "local_cli"
  },
  capabilities: {
    context: {},
    memory: { propose: true }
  }
});
```

The TypeScript SDK validates request params before transport and validates
result objects after transport by using schemas from `@pcp/protocol`.

Example:

```bash
PCP_DEMO_TOKEN=pcp_demo_token pnpm --filter @pcp/typescript-sdk-example demo
```

## Rust

The Rust SDK includes a ready HTTP transport and still exposes the async
transport trait for advanced embedding.

```bash
cargo test -p pcp-sdk
```

The crate includes:

- typed protocol models
- async client methods for all v0.1 methods, including memory deletion and audit listing
- ready JSON-RPC-over-HTTP transport
- structured protocol and transport errors
- generated contract and schema inclusion
- conformance tests over `packages/protocol/conformance/v0.1`

The crate is marked `publish = false` until repository ownership and release
metadata are finalized.

Minimal initialize flow:

```rust
use pcp_sdk::{
    AppClientInput, AppClientType, ClientCapabilities, HttpPcpTransport,
    HttpPcpTransportConfig, InitializeParams, MemoryClientCapabilities, PcpClient,
};

# async fn example() -> pcp_sdk::Result<()> {
let client = PcpClient::new(HttpPcpTransport::new(HttpPcpTransportConfig {
    endpoint: "http://127.0.0.1:8787/pcp".to_owned(),
    bearer_token: Some("pcp_demo_token".to_owned()),
}));

let result = client
    .initialize(InitializeParams::for_contract(
        AppClientInput {
            id: "my-rust-app".to_owned(),
            name: "My Rust App".to_owned(),
            version: "0.1.0".to_owned(),
            description: None,
            client_type: AppClientType::LocalCli,
        },
        ClientCapabilities {
            context: Some(Default::default()),
            memory: Some(MemoryClientCapabilities {
                propose: Some(true),
                create: None,
            }),
            consent: None,
            export: None,
        },
    )?)
    .await?;
# Ok(())
# }
```

Verification status and any local toolchain gaps are tracked in
[SDK Verification Notes](verification.md).

## Conformance Rules

SDKs must:

- use the generated v0.1 contract for protocol version, JSON-RPC version,
  method names, named defaults, and compatibility language
- reject unsupported protocol versions
- expose JSON-RPC protocol errors as structured errors
- keep endpoint, auth, and transport configuration explicit
- pass shared conformance fixture tests

SDKs must not:

- silently retry with a different protocol version
- invent hidden endpoint, token, grant, timeout, or identity defaults
- accept invalid response shapes as successful results
- claim production hosted-service security maturity for the local-first v0.1
  reference implementation
