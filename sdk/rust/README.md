# pcp-sdk

Rust SDK for the PCP v0.1 alpha contract.

The crate reads the checked-in PCP contract and JSON Schema artifacts from
`packages/protocol/schemas`. Method names, JSON-RPC version, transport method,
and protocol version come from those generated artifacts instead of separate
Rust constants.

This crate is marked `publish = false` until repository ownership and release
metadata are finalized.

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

assert_eq!(result.protocol_version, pcp_sdk::contract()?.protocol_version);
# Ok(())
# }
```
