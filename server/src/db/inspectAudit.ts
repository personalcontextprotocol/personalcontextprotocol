import { loadConfig } from "../config.js";
import { openDatabase, rowToAuditLog } from "./client.js";

function parseLimit(value: string | undefined): number {
  if (!value) {
    return 20;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 500) {
    throw new Error("Audit limit must be an integer between 1 and 500.");
  }

  return parsed;
}

export function inspectAuditLogs(databasePath = loadConfig().databasePath, limit = 20): void {
  const db = openDatabase(databasePath);

  const rows = db
    .prepare(
      `SELECT *
       FROM audit_logs
       ORDER BY timestamp DESC
       LIMIT ?`
    )
    .all(limit) as Record<string, unknown>[];

  db.close();
  console.log(JSON.stringify(rows.map(rowToAuditLog), null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  inspectAuditLogs(loadConfig().databasePath, parseLimit(process.argv[2]));
}
