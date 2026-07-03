import { randomUUID } from "node:crypto";
import type { AuditAction, AuditListParams, AuditLog, AuditResult } from "@pcp/protocol";
import type { PcpDatabase } from "../db/client.js";
import { rowToAuditLog } from "../db/client.js";

export type AuditInput = {
  userId: string;
  clientId?: string;
  grantId?: string;
  action: AuditAction;
  scope?: string;
  resourceId?: string;
  result: AuditResult;
  details?: Record<string, unknown>;
};

export class AuditService {
  constructor(private readonly db: PcpDatabase) {}

  write(input: AuditInput): void {
    this.db
      .prepare(
        `INSERT INTO audit_logs
          (id, user_id, client_id, grant_id, action, scope, resource_id, timestamp, result, details_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        randomUUID(),
        input.userId,
        input.clientId ?? null,
        input.grantId ?? null,
        input.action,
        input.scope ?? null,
        input.resourceId ?? null,
        new Date().toISOString(),
        input.result,
        input.details ? JSON.stringify(input.details) : null
      );
  }

  list(userId: string, params: AuditListParams): { logs: AuditLog[]; total: number } {
    const filters = ["user_id = ?"];
    const values: (string | number)[] = [userId];

    if (params.clientId) {
      filters.push("client_id = ?");
      values.push(params.clientId);
    }

    if (params.resourceId) {
      filters.push("resource_id = ?");
      values.push(params.resourceId);
    }

    if (params.since) {
      filters.push("timestamp >= ?");
      values.push(params.since);
    }

    if (params.until) {
      filters.push("timestamp <= ?");
      values.push(params.until);
    }

    if (params.actions?.length) {
      filters.push(`action IN (${params.actions.map(() => "?").join(", ")})`);
      values.push(...params.actions);
    }

    if (params.results?.length) {
      filters.push(`result IN (${params.results.map(() => "?").join(", ")})`);
      values.push(...params.results);
    }

    const where = filters.join(" AND ");
    const total = this.db
      .prepare(`SELECT COUNT(*) AS count FROM audit_logs WHERE ${where}`)
      .get(...values) as { count: number };

    const rows = this.db
      .prepare(
        `SELECT * FROM audit_logs
         WHERE ${where}
         ORDER BY timestamp DESC
         LIMIT ?`
      )
      .all(...values, params.limit) as Record<string, unknown>[];

    return {
      logs: rows.map(rowToAuditLog),
      total: Number(total.count)
    };
  }
}
