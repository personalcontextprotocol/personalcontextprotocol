use serde::{Deserialize, Serialize};

use crate::contract::contract;
use crate::error::Result;

pub type DateTime = String;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AppClientType {
    LocalCli,
    AiAssistant,
    IdeAgent,
    WebApp,
    DesktopApp,
    Other,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppClientInput {
    pub id: String,
    pub name: String,
    pub version: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(rename = "type", default = "default_app_client_type")]
    pub client_type: AppClientType,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppClient {
    pub id: String,
    pub name: String,
    pub version: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(rename = "type", default = "default_app_client_type")]
    pub client_type: AppClientType,
    pub created_at: DateTime,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum PermissionScope {
    #[serde(rename = "context.read")]
    ContextRead,
    #[serde(rename = "context.search")]
    ContextSearch,
    #[serde(rename = "memory.propose")]
    MemoryPropose,
    #[serde(rename = "memory.write")]
    MemoryWrite,
    #[serde(rename = "consent.read")]
    ConsentRead,
    #[serde(rename = "consent.revoke")]
    ConsentRevoke,
    #[serde(rename = "context.export")]
    ContextExport,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ConsentGrantStatus {
    Active,
    Revoked,
    Expired,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsentGrant {
    pub id: String,
    pub user_id: String,
    pub client_id: String,
    pub scopes: Vec<PermissionScope>,
    pub purpose: String,
    pub status: ConsentGrantStatus,
    pub created_at: DateTime,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<DateTime>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub revoked_at: Option<DateTime>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ContextType {
    UserProfile,
    Preference,
    Project,
    Goal,
    MemoryItem,
    DecisionHistory,
    CommunicationStyle,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SourceType {
    ManualUserEntry,
    Imported,
    ClientProposal,
    ModelInference,
    SystemSeed,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Sensitivity {
    Low,
    Medium,
    High,
    Restricted,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum FreshnessStatus {
    Fresh,
    Aging,
    Stale,
    Unknown,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextContent {
    pub text: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<serde_json::Value>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextSource {
    #[serde(rename = "type")]
    pub source_type: SourceType,
    pub origin: String,
    pub method: String,
    pub captured_at: DateTime,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reference: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextFreshness {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_verified_at: Option<DateTime>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<DateTime>,
    pub status: FreshnessStatus,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextItem {
    pub id: String,
    pub user_id: String,
    #[serde(rename = "type")]
    pub context_type: ContextType,
    pub content: ContextContent,
    #[serde(default)]
    pub tags: Vec<String>,
    pub source: ContextSource,
    pub confidence: f64,
    pub freshness: ContextFreshness,
    pub sensitivity: Sensitivity,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewContextItem {
    #[serde(rename = "type")]
    pub context_type: ContextType,
    pub content: ContextContent,
    #[serde(default)]
    pub tags: Vec<String>,
    pub source: ContextSource,
    pub confidence: f64,
    pub freshness: ContextFreshness,
    pub sensitivity: Sensitivity,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextPack {
    pub id: String,
    pub user_id: String,
    pub client_id: String,
    pub grant_id: String,
    pub purpose: String,
    pub generated_at: DateTime,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<DateTime>,
    pub items: Vec<ContextItem>,
    pub warnings: Vec<String>,
    pub limits: ContextPackLimits,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextPackLimits {
    pub max_items: u16,
    pub sensitive_items_excluded: u16,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClientCapabilities {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context: Option<serde_json::Map<String, serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub memory: Option<MemoryClientCapabilities>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub consent: Option<serde_json::Map<String, serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub export: Option<serde_json::Map<String, serde_json::Value>>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MemoryClientCapabilities {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub propose: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub create: Option<bool>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InitializeParams {
    pub protocol_version: String,
    pub client_info: AppClientInput,
    pub capabilities: ClientCapabilities,
}

impl InitializeParams {
    pub fn for_contract(
        client_info: AppClientInput,
        capabilities: ClientCapabilities,
    ) -> Result<Self> {
        Ok(Self {
            protocol_version: contract()?.protocol_version.clone(),
            client_info,
            capabilities,
        })
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InitializeResult {
    pub protocol_version: String,
    pub server_info: ServerInfo,
    pub capabilities: ServerCapabilities,
    pub instructions: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ServerInfo {
    pub name: String,
    pub version: String,
    pub description: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ServerCapabilities {
    pub context: ContextServerCapabilities,
    pub memory: MemoryServerCapabilities,
    pub consent: ConsentServerCapabilities,
    pub export: ExportServerCapabilities,
    pub audit: AuditServerCapabilities,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ContextServerCapabilities {
    pub request: bool,
    pub search: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct MemoryServerCapabilities {
    pub propose: bool,
    pub create: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConsentServerCapabilities {
    pub list: bool,
    pub revoke: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ExportServerCapabilities {
    pub create: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct AuditServerCapabilities {
    pub enabled: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FreshnessPreference {
    RecentFirst,
    VerifiedFirst,
    Any,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextRequestParams {
    pub grant_id: String,
    pub purpose: String,
    pub task: String,
    pub context_types: Vec<ContextType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_items: Option<u16>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub freshness_preference: Option<FreshnessPreference>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_sources: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_confidence: Option<bool>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextRequestResult {
    pub context_pack: ContextPack,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextSearchParams {
    pub grant_id: String,
    pub query: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context_types: Option<Vec<ContextType>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u16>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ContextSearchResult {
    pub items: Vec<ContextItem>,
    pub total: u64,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MemoryProposeParams {
    pub grant_id: String,
    pub proposed_item: NewContextItem,
    pub reason: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MemoryProposalStatus {
    Pending,
    Accepted,
    Rejected,
    AcceptedWithEdits,
    Expired,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MemoryProposalSummary {
    pub id: String,
    pub status: MemoryProposalStatus,
    pub created_at: DateTime,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct MemoryProposeResult {
    pub proposal: MemoryProposalSummary,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MemoryCreateParams {
    pub grant_id: String,
    pub item: NewContextItem,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct MemoryCreateResult {
    pub item: ContextItem,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ConsentListParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub client_id: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConsentListResult {
    pub grants: Vec<ConsentGrant>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConsentRevokeParams {
    pub grant_id: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConsentRevokeResult {
    pub grant: ConsentGrant,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ExportFormat {
    #[serde(rename = "json")]
    Json,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportCreateParams {
    pub grant_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub format: Option<ExportFormat>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context_types: Option<Vec<ContextType>>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ExportCreateResult {
    #[serde(rename = "export")]
    pub export_data: ContextExport,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextExport {
    pub id: String,
    pub format: ExportFormat,
    pub created_at: DateTime,
    pub item_count: u64,
    pub data: ContextExportData,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ContextExportData {
    pub context_items: Vec<ContextItem>,
}

fn default_app_client_type() -> AppClientType {
    AppClientType::Other
}
