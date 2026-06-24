import {
  errorResponse,
  JSON_RPC_ERROR_CODES,
  JsonRpcRequestSchema,
  PCP_METHODS,
  PcpError,
  successResponse,
  type JsonRpcResponse
} from "@pcp/protocol";
import type { ServerConfig } from "../config.js";
import type { PcpDatabase } from "../db/client.js";
import type { AuthContext } from "../http/auth.js";
import { AuditService } from "../services/auditService.js";
import { ConsentService } from "../services/consentService.js";
import { ContextService } from "../services/contextService.js";
import { ExportService } from "../services/exportService.js";
import { MemoryService } from "../services/memoryService.js";
import { handleConsentList } from "./handlers/consentList.js";
import { handleConsentRevoke } from "./handlers/consentRevoke.js";
import { handleContextRequest } from "./handlers/contextRequest.js";
import { handleContextSearch } from "./handlers/contextSearch.js";
import { handleExportCreate } from "./handlers/exportCreate.js";
import { handleInitialize } from "./handlers/initialize.js";
import { handleMemoryCreate } from "./handlers/memoryCreate.js";
import { handleMemoryPropose } from "./handlers/memoryPropose.js";

export type DispatchContext = {
  config: ServerConfig;
  db: PcpDatabase;
  auth: AuthContext;
};

export async function dispatchJsonRpc(
  context: DispatchContext,
  payload: unknown
): Promise<JsonRpcResponse> {
  const parsed = JsonRpcRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return errorResponse(
      null,
      JSON_RPC_ERROR_CODES.INVALID_REQUEST,
      "Invalid JSON-RPC request",
      parsed.error.flatten()
    );
  }

  const request = parsed.data;
  const consentService = new ConsentService(context.db);
  const contextService = new ContextService(context.db);
  const memoryService = new MemoryService(context.db);
  const auditService = new AuditService(context.db);
  const exportService = new ExportService();

  try {
    switch (request.method) {
      case PCP_METHODS.initialize:
        return successResponse(request.id, handleInitialize(context.db, request.params));
      case PCP_METHODS.contextRequest:
        return successResponse(
          request.id,
          handleContextRequest(consentService, contextService, auditService, request.params)
        );
      case PCP_METHODS.contextSearch:
        return successResponse(
          request.id,
          handleContextSearch(consentService, contextService, auditService, request.params)
        );
      case PCP_METHODS.memoryPropose:
        return successResponse(
          request.id,
          handleMemoryPropose(consentService, memoryService, auditService, request.params)
        );
      case PCP_METHODS.memoryCreate:
        return successResponse(
          request.id,
          handleMemoryCreate(
            context.auth,
            consentService,
            memoryService,
            auditService,
            request.params
          )
        );
      case PCP_METHODS.consentList:
        return successResponse(
          request.id,
          handleConsentList(context.config, consentService, auditService, request.params)
        );
      case PCP_METHODS.consentRevoke:
        return successResponse(
          request.id,
          handleConsentRevoke(consentService, auditService, request.params)
        );
      case PCP_METHODS.exportCreate:
        return successResponse(
          request.id,
          handleExportCreate(
            consentService,
            contextService,
            exportService,
            auditService,
            request.params
          )
        );
      default:
        return errorResponse(
          request.id,
          JSON_RPC_ERROR_CODES.METHOD_NOT_FOUND,
          `Method not found: ${request.method}`
        );
    }
  } catch (error) {
    if (error instanceof PcpError) {
      return errorResponse(request.id, error.code, error.message, error.data);
    }

    return errorResponse(
      request.id,
      JSON_RPC_ERROR_CODES.INTERNAL_ERROR,
      "Internal error",
      error instanceof Error ? { message: error.message } : undefined
    );
  }
}
