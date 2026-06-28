import { z } from "zod";
import { JSON_RPC_VERSION } from "./constants.js";

export const JsonRpcIdSchema = z.union([z.string(), z.number(), z.null()]);
export const JsonRpcResultSchema = z
  .unknown()
  .refine((value) => value !== undefined, "JSON-RPC success responses require result");

export const JsonRpcRequestSchema = z.object({
  jsonrpc: z.literal(JSON_RPC_VERSION),
  id: JsonRpcIdSchema,
  method: z.string().min(1),
  params: z.unknown().optional()
});

export const JsonRpcSuccessResponseSchema = z.object({
  jsonrpc: z.literal(JSON_RPC_VERSION),
  id: JsonRpcIdSchema,
  result: JsonRpcResultSchema
});

export const JsonRpcErrorObjectSchema = z.object({
  code: z.number().int(),
  message: z.string(),
  data: z.unknown().optional()
});

export const JsonRpcErrorResponseSchema = z.object({
  jsonrpc: z.literal(JSON_RPC_VERSION),
  id: JsonRpcIdSchema,
  error: JsonRpcErrorObjectSchema
});

export const JsonRpcResponseSchema = z.union([
  JsonRpcSuccessResponseSchema,
  JsonRpcErrorResponseSchema
]);

export type JsonRpcId = z.infer<typeof JsonRpcIdSchema>;
export type JsonRpcRequest = {
  jsonrpc: typeof JSON_RPC_VERSION;
  id: JsonRpcId;
  method: string;
  params?: unknown;
};
export type JsonRpcErrorObject = {
  code: number;
  message: string;
  data?: unknown;
};
export type JsonRpcSuccessResponse = {
  jsonrpc: typeof JSON_RPC_VERSION;
  id: JsonRpcId;
  result: unknown;
};
export type JsonRpcErrorResponse = {
  jsonrpc: typeof JSON_RPC_VERSION;
  id: JsonRpcId;
  error: JsonRpcErrorObject;
};
export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse;

export function successResponse(
  id: JsonRpcId,
  result: unknown
): JsonRpcSuccessResponse {
  return { jsonrpc: JSON_RPC_VERSION, id, result };
}

export function errorResponse(
  id: JsonRpcId,
  code: number,
  message: string,
  data?: unknown
): JsonRpcErrorResponse {
  return {
    jsonrpc: JSON_RPC_VERSION,
    id,
    error: data === undefined ? { code, message } : { code, message, data }
  };
}
