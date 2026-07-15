use std::sync::OnceLock;

use serde::Deserialize;

use crate::error::{PcpSdkError, Result};

pub const PCP_CONTRACT_JSON: &str =
    include_str!("../../../packages/protocol/schemas/pcp-v0.1.contract.json");
pub const PCP_JSON_SCHEMA: &str =
    include_str!("../../../packages/protocol/schemas/pcp-v0.1.schema.json");

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PcpContract {
    pub id: String,
    pub protocol_version: String,
    pub status: String,
    pub envelope: ContractEnvelope,
    pub transport: ContractTransport,
    pub auth: ContractAuth,
    pub defaults: ContractDefaults,
    pub methods: ContractMethods,
    pub compatibility: ContractCompatibility,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ContractEnvelope {
    pub kind: String,
    pub jsonrpc: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ContractTransport {
    pub kind: String,
    pub method: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContractAuth {
    pub required_by_reference_server: bool,
    pub schemes: Vec<String>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContractDefaults {
    pub context_request_max_items: u16,
    pub context_request_freshness_preference: String,
    pub context_request_include_sources: bool,
    pub context_request_include_confidence: bool,
    pub context_search_limit: u16,
    pub export_format: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContractMethods {
    pub initialize: String,
    pub context_request: String,
    pub context_search: String,
    pub memory_propose: String,
    pub memory_create: String,
    pub memory_delete: String,
    pub consent_list: String,
    pub consent_revoke: String,
    pub audit_list: String,
    pub export_create: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ContractCompatibility {
    pub line: String,
    pub guarantee: String,
}

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
pub enum PcpMethod {
    Initialize,
    ContextRequest,
    ContextSearch,
    MemoryPropose,
    MemoryCreate,
    MemoryDelete,
    ConsentList,
    ConsentRevoke,
    AuditList,
    ExportCreate,
}

static CONTRACT: OnceLock<PcpContract> = OnceLock::new();

pub fn contract() -> Result<&'static PcpContract> {
    if let Some(contract) = CONTRACT.get() {
        return Ok(contract);
    }

    let parsed = serde_json::from_str(PCP_CONTRACT_JSON).map_err(PcpSdkError::ContractParse)?;
    Ok(CONTRACT.get_or_init(|| parsed))
}

pub fn json_schema() -> &'static str {
    PCP_JSON_SCHEMA
}

pub fn method_name(method: PcpMethod) -> Result<&'static str> {
    let methods = &contract()?.methods;
    Ok(match method {
        PcpMethod::Initialize => &methods.initialize,
        PcpMethod::ContextRequest => &methods.context_request,
        PcpMethod::ContextSearch => &methods.context_search,
        PcpMethod::MemoryPropose => &methods.memory_propose,
        PcpMethod::MemoryCreate => &methods.memory_create,
        PcpMethod::MemoryDelete => &methods.memory_delete,
        PcpMethod::ConsentList => &methods.consent_list,
        PcpMethod::ConsentRevoke => &methods.consent_revoke,
        PcpMethod::AuditList => &methods.audit_list,
        PcpMethod::ExportCreate => &methods.export_create,
    })
}
