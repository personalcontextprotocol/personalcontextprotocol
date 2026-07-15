use std::error::Error;
use std::fmt::{Display, Formatter};
use std::future::Future;
use std::sync::{Arc, Mutex};

use pcp_sdk::{
    contract, generated_contract, method_name, AuditListParams, AuditListResult, ConsentListParams,
    ConsentListResult, ConsentRevokeParams, ConsentRevokeResult, ContextContent, ContextFreshness,
    ContextRequestParams, ContextRequestResult, ContextSearchParams, ContextSearchResult,
    ContextSource, ContextType, ExportCreateParams, ExportCreateResult, FreshnessPreference,
    FreshnessStatus, InitializeParams, InitializeResult, JsonRpcId, JsonRpcRequest,
    JsonRpcResponse, JsonRpcSuccessResponse, MemoryCreateParams, MemoryCreateResult,
    MemoryDeleteParams, MemoryDeleteResult, MemoryProposeParams, MemoryProposeResult,
    NewContextItem, PcpClient, PcpMethod, PcpProtocolError, PcpSdkError, PcpTransport, Sensitivity,
    SourceType,
};
use serde_json::json;

const INITIALIZE_REQUEST: &str =
    include_str!("../../../packages/protocol/conformance/v0.1/valid/initialize.request.json");
const INITIALIZE_RESPONSE: &str =
    include_str!("../../../packages/protocol/conformance/v0.1/valid/initialize.response.json");
const SCOPE_DENIED_RESPONSE: &str =
    include_str!("../../../packages/protocol/conformance/v0.1/valid/scope-denied.response.json");
const UNSUPPORTED_VERSION_REQUEST: &str = include_str!(
    "../../../packages/protocol/conformance/v0.1/invalid/unsupported-version.request.json"
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

#[derive(Debug)]
struct RecordingTransport {
    response: JsonRpcResponse,
    requests: Arc<Mutex<Vec<JsonRpcRequest>>>,
}

impl PcpTransport for RecordingTransport {
    type Error = MockTransportError;

    fn send(
        &self,
        request: JsonRpcRequest,
    ) -> impl Future<Output = std::result::Result<JsonRpcResponse, Self::Error>> + Send {
        let response = self.response.clone();
        let requests = Arc::clone(&self.requests);
        async move {
            requests.lock().unwrap().push(request);
            Ok(response)
        }
    }
}

fn client_with_result(
    result: serde_json::Value,
) -> (
    PcpClient<RecordingTransport>,
    Arc<Mutex<Vec<JsonRpcRequest>>>,
) {
    let requests = Arc::new(Mutex::new(Vec::new()));
    let client = PcpClient::new(RecordingTransport {
        response: JsonRpcResponse::Success(JsonRpcSuccessResponse {
            jsonrpc: generated_contract::PCP_JSON_RPC_VERSION.to_owned(),
            id: JsonRpcId::String("1".to_owned()),
            result,
        }),
        requests: Arc::clone(&requests),
    });

    (client, requests)
}

fn assert_requested_method(requests: &Arc<Mutex<Vec<JsonRpcRequest>>>, method: PcpMethod) {
    let requests = requests.lock().unwrap();
    assert_eq!(requests.len(), 1);
    assert_eq!(requests[0].method, method_name(method).unwrap());
}

fn sample_new_context_item() -> NewContextItem {
    NewContextItem {
        context_type: ContextType::MemoryItem,
        content: ContextContent {
            text: "Launch-ready Rust SDK coverage.".to_owned(),
            data: None,
        },
        tags: vec!["sdk".to_owned()],
        source: ContextSource {
            source_type: SourceType::ManualUserEntry,
            origin: "rust-sdk-test".to_owned(),
            method: "unit".to_owned(),
            captured_at: "2026-07-10T00:00:00.000Z".to_owned(),
            reference: None,
        },
        confidence: 1.0,
        freshness: ContextFreshness {
            last_verified_at: None,
            expires_at: None,
            status: FreshnessStatus::Fresh,
        },
        sensitivity: Sensitivity::Low,
    }
}

fn context_item_json() -> serde_json::Value {
    json!({
        "id": "ctx_1",
        "userId": "user_1",
        "type": "MemoryItem",
        "content": {
            "text": "Launch-ready Rust SDK coverage."
        },
        "tags": ["sdk"],
        "source": {
            "type": "manual_user_entry",
            "origin": "rust-sdk-test",
            "method": "unit",
            "capturedAt": "2026-07-10T00:00:00.000Z"
        },
        "confidence": 1.0,
        "freshness": {
            "status": "fresh"
        },
        "sensitivity": "low",
        "createdAt": "2026-07-10T00:00:00.000Z",
        "updatedAt": "2026-07-10T00:00:00.000Z"
    })
}

fn context_pack_json() -> serde_json::Value {
    json!({
        "id": "pack_1",
        "userId": "user_1",
        "clientId": "client_1",
        "grantId": "grant_1",
        "purpose": "sdk verification",
        "generatedAt": "2026-07-10T00:00:00.000Z",
        "items": [context_item_json()],
        "warnings": [],
        "limits": {
            "maxItems": 1,
            "sensitiveItemsExcluded": 0
        }
    })
}

fn grant_json() -> serde_json::Value {
    json!({
        "id": "grant_1",
        "userId": "user_1",
        "clientId": "client_1",
        "scopes": ["context.read"],
        "purpose": "sdk verification",
        "status": "active",
        "createdAt": "2026-07-10T00:00:00.000Z"
    })
}

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

#[tokio::test]
async fn client_helpers_send_canonical_methods_and_deserialize_results() {
    let (client, requests) = client_with_result(json!({
        "contextPack": context_pack_json()
    }));
    let result: ContextRequestResult = client
        .request_context(ContextRequestParams {
            grant_id: "grant_1".to_owned(),
            purpose: "sdk verification".to_owned(),
            task: "read launch state".to_owned(),
            context_types: vec![ContextType::MemoryItem],
            max_items: Some(1),
            freshness_preference: Some(FreshnessPreference::RecentFirst),
            include_sources: Some(true),
            include_confidence: Some(true),
        })
        .await
        .unwrap();
    assert_eq!(result.context_pack.id, "pack_1");
    assert_requested_method(&requests, PcpMethod::ContextRequest);

    let (client, requests) = client_with_result(json!({
        "items": [context_item_json()],
        "total": 1
    }));
    let result: ContextSearchResult = client
        .search_context(ContextSearchParams {
            grant_id: "grant_1".to_owned(),
            query: "sdk".to_owned(),
            context_types: Some(vec![ContextType::MemoryItem]),
            limit: Some(1),
        })
        .await
        .unwrap();
    assert_eq!(result.total, 1);
    assert_requested_method(&requests, PcpMethod::ContextSearch);

    let (client, requests) = client_with_result(json!({
        "proposal": {
            "id": "proposal_1",
            "status": "pending",
            "createdAt": "2026-07-10T00:00:00.000Z"
        }
    }));
    let result: MemoryProposeResult = client
        .propose_memory(MemoryProposeParams {
            grant_id: "grant_1".to_owned(),
            proposed_item: sample_new_context_item(),
            reason: "sdk verification".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!(result.proposal.id, "proposal_1");
    assert_requested_method(&requests, PcpMethod::MemoryPropose);

    let (client, requests) = client_with_result(json!({
        "item": context_item_json()
    }));
    let result: MemoryCreateResult = client
        .create_memory(MemoryCreateParams {
            grant_id: "grant_1".to_owned(),
            item: sample_new_context_item(),
        })
        .await
        .unwrap();
    assert_eq!(result.item.id, "ctx_1");
    assert_requested_method(&requests, PcpMethod::MemoryCreate);

    let (client, requests) = client_with_result(json!({
        "item": context_item_json()
    }));
    let result: MemoryDeleteResult = client
        .delete_memory(MemoryDeleteParams {
            grant_id: "grant_1".to_owned(),
            item_id: "ctx_1".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!(result.item.id, "ctx_1");
    assert_requested_method(&requests, PcpMethod::MemoryDelete);

    let (client, requests) = client_with_result(json!({
        "grants": [grant_json()]
    }));
    let result: ConsentListResult = client
        .list_consent(ConsentListParams {
            client_id: Some("client_1".to_owned()),
        })
        .await
        .unwrap();
    assert_eq!(result.grants.len(), 1);
    assert_requested_method(&requests, PcpMethod::ConsentList);

    let (client, requests) = client_with_result(json!({
        "grant": grant_json()
    }));
    let result: ConsentRevokeResult = client
        .revoke_consent(ConsentRevokeParams {
            grant_id: "grant_1".to_owned(),
        })
        .await
        .unwrap();
    assert_eq!(result.grant.id, "grant_1");
    assert_requested_method(&requests, PcpMethod::ConsentRevoke);

    let (client, requests) = client_with_result(json!({
        "logs": [{
            "id": "audit_1",
            "userId": "user_1",
            "clientId": "client_1",
            "grantId": "grant_1",
            "action": "audit.listed",
            "scope": "context.audit.read",
            "timestamp": "2026-07-10T00:00:00.000Z",
            "result": "success"
        }],
        "total": 1
    }));
    let result: AuditListResult = client
        .list_audit(AuditListParams {
            grant_id: "grant_1".to_owned(),
            client_id: Some("client_1".to_owned()),
            actions: None,
            results: None,
            resource_id: None,
            since: None,
            until: None,
            limit: Some(1),
        })
        .await
        .unwrap();
    assert_eq!(result.total, 1);
    assert_requested_method(&requests, PcpMethod::AuditList);

    let (client, requests) = client_with_result(json!({
        "export": {
            "id": "export_1",
            "format": "json",
            "createdAt": "2026-07-10T00:00:00.000Z",
            "itemCount": 1,
            "data": {
                "contextItems": [context_item_json()]
            }
        }
    }));
    let result: ExportCreateResult = client
        .create_export(ExportCreateParams {
            grant_id: "grant_1".to_owned(),
            format: None,
            context_types: Some(vec![ContextType::MemoryItem]),
        })
        .await
        .unwrap();
    assert_eq!(result.export_data.id, "export_1");
    assert_requested_method(&requests, PcpMethod::ExportCreate);
}
