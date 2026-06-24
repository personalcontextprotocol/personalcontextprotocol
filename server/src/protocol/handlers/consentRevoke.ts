import { ConsentRevokeParamsSchema, type ConsentRevokeParams } from "@pcp/protocol";
import { AuditService } from "../../services/auditService.js";
import { ConsentService } from "../../services/consentService.js";
import { parseParams } from "../validation.js";

export function handleConsentRevoke(
  consentService: ConsentService,
  auditService: AuditService,
  params: unknown
) {
  const parsed: ConsentRevokeParams = parseParams(ConsentRevokeParamsSchema, params);
  const activeGrant = consentService.requireGrant(parsed.grantId, "consent.revoke");
  const grant = consentService.revoke(parsed.grantId);

  auditService.write({
    userId: activeGrant.userId,
    clientId: activeGrant.clientId,
    grantId: activeGrant.id,
    action: "consent.revoked",
    scope: "consent.revoke",
    resourceId: activeGrant.id,
    result: "success"
  });

  return { grant };
}
