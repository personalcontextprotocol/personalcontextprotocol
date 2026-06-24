export const PCP_PROTOCOL_VERSION = "2026-06-24" as const;

export const PCP_SERVER_INFO = {
  name: "pcp-reference-server",
  version: "0.1.0",
  description: "Reference PCP server"
} as const;

export const PCP_SERVER_INSTRUCTIONS =
  "This PCP server provides scoped personal context packs with provenance, confidence, sensitivity, and freshness metadata.";

export const PCP_METHODS = {
  initialize: "initialize",
  contextRequest: "pcp.context.request",
  contextSearch: "pcp.context.search",
  memoryPropose: "pcp.memory.propose",
  memoryCreate: "pcp.memory.create",
  consentList: "pcp.consent.list",
  consentRevoke: "pcp.consent.revoke",
  exportCreate: "pcp.export.create"
} as const;

export type PcpMethodName = (typeof PCP_METHODS)[keyof typeof PCP_METHODS];
