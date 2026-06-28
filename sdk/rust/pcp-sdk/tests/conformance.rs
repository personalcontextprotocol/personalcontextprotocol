use std::error::Error;
use std::fmt::{Display, Formatter};
use std::future::Future;

use pcp_sdk::{
    contract, generated_contract, method_name, InitializeParams, InitializeResult, JsonRpcRequest,
    JsonRpcResponse, PcpClient, PcpMethod, PcpProtocolError, PcpSdkError, PcpTransport,
};

const INITIALIZE_REQUEST: &str =
    include_str!("../../../../packages/protocol/conformance/v0.1/valid/initialize.request.json");
const INITIALIZE_RESPONSE: &str =
    include_str!("../../../../packages/protocol/conformance/v0.1/valid/initialize.response.json");
const SCOPE_DENIED_RESPONSE: &str =
    include_str!("../../../../packages/protocol/conformance/v0.1/valid/scope-denied.response.json");
const UNSUPPORTED_VERSION_REQUEST: &str = include_str!(
    "../../../../packages/protocol/conformance/v0.1/invalid/unsupported-version.request.json"
);

#[derive(Debug)]
struct MockTransport {
    response: JsonRpcResponse,
}

impl PcpTransport for MockTransport {
    type Error = MockTransportError;

    fn send(
        &self,
        _request: JsonRpcRequest,
    ) -> impl Future<Output = std::result::Result<JsonRpcResponse, Self::Error>> + Send {
        let response = self.response.clone();
        async move { Ok(response) }
    }
}

#[derive(Debug)]
struct MockTransportError;

impl Display for MockTransportError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        formatter.write_str("mock transport error")
    }
}

impl Error for MockTransportError {}

#[test]
fn parses_the_generated_contract() {
    let parsed = contract().expect("contract parses");
    assert_eq!(parsed.id, generated_contract::PCP_CONTRACT_ID);
    assert_eq!(
        parsed.protocol_version,
        generated_contract::PCP_PROTOCOL_VERSION
    );
    assert_eq!(
        method_name(PcpMethod::ContextRequest).unwrap(),
        generated_contract::PCP_METHOD_CONTEXT_REQUEST
    );
}

#[test]
fn parses_the_initialize_request_fixture() {
    let request: JsonRpcRequest = serde_json::from_str(INITIALIZE_REQUEST).unwrap();
    assert_eq!(request.method, method_name(PcpMethod::Initialize).unwrap());

    let params: InitializeParams = serde_json::from_value(request.params.unwrap()).unwrap();
    assert_eq!(
        params.protocol_version,
        contract().unwrap().protocol_version
    );
}

#[test]
fn rejects_the_unsupported_version_fixture_by_contract_check() {
    let request: JsonRpcRequest = serde_json::from_str(UNSUPPORTED_VERSION_REQUEST).unwrap();
    let params: InitializeParams = serde_json::from_value(request.params.unwrap()).unwrap();
    assert_ne!(
        params.protocol_version,
        contract().unwrap().protocol_version
    );
}

#[tokio::test]
async fn client_rejects_unsupported_initialize_version_before_transport() {
    let request: JsonRpcRequest = serde_json::from_str(UNSUPPORTED_VERSION_REQUEST).unwrap();
    let params: InitializeParams = serde_json::from_value(request.params.unwrap()).unwrap();
    let response: JsonRpcResponse = serde_json::from_str(INITIALIZE_RESPONSE).unwrap();
    let client = PcpClient::new(MockTransport { response });

    let error = client.initialize(params).await.unwrap_err();
    match error {
        PcpSdkError::UnsupportedProtocolVersion { expected, actual } => {
            assert_eq!(expected, generated_contract::PCP_PROTOCOL_VERSION);
            assert_eq!(actual, "2026-01-01");
        }
        other => panic!("expected unsupported protocol version, got {other:?}"),
    }
}

#[tokio::test]
async fn client_deserializes_the_initialize_response_fixture() {
    let request: JsonRpcRequest = serde_json::from_str(INITIALIZE_REQUEST).unwrap();
    let params: InitializeParams = serde_json::from_value(request.params.unwrap()).unwrap();
    let response: JsonRpcResponse = serde_json::from_str(INITIALIZE_RESPONSE).unwrap();
    let client = PcpClient::new(MockTransport { response });

    let result: InitializeResult = client.initialize(params).await.unwrap();
    assert_eq!(
        result.protocol_version,
        contract().unwrap().protocol_version
    );
}

#[tokio::test]
async fn client_turns_error_responses_into_protocol_errors() {
    let request: JsonRpcRequest = serde_json::from_str(INITIALIZE_REQUEST).unwrap();
    let params: InitializeParams = serde_json::from_value(request.params.unwrap()).unwrap();
    let response: JsonRpcResponse = serde_json::from_str(SCOPE_DENIED_RESPONSE).unwrap();
    let client = PcpClient::new(MockTransport { response });

    let error = client.initialize(params).await.unwrap_err();
    match error {
        PcpSdkError::Protocol(PcpProtocolError { code, .. }) => assert_eq!(code, -32002),
        other => panic!("expected protocol error, got {other:?}"),
    }
}
