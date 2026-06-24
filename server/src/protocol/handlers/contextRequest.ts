import {
  ContextRequestParamsSchema,
  type ContextRequestParams
} from "@pcp/protocol";
import { AuditService } from "../../services/auditService.js";
import { ConsentService } from "../../services/consentService.js";
import { ContextService } from "../../services/contextService.js";
import { parseParams } from "../validation.js";

export function handleContextRequest(
  consentService: ConsentService,
  contextService: ContextService,
  auditService: AuditService,
  params: unknown
) {
  const parsed: ContextRequestParams = parseParams(ContextRequestParamsSchema, params);
  const grant = consentService.requireGrant(parsed.grantId, "context.read");

  auditService.write({
    userId: grant.userId,
    clientId: grant.clientId,
    grantId: grant.id,
    action: "context.requested",
    scope: "context.read",
    result: "success",
    details: { purpose: parsed.purpose, task: parsed.task }
  });

  const contextPack = contextService.requestContext(grant, parsed);

  auditService.write({
    userId: grant.userId,
    clientId: grant.clientId,
    grantId: grant.id,
    action: "context.returned",
    scope: "context.read",
    resourceId: contextPack.id,
    result: "success",
    details: { itemCount: contextPack.items.length }
  });

  return { contextPack };
}
