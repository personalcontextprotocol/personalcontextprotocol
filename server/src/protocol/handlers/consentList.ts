import { ConsentListParamsSchema, type ConsentListParams } from "@pcp/protocol";
import type { ServerConfig } from "../../config.js";
import { AuditService } from "../../services/auditService.js";
import { ConsentService } from "../../services/consentService.js";
import { parseParams } from "../validation.js";

export function handleConsentList(
  config: ServerConfig,
  consentService: ConsentService,
  auditService: AuditService,
  params: unknown
) {
  const parsed: ConsentListParams = parseParams(ConsentListParamsSchema, params);
  const clientId = parsed.clientId ?? config.defaultClientId;
  consentService.requireClientScope(clientId, "consent.read");
  const grants = consentService.listForClient(clientId);

  auditService.write({
    userId: grants[0]?.userId ?? "unknown",
    clientId,
    action: "consent.listed",
    scope: "consent.read",
    result: "success",
    details: { count: grants.length }
  });

  return { grants };
}
