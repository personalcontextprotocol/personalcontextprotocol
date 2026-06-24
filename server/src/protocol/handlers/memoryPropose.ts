import { MemoryProposeParamsSchema, type MemoryProposeParams } from "@pcp/protocol";
import { AuditService } from "../../services/auditService.js";
import { ConsentService } from "../../services/consentService.js";
import { MemoryService } from "../../services/memoryService.js";
import { parseParams } from "../validation.js";

export function handleMemoryPropose(
  consentService: ConsentService,
  memoryService: MemoryService,
  auditService: AuditService,
  params: unknown
) {
  const parsed: MemoryProposeParams = parseParams(MemoryProposeParamsSchema, params);
  const grant = consentService.requireGrant(parsed.grantId, "memory.propose");
  const proposal = memoryService.propose(grant, parsed);

  auditService.write({
    userId: grant.userId,
    clientId: grant.clientId,
    grantId: grant.id,
    action: "memory.proposed",
    scope: "memory.propose",
    resourceId: proposal.id,
    result: "success",
    details: { type: proposal.proposedItem.type, reason: proposal.reason }
  });

  return {
    proposal: {
      id: proposal.id,
      status: proposal.status,
      createdAt: proposal.createdAt
    }
  };
}
