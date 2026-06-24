import { ExportCreateParamsSchema, type ExportCreateParams } from "@pcp/protocol";
import { AuditService } from "../../services/auditService.js";
import { ConsentService } from "../../services/consentService.js";
import { ContextService } from "../../services/contextService.js";
import { ExportService } from "../../services/exportService.js";
import { parseParams } from "../validation.js";

export function handleExportCreate(
  consentService: ConsentService,
  contextService: ContextService,
  exportService: ExportService,
  auditService: AuditService,
  params: unknown
) {
  const parsed: ExportCreateParams = parseParams(ExportCreateParamsSchema, params);
  const grant = consentService.requireGrant(parsed.grantId, "context.export");
  const items = contextService.exportItems(grant, parsed.contextTypes);
  const exported = exportService.createJsonExport(grant, items);

  auditService.write({
    userId: grant.userId,
    clientId: grant.clientId,
    grantId: grant.id,
    action: "export.created",
    scope: "context.export",
    resourceId: exported.id,
    result: "success",
    details: { itemCount: exported.itemCount, format: exported.format }
  });

  return { export: exported };
}
