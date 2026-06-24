import { ContextSearchParamsSchema, type ContextSearchParams } from "@pcp/protocol";
import { AuditService } from "../../services/auditService.js";
import { ConsentService } from "../../services/consentService.js";
import { ContextService } from "../../services/contextService.js";
import { parseParams } from "../validation.js";

export function handleContextSearch(
  consentService: ConsentService,
  contextService: ContextService,
  auditService: AuditService,
  params: unknown
) {
  const parsed: ContextSearchParams = parseParams(ContextSearchParamsSchema, params);
  const grant = consentService.requireGrant(parsed.grantId, "context.search");
  const items = contextService.search(grant, parsed);

  auditService.write({
    userId: grant.userId,
    clientId: grant.clientId,
    grantId: grant.id,
    action: "context.searched",
    scope: "context.search",
    result: "success",
    details: { query: parsed.query, resultCount: items.length }
  });

  return { items, total: items.length };
}
