import { AuditListParamsSchema, type AuditListResult } from "@pcp/protocol";
import type { AuditService } from "../../services/auditService.js";
import type { ConsentService } from "../../services/consentService.js";
import { parseParams } from "../validation.js";

export function handleAuditList(
  consentService: ConsentService,
  auditService: AuditService,
  params: unknown
): AuditListResult {
  const parsed = parseParams(AuditListParamsSchema, params);
  const grant = consentService.requireGrant(parsed.grantId, "context.audit.read");
  const result = auditService.list(grant.userId, parsed);

  auditService.write({
    userId: grant.userId,
    clientId: grant.clientId,
    grantId: grant.id,
    action: "audit.listed",
    scope: "context.audit.read",
    result: "success",
    details: { count: result.logs.length, total: result.total }
  });

  return result;
}
