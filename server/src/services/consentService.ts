import {
  PCP_ERROR_CODES,
  PcpError,
  type ConsentGrant,
  type PermissionScope
} from "@pcp/protocol";
import type { PcpDatabase } from "../db/client.js";
import { rowToConsentGrant } from "../db/client.js";

export class ConsentService {
  constructor(private readonly db: PcpDatabase) {}

  getGrant(id: string): ConsentGrant | undefined {
    const row = this.db
      .prepare("SELECT * FROM consent_grants WHERE id = ?")
      .get(id) as Record<string, unknown> | undefined;
    return row ? rowToConsentGrant(row) : undefined;
  }

  listForClient(clientId: string): ConsentGrant[] {
    return (
      this.db
        .prepare("SELECT * FROM consent_grants WHERE client_id = ? ORDER BY created_at DESC")
        .all(clientId) as Record<string, unknown>[]
    ).map(rowToConsentGrant);
  }

  requireClientScope(clientId: string, scope: PermissionScope): void {
    const grants = this.listForClient(clientId);
    const now = Date.now();
    const allowed = grants.some(
      (grant) =>
        grant.status === "active" &&
        (!grant.expiresAt || new Date(grant.expiresAt).getTime() > now) &&
        grant.scopes.includes(scope)
    );

    if (!allowed) {
      throw new PcpError(
        PCP_ERROR_CODES.PCP_SCOPE_DENIED,
        "Client does not have an active grant for this scope",
        { clientId, scope }
      );
    }
  }

  requireGrant(grantId: string, scope: PermissionScope): ConsentGrant {
    const grant = this.getGrant(grantId);
    if (!grant) {
      throw new PcpError(
        PCP_ERROR_CODES.PCP_CONSENT_REQUIRED,
        "Consent grant is missing or revoked",
        { grantId }
      );
    }

    if (grant.status === "revoked") {
      throw new PcpError(PCP_ERROR_CODES.PCP_GRANT_REVOKED, "Consent grant is revoked", {
        grantId
      });
    }

    if (grant.status === "expired") {
      throw new PcpError(PCP_ERROR_CODES.PCP_GRANT_EXPIRED, "Consent grant is expired", {
        grantId
      });
    }

    if (grant.expiresAt && new Date(grant.expiresAt).getTime() <= Date.now()) {
      this.markExpired(grant.id);
      throw new PcpError(PCP_ERROR_CODES.PCP_GRANT_EXPIRED, "Consent grant is expired", {
        grantId
      });
    }

    if (!grant.scopes.includes(scope)) {
      throw new PcpError(PCP_ERROR_CODES.PCP_SCOPE_DENIED, "Consent grant does not allow this scope", {
        grantId,
        scope
      });
    }

    return grant;
  }

  revoke(grantId: string): ConsentGrant {
    const grant = this.getGrant(grantId);
    if (!grant) {
      throw new PcpError(
        PCP_ERROR_CODES.PCP_CONSENT_REQUIRED,
        "Consent grant is missing or revoked",
        { grantId }
      );
    }

    const revokedAt = new Date().toISOString();
    this.db
      .prepare("UPDATE consent_grants SET status = ?, revoked_at = ? WHERE id = ?")
      .run("revoked", revokedAt, grantId);

    return {
      ...grant,
      status: "revoked",
      revokedAt
    };
  }

  private markExpired(grantId: string): void {
    this.db
      .prepare("UPDATE consent_grants SET status = ? WHERE id = ?")
      .run("expired", grantId);
  }
}
