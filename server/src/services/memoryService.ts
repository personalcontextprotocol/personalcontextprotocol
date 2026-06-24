import { randomUUID } from "node:crypto";
import type {
  ConsentGrant,
  ContextItem,
  MemoryProposal,
  MemoryProposeParams,
  NewContextItem
} from "@pcp/protocol";
import type { PcpDatabase } from "../db/client.js";

export class MemoryService {
  constructor(private readonly db: PcpDatabase) {}

  propose(grant: ConsentGrant, params: MemoryProposeParams): MemoryProposal {
    const proposal: MemoryProposal = {
      id: randomUUID(),
      userId: grant.userId,
      clientId: grant.clientId,
      grantId: grant.id,
      proposedItem: params.proposedItem,
      reason: params.reason,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    this.db
      .prepare(
        `INSERT INTO memory_proposals
          (id, user_id, client_id, grant_id, proposed_item_json, reason, status, created_at, resolved_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        proposal.id,
        proposal.userId,
        proposal.clientId,
        proposal.grantId,
        JSON.stringify(proposal.proposedItem),
        proposal.reason,
        proposal.status,
        proposal.createdAt,
        null
      );

    return proposal;
  }

  create(grant: ConsentGrant, item: NewContextItem): ContextItem {
    const now = new Date().toISOString();
    const contextItem: ContextItem = {
      id: randomUUID(),
      userId: grant.userId,
      ...item,
      createdAt: now,
      updatedAt: now
    };

    this.db
      .prepare(
        `INSERT INTO context_items
          (id, user_id, type, content_json, tags_json, source_json, confidence, freshness_json, sensitivity, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        contextItem.id,
        contextItem.userId,
        contextItem.type,
        JSON.stringify(contextItem.content),
        JSON.stringify(contextItem.tags),
        JSON.stringify(contextItem.source),
        contextItem.confidence,
        JSON.stringify(contextItem.freshness),
        contextItem.sensitivity,
        contextItem.createdAt,
        contextItem.updatedAt
      );

    return contextItem;
  }
}
