import { z } from "zod";
import { DateTimeSchema } from "./common.js";
import { PermissionScopeSchema } from "./permission-scope.js";

export const ConsentGrantStatusSchema = z.enum(["active", "revoked", "expired"]);

export const ConsentGrantSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  clientId: z.string().min(1),
  scopes: z.array(PermissionScopeSchema).min(1),
  purpose: z.string().min(1),
  status: ConsentGrantStatusSchema,
  createdAt: DateTimeSchema,
  expiresAt: DateTimeSchema.optional(),
  revokedAt: DateTimeSchema.optional()
});

export type ConsentGrant = z.infer<typeof ConsentGrantSchema>;
export type ConsentGrantStatus = z.infer<typeof ConsentGrantStatusSchema>;
