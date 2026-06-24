import { z } from "zod";
import { DateTimeSchema, TagsSchema } from "./common.js";

export const ContextTypeSchema = z.enum([
  "UserProfile",
  "Preference",
  "Project",
  "Goal",
  "MemoryItem",
  "DecisionHistory",
  "CommunicationStyle"
]);

export const SourceTypeSchema = z.enum([
  "manual_user_entry",
  "imported",
  "client_proposal",
  "model_inference",
  "system_seed"
]);

export const SensitivitySchema = z.enum(["low", "medium", "high", "restricted"]);

export const FreshnessStatusSchema = z.enum(["fresh", "aging", "stale", "unknown"]);

export const ContextSourceSchema = z.object({
  type: SourceTypeSchema,
  origin: z.string().min(1),
  method: z.string().min(1),
  capturedAt: DateTimeSchema,
  reference: z.string().optional()
});

export const ContextFreshnessSchema = z.object({
  lastVerifiedAt: DateTimeSchema.optional(),
  expiresAt: DateTimeSchema.optional(),
  status: FreshnessStatusSchema
});

export const ContextContentSchema = z.object({
  text: z.string().min(1),
  data: z.unknown().optional()
});

export const ContextItemSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  type: ContextTypeSchema,
  content: ContextContentSchema,
  tags: TagsSchema,
  source: ContextSourceSchema,
  confidence: z.number().min(0).max(1),
  freshness: ContextFreshnessSchema,
  sensitivity: SensitivitySchema,
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema
});

export const NewContextItemSchema = ContextItemSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
});

export type ContextType = z.infer<typeof ContextTypeSchema>;
export type ContextItem = z.infer<typeof ContextItemSchema>;
export type NewContextItem = z.infer<typeof NewContextItemSchema>;
export type Sensitivity = z.infer<typeof SensitivitySchema>;
