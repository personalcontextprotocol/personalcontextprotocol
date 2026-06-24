import { loadConfig } from "../config.js";
import { openDatabase } from "./client.js";
import { demoClient, demoContextItems, demoGrant } from "../demo/seedContext.js";

export function seedDatabase(databasePath = loadConfig().databasePath): void {
  const db = openDatabase(databasePath);

  const insertClient = db.prepare(`
    INSERT OR REPLACE INTO app_clients
      (id, name, version, description, type, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertClient.run(
    demoClient.id,
    demoClient.name,
    demoClient.version,
    demoClient.description ?? null,
    demoClient.type,
    demoClient.createdAt
  );

  const insertGrant = db.prepare(`
    INSERT OR REPLACE INTO consent_grants
      (id, user_id, client_id, scopes_json, purpose, status, created_at, expires_at, revoked_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertGrant.run(
    demoGrant.id,
    demoGrant.userId,
    demoGrant.clientId,
    JSON.stringify(demoGrant.scopes),
    demoGrant.purpose,
    demoGrant.status,
    demoGrant.createdAt,
    demoGrant.expiresAt ?? null,
    demoGrant.revokedAt ?? null
  );

  const insertContext = db.prepare(`
    INSERT OR REPLACE INTO context_items
      (id, user_id, type, content_json, tags_json, source_json, confidence, freshness_json, sensitivity, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of demoContextItems) {
    insertContext.run(
      item.id,
      item.userId,
      item.type,
      JSON.stringify(item.content),
      JSON.stringify(item.tags),
      JSON.stringify(item.source),
      item.confidence,
      JSON.stringify(item.freshness),
      item.sensitivity,
      item.createdAt,
      item.updatedAt
    );
  }

  db.close();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
  console.log("Seeded PCP demo database.");
}
