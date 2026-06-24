import { z } from "zod";

export const PermissionScopeSchema = z.enum([
  "context.read",
  "context.search",
  "memory.propose",
  "memory.write",
  "consent.read",
  "consent.revoke",
  "context.export"
]);

export type PermissionScope = z.infer<typeof PermissionScopeSchema>;
