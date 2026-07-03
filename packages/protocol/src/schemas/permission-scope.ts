import { z } from "zod";

export const PermissionScopeSchema = z.enum([
  "context.read",
  "context.search",
  "context.sync",
  "context.audit.read",
  "memory.propose",
  "memory.write",
  "consent.read",
  "consent.revoke",
  "grants.manage",
  "context.export"
]);

export type PermissionScope = z.infer<typeof PermissionScopeSchema>;
