export const createSchemaSql = `
CREATE TABLE IF NOT EXISTS app_clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS consent_grants (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT,
  revoked_at TEXT,
  FOREIGN KEY (client_id) REFERENCES app_clients(id)
);

CREATE INDEX IF NOT EXISTS idx_consent_grants_client_id ON consent_grants(client_id);

CREATE TABLE IF NOT EXISTS context_items (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  content_json TEXT NOT NULL,
  tags_json TEXT NOT NULL,
  source_json TEXT NOT NULL,
  confidence REAL NOT NULL,
  freshness_json TEXT NOT NULL,
  sensitivity TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_context_items_user_type ON context_items(user_id, type);
CREATE INDEX IF NOT EXISTS idx_context_items_updated ON context_items(updated_at);

CREATE TABLE IF NOT EXISTS memory_proposals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  client_id TEXT NOT NULL,
  grant_id TEXT NOT NULL,
  proposed_item_json TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  resolved_at TEXT,
  FOREIGN KEY (grant_id) REFERENCES consent_grants(id)
);

CREATE INDEX IF NOT EXISTS idx_memory_proposals_grant_id ON memory_proposals(grant_id);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  client_id TEXT,
  grant_id TEXT,
  action TEXT NOT NULL,
  scope TEXT,
  resource_id TEXT,
  timestamp TEXT NOT NULL,
  result TEXT NOT NULL,
  details_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_timestamp ON audit_logs(user_id, timestamp);
`;
