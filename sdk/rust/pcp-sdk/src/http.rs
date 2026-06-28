use std::error::Error;
use std::fmt::{Display, Formatter};
use std::future::Future;

use reqwest::header::{AUTHORIZATION, CONTENT_TYPE};

use crate::client::PcpTransport;
use crate::generated_contract::{PCP_BEARER_AUTH_SCHEME, PCP_HTTP_JSON_RPC_METHOD};
use crate::protocol::{JsonRpcRequest, JsonRpcResponse};

#[derive(Debug, Clone)]
pub struct HttpPcpTransportConfig {
    pub endpoint: String,
    pub bearer_token: Option<String>,
}

#[derive(Clone)]
pub struct HttpPcpTransport {
    client: reqwest::Client,
    config: HttpPcpTransportConfig,
}

impl HttpPcpTransport {
    pub fn new(config: HttpPcpTransportConfig) -> Self {
        Self {
            client: reqwest::Client::new(),
            config,
        }
    }

    pub fn with_client(config: HttpPcpTransportConfig, client: reqwest::Client) -> Self {
        Self { client, config }
    }
}

impl PcpTransport for HttpPcpTransport {
    type Error = HttpPcpTransportError;

    fn send(
        &self,
        request: JsonRpcRequest,
    ) -> impl Future<Output = Result<JsonRpcResponse, Self::Error>> + Send {
        async move {
            if PCP_HTTP_JSON_RPC_METHOD != reqwest::Method::POST.as_str() {
                return Err(HttpPcpTransportError::UnsupportedMethod(
                    PCP_HTTP_JSON_RPC_METHOD.to_owned(),
                ));
            }

            let mut builder = self
                .client
                .post(&self.config.endpoint)
                .header(CONTENT_TYPE, "application/json")
                .json(&request);

            if let Some(token) = &self.config.bearer_token {
                builder =
                    builder.header(AUTHORIZATION, format!("{PCP_BEARER_AUTH_SCHEME} {token}"));
            }

            let response = builder
                .send()
                .await
                .map_err(HttpPcpTransportError::Request)?;
            let status = response.status();
            let body = response
                .text()
                .await
                .map_err(HttpPcpTransportError::Request)?;

            if !status.is_success() {
                return Err(HttpPcpTransportError::Status {
                    status: status.as_u16(),
                    body,
                });
            }

            serde_json::from_str(&body).map_err(HttpPcpTransportError::Decode)
        }
    }
}

#[derive(Debug)]
pub enum HttpPcpTransportError {
    UnsupportedMethod(String),
    Request(reqwest::Error),
    Status { status: u16, body: String },
    Decode(serde_json::Error),
}

impl Display for HttpPcpTransportError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::UnsupportedMethod(method) => {
                write!(formatter, "unsupported PCP HTTP method: {method}")
            }
            Self::Request(error) => write!(formatter, "PCP HTTP transport request failed: {error}"),
            Self::Status { status, body } => {
                write!(
                    formatter,
                    "PCP HTTP transport returned status {status}: {body}"
                )
            }
            Self::Decode(error) => write!(formatter, "PCP HTTP transport decode failed: {error}"),
        }
    }
}

impl Error for HttpPcpTransportError {
    fn source(&self) -> Option<&(dyn Error + 'static)> {
        match self {
            Self::Request(error) => Some(error),
            Self::Decode(error) => Some(error),
            Self::UnsupportedMethod(_) | Self::Status { .. } => None,
        }
    }
}
