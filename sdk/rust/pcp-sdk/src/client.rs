use std::error::Error;
use std::future::Future;
use std::sync::atomic::{AtomicU64, Ordering};

use serde::de::DeserializeOwned;
use serde::Serialize;

use crate::contract::{contract, method_name, PcpMethod};
use crate::error::{PcpProtocolError, PcpSdkError, Result};
use crate::protocol::{JsonRpcId, JsonRpcRequest, JsonRpcResponse};
use crate::types::{
    AuditListParams, AuditListResult, ConsentListParams, ConsentListResult, ConsentRevokeParams,
    ConsentRevokeResult, ContextRequestParams, ContextRequestResult, ContextSearchParams,
    ContextSearchResult, ExportCreateParams, ExportCreateResult, InitializeParams,
    InitializeResult, MemoryCreateParams, MemoryCreateResult, MemoryDeleteParams,
    MemoryDeleteResult, MemoryProposeParams, MemoryProposeResult,
};

pub trait PcpTransport {
    type Error: Error + Send + Sync + 'static;

    fn send(
        &self,
        request: JsonRpcRequest,
    ) -> impl Future<Output = std::result::Result<JsonRpcResponse, Self::Error>> + Send;
}

#[derive(Debug, Clone)]
pub struct PcpClientConfig {
    pub initial_request_id: u64,
}

impl Default for PcpClientConfig {
    fn default() -> Self {
        Self {
            initial_request_id: 1,
        }
    }
}

pub struct PcpClient<TTransport> {
    transport: TTransport,
    next_id: AtomicU64,
}

impl<TTransport> PcpClient<TTransport>
where
    TTransport: PcpTransport,
{
    pub fn new(transport: TTransport) -> Self {
        Self::with_config(transport, PcpClientConfig::default())
    }

    pub fn with_config(transport: TTransport, config: PcpClientConfig) -> Self {
        Self {
            transport,
            next_id: AtomicU64::new(config.initial_request_id),
        }
    }

    pub async fn initialize(&self, params: InitializeParams) -> Result<InitializeResult> {
        ensure_protocol_version(&params.protocol_version)?;
        let result: InitializeResult = self.request(PcpMethod::Initialize, params).await?;
        ensure_protocol_version(&result.protocol_version)?;
        Ok(result)
    }

    pub async fn request_context(
        &self,
        params: ContextRequestParams,
    ) -> Result<ContextRequestResult> {
        self.request(PcpMethod::ContextRequest, params).await
    }

    pub async fn search_context(&self, params: ContextSearchParams) -> Result<ContextSearchResult> {
        self.request(PcpMethod::ContextSearch, params).await
    }

    pub async fn propose_memory(&self, params: MemoryProposeParams) -> Result<MemoryProposeResult> {
        self.request(PcpMethod::MemoryPropose, params).await
    }

    pub async fn create_memory(&self, params: MemoryCreateParams) -> Result<MemoryCreateResult> {
        self.request(PcpMethod::MemoryCreate, params).await
    }

    pub async fn delete_memory(&self, params: MemoryDeleteParams) -> Result<MemoryDeleteResult> {
        self.request(PcpMethod::MemoryDelete, params).await
    }

    pub async fn list_consent(&self, params: ConsentListParams) -> Result<ConsentListResult> {
        self.request(PcpMethod::ConsentList, params).await
    }

    pub async fn revoke_consent(&self, params: ConsentRevokeParams) -> Result<ConsentRevokeResult> {
        self.request(PcpMethod::ConsentRevoke, params).await
    }

    pub async fn list_audit(&self, params: AuditListParams) -> Result<AuditListResult> {
        self.request(PcpMethod::AuditList, params).await
    }

    pub async fn create_export(&self, params: ExportCreateParams) -> Result<ExportCreateResult> {
        self.request(PcpMethod::ExportCreate, params).await
    }

    pub async fn request<TParams, TResult>(
        &self,
        method: PcpMethod,
        params: TParams,
    ) -> Result<TResult>
    where
        TParams: Serialize,
        TResult: DeserializeOwned,
    {
        let request = JsonRpcRequest {
            jsonrpc: contract()?.envelope.jsonrpc.clone(),
            id: JsonRpcId::String(self.next_request_id()),
            method: method_name(method)?.to_owned(),
            params: Some(serde_json::to_value(params).map_err(PcpSdkError::Serialize)?),
        };

        let response = self
            .transport
            .send(request)
            .await
            .map_err(|error| PcpSdkError::Transport(Box::new(error)))?;

        match response {
            JsonRpcResponse::Success(success) => {
                ensure_jsonrpc_version(&success.jsonrpc)?;
                serde_json::from_value(success.result).map_err(PcpSdkError::Deserialize)
            }
            JsonRpcResponse::Error(error) => {
                ensure_jsonrpc_version(&error.jsonrpc)?;
                Err(PcpSdkError::Protocol(PcpProtocolError {
                    code: error.error.code,
                    message: error.error.message,
                    data: error.error.data,
                }))
            }
        }
    }

    fn next_request_id(&self) -> String {
        self.next_id.fetch_add(1, Ordering::SeqCst).to_string()
    }
}

fn ensure_jsonrpc_version(version: &str) -> Result<()> {
    let expected = &contract()?.envelope.jsonrpc;
    if version == expected {
        Ok(())
    } else {
        Err(PcpSdkError::UnsupportedJsonRpcVersion(version.to_owned()))
    }
}

fn ensure_protocol_version(version: &str) -> Result<()> {
    let expected = crate::generated_contract::PCP_PROTOCOL_VERSION;
    if version == expected {
        Ok(())
    } else {
        Err(PcpSdkError::UnsupportedProtocolVersion {
            expected: expected.to_owned(),
            actual: version.to_owned(),
        })
    }
}
