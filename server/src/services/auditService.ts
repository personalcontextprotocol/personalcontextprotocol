import { randomUUID } from "node:crypto";
import type { AuditAction, AuditResult } from "@pcp/protocol";
import type { PcpDatabase } from "../db/client.js";

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
}
