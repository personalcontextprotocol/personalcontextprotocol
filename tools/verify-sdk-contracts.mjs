import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const repoRoot = resolve(import.meta.dirname, "..");
const contract = readJson("packages/protocol/schemas/pcp-v0.1.contract.json");
const rustGenerated = readText("sdk/rust/src/generated_contract.rs");

const generatedRustConstants = parseRustStringConstants(rustGenerated);
const expectedRustConstants = {
  PCP_CONTRACT_ID: contract.id,
  PCP_PROTOCOL_VERSION: contract.protocolVersion,
  PCP_JSON_RPC_VERSION: contract.envelope.jsonrpc,
  PCP_HTTP_JSON_RPC_METHOD: contract.transport.method,
  PCP_BEARER_AUTH_SCHEME: contract.auth.schemes[0],
  PCP_SERVER_INFO_NAME: contract.referenceServer.info.name,
  PCP_SERVER_INFO_VERSION: contract.referenceServer.info.version,
  PCP_SERVER_INFO_DESCRIPTION: contract.referenceServer.info.description,
  PCP_SERVER_INSTRUCTIONS: contract.referenceServer.instructions,
  PCP_METHOD_INITIALIZE: contract.methods.initialize,
  PCP_METHOD_CONTEXT_REQUEST: contract.methods.contextRequest,
  PCP_METHOD_CONTEXT_SEARCH: contract.methods.contextSearch,
  PCP_METHOD_MEMORY_PROPOSE: contract.methods.memoryPropose,
  PCP_METHOD_MEMORY_CREATE: contract.methods.memoryCreate,
  PCP_METHOD_MEMORY_DELETE: contract.methods.memoryDelete,
  PCP_METHOD_CONSENT_LIST: contract.methods.consentList,
  PCP_METHOD_CONSENT_REVOKE: contract.methods.consentRevoke,
  PCP_METHOD_AUDIT_LIST: contract.methods.auditList,
  PCP_METHOD_EXPORT_CREATE: contract.methods.exportCreate
};

for (const [name, expected] of Object.entries(expectedRustConstants)) {
  assertEqual(generatedRustConstants.get(name), expected, `generated Rust constant ${name}`);
}

const initializeRequest = readJson(
  "packages/protocol/conformance/v0.1/valid/initialize.request.json"
);
assertEqual(initializeRequest.jsonrpc, contract.envelope.jsonrpc, "initialize fixture jsonrpc");
assertEqual(initializeRequest.method, contract.methods.initialize, "initialize fixture method");
assertEqual(
  initializeRequest.params.protocolVersion,
  contract.protocolVersion,
  "initialize fixture protocol version"
);

const contextRequest = readJson(
  "packages/protocol/conformance/v0.1/valid/context-request.request.json"
);
assertEqual(
  contextRequest.jsonrpc,
  contract.envelope.jsonrpc,
  "context request fixture jsonrpc"
);
assertEqual(
  contextRequest.method,
  contract.methods.contextRequest,
  "context request fixture method"
);
assertAbsent(contextRequest.params.maxItems, "context request fixture maxItems");
assertAbsent(
  contextRequest.params.freshnessPreference,
  "context request fixture freshnessPreference"
);

const unsupportedVersion = readJson(
  "packages/protocol/conformance/v0.1/invalid/unsupported-version.request.json"
);
if (unsupportedVersion.params.protocolVersion === contract.protocolVersion) {
  throw new Error("unsupported-version fixture must not use the current protocol version");
}

const cargoToml = readText("sdk/rust/Cargo.toml");
if (!/\npublish = false\n/.test(cargoToml)) {
  throw new Error("Rust crate must remain publish = false until release metadata is final");
}

const rustSourceFiles = listFiles(resolve(repoRoot, "sdk/rust/src")).filter(
  (path) => path.endsWith(".rs") && !path.endsWith("generated_contract.rs")
);
const forbiddenRustLiterals = [
  contract.protocolVersion,
  contract.envelope.jsonrpc,
  contract.transport.method,
  contract.auth.schemes[0],
  ...Object.values(contract.methods)
];

for (const filePath of rustSourceFiles) {
  const text = readFileSync(filePath, "utf8");
  for (const literal of forbiddenRustLiterals) {
    if (text.includes(`"${literal}"`)) {
      throw new Error(
        `${relative(repoRoot, filePath)} contains protocol literal "${literal}" outside generated_contract.rs`
      );
    }
  }
}

console.log("SDK contract verifier passed");

function readJson(path) {
  return JSON.parse(readText(path));
}

function readText(path) {
  return readFileSync(resolve(repoRoot, path), "utf8");
}

function parseRustStringConstants(text) {
  const constants = new Map();
  const pattern = /^pub const ([A-Z0-9_]+): &str = "([^"]*)";$/gm;
  for (const match of text.matchAll(pattern)) {
    constants.set(match[1], match[2]);
  }
  return constants;
}

function listFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? listFiles(path) : [path];
  });
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label} mismatch: expected ${expected}, got ${actual}`);
  }
}

function assertAbsent(value, label) {
  if (value !== undefined) {
    throw new Error(`${label} should be omitted so named contract defaults are exercised`);
  }
}
