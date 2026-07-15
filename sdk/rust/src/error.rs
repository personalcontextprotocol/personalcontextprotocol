use std::error::Error;
use std::fmt::{Display, Formatter};

#[derive(Debug, Clone)]
pub struct PcpProtocolError {
    pub code: i64,
    pub message: String,
    pub data: Option<serde_json::Value>,
}

#[derive(Debug)]
pub enum PcpSdkError {
    ContractParse(serde_json::Error),
    Serialize(serde_json::Error),
    Deserialize(serde_json::Error),
    Protocol(PcpProtocolError),
    Transport(Box<dyn Error + Send + Sync>),
    UnsupportedProtocolVersion { expected: String, actual: String },
    UnsupportedJsonRpcVersion(String),
}

pub type Result<T> = std::result::Result<T, PcpSdkError>;

impl Display for PcpSdkError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::ContractParse(error) => {
                write!(formatter, "failed to parse PCP contract: {error}")
            }
            Self::Serialize(error) => write!(formatter, "failed to serialize PCP value: {error}"),
            Self::Deserialize(error) => {
                write!(formatter, "failed to deserialize PCP value: {error}")
            }
            Self::Protocol(error) => {
                write!(
                    formatter,
                    "PCP protocol error {}: {}",
                    error.code, error.message
                )
            }
            Self::Transport(error) => write!(formatter, "PCP transport error: {error}"),
            Self::UnsupportedProtocolVersion { expected, actual } => {
                write!(
                    formatter,
                    "unsupported PCP protocol version: expected {expected}, got {actual}"
                )
            }
            Self::UnsupportedJsonRpcVersion(version) => {
                write!(formatter, "unsupported JSON-RPC version: {version}")
            }
        }
    }
}

impl Error for PcpSdkError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            Self::ContractParse(error) | Self::Serialize(error) | Self::Deserialize(error) => {
                Some(error)
            }
            Self::Transport(error) => Some(error.as_ref()),
            Self::Protocol(_)
            | Self::UnsupportedProtocolVersion { .. }
            | Self::UnsupportedJsonRpcVersion(_) => None,
        }
    }
}
