import {
  JSON_RPC_ERROR_CODES,
  MemoryDeleteParamsSchema,
  PcpError,
  type MemoryDeleteParams
} from "@pcp/protocol";
import type { AuthContext } from "../../http/auth.js";
import { AuditService } from "../../services/auditService.js";
import { ConsentService } from "../../services/consentService.js";
import { MemoryService } from "../../services/memoryService.js";
import { parseParams } from "../validation.js";

export function handleMemoryDelete(
  auth: AuthContext,
  consentService: ConsentService,
  memoryService: MemoryService,
  auditService: AuditService,
  params: unknown
) {
  const parsed: MemoryDeleteParams = parseParams(MemoryDeleteParamsSchema, params);
  const grant = consentService.requireGrant(parsed.grantId, "memory.write");

  if (!auth.isDemoAdmin) {
    auditService.write({
      userId: grant.userId,
      clientId: grant.clientId,
      grantId: grant.id,
      action: "memory.deleted",
      scope: "memory.write",
      resourceId: parsed.itemId,
      result: "denied",
      details: { reason: "memory.delete requires demo admin token" }
    });
    throw new PcpError(
      JSON_RPC_ERROR_CODES.INVALID_REQUEST,
      "memory.delete requires demo admin token"
    );
  }

  const item = memoryService.delete(grant, parsed.itemId);
  if (!item) {
    auditService.write({
      userId: grant.userId,
      clientId: grant.clientId,
      grantId: grant.id,
      action: "memory.deleted",
      scope: "memory.write",
      resourceId: parsed.itemId,
      result: "error",
      details: { reason: "context item not found" }
    });
    throw new PcpError(JSON_RPC_ERROR_CODES.INVALID_REQUEST, "memory item not found");
  }

  auditService.write({
    userId: grant.userId,
    clientId: grant.clientId,
    grantId: grant.id,
    action: "memory.deleted",
    scope: "memory.write",
    resourceId: item.id,
    result: "success"
  });

  return { item };
}
