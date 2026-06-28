import {
  JSON_RPC_VERSION,
  PCP_BEARER_AUTH_SCHEME,
  PCP_DEFAULTS,
  PCP_HTTP_JSON_RPC_METHOD,
  PCP_METHODS,
  PCP_PROTOCOL_VERSION
} from "./constants.js";

export const PCP_CONTRACT_ID = "pcp.v0.1" as const;

export const PCP_CONTRACT = {
  id: PCP_CONTRACT_ID,
  protocolVersion: PCP_PROTOCOL_VERSION,
  status: "official-v0.1-alpha-contract",
  envelope: {
    kind: "json-rpc",
    jsonrpc: JSON_RPC_VERSION
  },
  transport: {
    kind: "http-json-rpc",
    method: PCP_HTTP_JSON_RPC_METHOD
  },
  auth: {
    requiredByReferenceServer: true,
    schemes: [PCP_BEARER_AUTH_SCHEME]
  },
  defaults: PCP_DEFAULTS,
  methods: PCP_METHODS,
  compatibility: {
    line: "v0.1-alpha",
    guarantee:
      "Conforming v0.1 SDKs and servers must reject unknown protocol versions and validate every JSON-RPC params/result object against the v0.1 contract."
  }
} as const;

export type PcpContract = typeof PCP_CONTRACT;
