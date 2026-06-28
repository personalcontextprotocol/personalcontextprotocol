use pcp_sdk::{
    AppClientInput, AppClientType, ClientCapabilities, HttpPcpTransport, HttpPcpTransportConfig,
    InitializeParams, MemoryClientCapabilities, PcpClient,
};

#[tokio::main(flavor = "current_thread")]
async fn main() -> pcp_sdk::Result<()> {
    let endpoint =
        std::env::var("PCP_ENDPOINT").unwrap_or_else(|_| "http://127.0.0.1:8787/pcp".to_owned());
    let bearer_token = std::env::var("PCP_DEMO_TOKEN").ok();

    let client = PcpClient::new(HttpPcpTransport::new(HttpPcpTransportConfig {
        endpoint,
        bearer_token,
    }));

    let result = client
        .initialize(InitializeParams::for_contract(
            AppClientInput {
                id: "rust-example".to_owned(),
                name: "Rust PCP Example".to_owned(),
                version: "0.1.0".to_owned(),
                description: Some("Minimal Rust PCP initialize flow".to_owned()),
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

    println!("initialized PCP {}", result.protocol_version);
    Ok(())
}
