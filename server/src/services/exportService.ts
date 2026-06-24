import { randomUUID } from "node:crypto";
import type { ConsentGrant, ContextItem } from "@pcp/protocol";

export class ExportService {
  createJsonExport(grant: ConsentGrant, items: ContextItem[]) {
    return {
      id: randomUUID(),
      format: "json" as const,
      createdAt: new Date().toISOString(),
      itemCount: items.length,
      data: {
        contextItems: items
      },
      grant: {
        id: grant.id,
        clientId: grant.clientId,
        userId: grant.userId
      }
    };
  }
}
