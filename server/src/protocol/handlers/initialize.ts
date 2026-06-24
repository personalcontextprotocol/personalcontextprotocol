import {
  InitializeParamsSchema,
  PCP_PROTOCOL_VERSION,
  PCP_SERVER_INFO,
  PCP_SERVER_INSTRUCTIONS,
  type InitializeResult
} from "@pcp/protocol";
import type { PcpDatabase } from "../../db/client.js";
import { parseParams } from "../validation.js";

export function handleInitialize(db: PcpDatabase, params: unknown): InitializeResult {
  const parsed = parseParams(InitializeParamsSchema, params);
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO app_clients (id, name, version, description, type, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       name = excluded.name,
       version = excluded.version,
       description = excluded.description,
       type = excluded.type`
  ).run(
    parsed.clientInfo.id,
    parsed.clientInfo.name,
    parsed.clientInfo.version,
    parsed.clientInfo.description ?? null,
    parsed.clientInfo.type ?? "other",
    now
  );

  return {
    protocolVersion: PCP_PROTOCOL_VERSION,
    serverInfo: PCP_SERVER_INFO,
    capabilities: {
      context: { request: true, search: true },
      memory: { propose: true, create: true },
      consent: { list: true, revoke: true },
      export: { create: true },
      audit: { enabled: true }
    },
    instructions: PCP_SERVER_INSTRUCTIONS
  };
}
