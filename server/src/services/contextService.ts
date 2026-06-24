import { randomUUID } from "node:crypto";
import type {
  ContextItem,
  ContextPack,
  ContextRequestParams,
  ContextSearchParams,
  ConsentGrant
} from "@pcp/protocol";
import type { PcpDatabase } from "../db/client.js";
import { rowToContextItem } from "../db/client.js";

export class ContextService {
  constructor(private readonly db: PcpDatabase) {}

  requestContext(grant: ConsentGrant, params: ContextRequestParams): ContextPack {
    const placeholders = params.contextTypes.map(() => "?").join(", ");
    const orderBy =
      params.freshnessPreference === "verified_first"
        ? "json_extract(freshness_json, '$.lastVerifiedAt') DESC, updated_at DESC"
        : "updated_at DESC";

    const rows = this.db
      .prepare(
        `SELECT * FROM context_items
         WHERE user_id = ?
           AND type IN (${placeholders})
           AND sensitivity != 'restricted'
         ORDER BY ${orderBy}
         LIMIT ?`
      )
      .all(grant.userId, ...params.contextTypes, params.maxItems) as Record<string, unknown>[];

    const items = rows.map(rowToContextItem).map((item) =>
      this.applyProjection(item, params.includeSources, params.includeConfidence)
    );

    const excluded = this.countRestrictedItems(grant.userId, params.contextTypes);

    return {
      id: randomUUID(),
      userId: grant.userId,
      clientId: grant.clientId,
      grantId: grant.id,
      purpose: params.purpose,
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      items,
      warnings: excluded > 0 ? ["Restricted sensitivity items were excluded."] : [],
      limits: {
        maxItems: params.maxItems,
        sensitiveItemsExcluded: excluded
      }
    };
  }

  search(grant: ConsentGrant, params: ContextSearchParams): ContextItem[] {
    const terms = params.query
      .toLowerCase()
      .split(/\s+/)
      .map((term) => term.trim())
      .filter(Boolean)
      .slice(0, 8);
    const types = params.contextTypes ?? [];
    const typeClause = types.length > 0 ? `AND type IN (${types.map(() => "?").join(", ")})` : "";
    const searchClause = terms
      .map(
        () =>
          "(lower(content_json) LIKE ? OR lower(tags_json) LIKE ? OR lower(source_json) LIKE ?)"
      )
      .join(" OR ");
    const searchValues = terms.flatMap((term) => {
      const like = `%${term}%`;
      return [like, like, like];
    });

    const rows = this.db
      .prepare(
        `SELECT * FROM context_items
         WHERE user_id = ?
           AND sensitivity != 'restricted'
           ${typeClause}
           AND (${searchClause})
         ORDER BY updated_at DESC
         LIMIT ?`
      )
      .all(grant.userId, ...types, ...searchValues, params.limit) as Record<string, unknown>[];

    return rows.map(rowToContextItem);
  }

  exportItems(grant: ConsentGrant, contextTypes?: ContextItem["type"][]): ContextItem[] {
    const types = contextTypes ?? [];
    const typeClause = types.length > 0 ? `AND type IN (${types.map(() => "?").join(", ")})` : "";
    const rows = this.db
      .prepare(
        `SELECT * FROM context_items
         WHERE user_id = ?
           AND sensitivity != 'restricted'
           ${typeClause}
         ORDER BY updated_at DESC`
      )
      .all(grant.userId, ...types) as Record<string, unknown>[];

    return rows.map(rowToContextItem);
  }

  private countRestrictedItems(userId: string, contextTypes: string[]): number {
    const row = this.db
      .prepare(
        `SELECT count(*) AS count FROM context_items
         WHERE user_id = ?
           AND type IN (${contextTypes.map(() => "?").join(", ")})
           AND sensitivity = 'restricted'`
      )
      .get(userId, ...contextTypes) as { count: number };
    return Number(row.count);
  }

  private applyProjection(
    item: ContextItem,
    includeSources: boolean,
    includeConfidence: boolean
  ): ContextItem {
    return {
      ...item,
      source: includeSources
        ? item.source
        : {
            type: item.source.type,
            origin: "redacted",
            method: "redacted",
            capturedAt: item.source.capturedAt
          },
      confidence: includeConfidence ? item.confidence : 0
    };
  }
}
