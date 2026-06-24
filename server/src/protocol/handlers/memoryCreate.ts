import {
  JSON_RPC_ERROR_CODES,
  MemoryCreateParamsSchema,
  PcpError,
  type MemoryCreateParams
} from "@pcp/protocol";
import type { AuthContext } from "../../http/auth.js";
import { AuditService } from "../../services/auditService.js";
import { ConsentService } from "../../services/consentService.js";
import { MemoryService } from "../../services/memoryService.js";
import { parseParams } from "../validation.js";

export function handleMemoryCreate(
  auth: AuthContext,
  consentService: ConsentService,
  memoryService: MemoryService,
  auditService: AuditService,
  params: unknown
) {
  const parsed: MemoryCreateParams = parseParams(MemoryCreateParamsSchema, params);
  const grant = consentService.requireGrant(parsed.grantId, "memory.write");

  if (!auth.isDemoAdmin) {
    auditService.write({
      userId: grant.userId,
      clientId: grant.clientId,
      grantId: grant.id,
      action: "memory.created",
      scope: "memory.write",
      result: "denied",
      details: { reason: "memory.create requires demo admin token" }
    });
    throw new PcpError(JSON_RPC_ERROR_CODES.INVALID_REQUEST, "memory.create requires demo admin token");
  }

  const item = memoryService.create(grant, parsed.item);
  auditService.write({
    userId: grant.userId,
    clientId: grant.clientId,
    grantId: grant.id,
    action: "memory.created",
    scope: "memory.write",
    resourceId: item.id,
    result: "success"
  });

  return { item };
}
