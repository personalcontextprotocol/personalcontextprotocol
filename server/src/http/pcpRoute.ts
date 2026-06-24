import {
  errorResponse,
  JSON_RPC_ERROR_CODES,
  PCP_ERROR_CODES
} from "@pcp/protocol";
import type { FastifyInstance } from "fastify";
import type { ServerConfig } from "../config.js";
import type { PcpDatabase } from "../db/client.js";
import { AuditService } from "../services/auditService.js";
import { authenticateRequest } from "./auth.js";
import { isAllowedOrigin } from "./originGuard.js";
import { dispatchJsonRpc } from "../protocol/dispatcher.js";

export function registerPcpRoute(
  app: FastifyInstance,
  config: ServerConfig,
  db: PcpDatabase
): void {
  app.post("/pcp", async (request, reply) => {
    if (!isAllowedOrigin(request, config)) {
      new AuditService(db).write({
        userId: "unknown",
        action: "auth.denied",
        result: "denied",
        details: { reason: "origin_denied", origin: request.headers.origin }
      });
      return reply.code(403).send(
        errorResponse(null, JSON_RPC_ERROR_CODES.INVALID_REQUEST, "Origin is not allowed")
      );
    }

    const auth = authenticateRequest(request, config);
    if (!auth) {
      new AuditService(db).write({
        userId: "unknown",
        action: "auth.denied",
        result: "denied",
        details: { reason: "missing_or_invalid_bearer_token" }
      });
      return reply.code(401).send(
        errorResponse(
          null,
          PCP_ERROR_CODES.PCP_CONSENT_REQUIRED,
          "Authorization bearer token is required"
        )
      );
    }

    const response = await dispatchJsonRpc({ config, db, auth }, request.body);
    return reply.send(response);
  });
}
