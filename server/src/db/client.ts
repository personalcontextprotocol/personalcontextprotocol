import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import type {
  AppClient,
  AuditLog,
  ConsentGrant,
  ContextItem,
  MemoryProposal
} from "@pcp/protocol";
import { createSchemaSql } from "./schema.js";

export type PcpDatabase = DatabaseSync;

export function openDatabase(path: string): PcpDatabase {
  mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec(createSchemaSql);
  return db;
}

export function rowToAppClient(row: Record<string, unknown>): AppClient {
  return {
    id: String(row.id),
    name: String(row.name),
    version: String(row.version),
    description: row.description ? String(row.description) : undefined,
    type: row.type as AppClient["type"],
    createdAt: String(row.created_at)
  };
}

export function rowToConsentGrant(row: Record<string, unknown>): ConsentGrant {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    clientId: String(row.client_id),
    scopes: JSON.parse(String(row.scopes_json)),
    purpose: String(row.purpose),
    status: row.status as ConsentGrant["status"],
    createdAt: String(row.created_at),
    expiresAt: row.expires_at ? String(row.expires_at) : undefined,
    revokedAt: row.revoked_at ? String(row.revoked_at) : undefined
  };
}

export function rowToContextItem(row: Record<string, unknown>): ContextItem {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    type: row.type as ContextItem["type"],
    content: JSON.parse(String(row.content_json)),
    tags: JSON.parse(String(row.tags_json)),
    source: JSON.parse(String(row.source_json)),
    confidence: Number(row.confidence),
    freshness: JSON.parse(String(row.freshness_json)),
    sensitivity: row.sensitivity as ContextItem["sensitivity"],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

export function rowToMemoryProposal(row: Record<string, unknown>): MemoryProposal {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    clientId: String(row.client_id),
    grantId: String(row.grant_id),
    proposedItem: JSON.parse(String(row.proposed_item_json)),
    reason: String(row.reason),
    status: row.status as MemoryProposal["status"],
    createdAt: String(row.created_at),
    resolvedAt: row.resolved_at ? String(row.resolved_at) : undefined
  };
}

export function rowToAuditLog(row: Record<string, unknown>): AuditLog {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    clientId: row.client_id ? String(row.client_id) : undefined,
    grantId: row.grant_id ? String(row.grant_id) : undefined,
    action: row.action as AuditLog["action"],
    scope: row.scope ? String(row.scope) : undefined,
    resourceId: row.resource_id ? String(row.resource_id) : undefined,
    timestamp: String(row.timestamp),
    result: row.result as AuditLog["result"],
    details: row.details_json ? JSON.parse(String(row.details_json)) : undefined
  };
}
