import { z } from "zod";
import { DateTimeSchema } from "./common.js";

export const AuditActionSchema = z.enum([
  "context.requested",
  "context.returned",
  "context.searched",
  "memory.proposed",
  "memory.created",
  "memory.deleted",
  "consent.listed",
  "consent.revoked",
  "audit.listed",
  "export.created",
  "auth.denied"
]);

export const AuditResultSchema = z.enum(["success", "denied", "error"]);

export const AuditLogSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  clientId: z.string().optional(),
  grantId: z.string().optional(),
  action: AuditActionSchema,
  scope: z.string().optional(),
  resourceId: z.string().optional(),
  timestamp: DateTimeSchema,
  result: AuditResultSchema,
  details: z.record(z.unknown()).optional()
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AuditAction = z.infer<typeof AuditActionSchema>;
export type AuditResult = z.infer<typeof AuditResultSchema>;
