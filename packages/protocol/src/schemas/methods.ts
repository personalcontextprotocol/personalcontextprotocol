import { z } from "zod";
import {
  ContextItemSchema,
  ContextTypeSchema,
  NewContextItemSchema
} from "./context-item.js";
import { ContextPackSchema } from "./context-pack.js";
import { ConsentGrantSchema } from "./consent-grant.js";
import { MemoryProposalSchema } from "./memory-proposal.js";

export const FreshnessPreferenceSchema = z.enum([
  "recent_first",
  "verified_first",
  "any"
]);

export const ContextRequestParamsSchema = z.object({
  grantId: z.string().min(1),
  purpose: z.string().min(1),
  task: z.string().min(1),
  contextTypes: z.array(ContextTypeSchema).min(1),
  maxItems: z.number().int().min(1).max(100).default(20),
  freshnessPreference: FreshnessPreferenceSchema.default("recent_first"),
  includeSources: z.boolean().default(true),
  includeConfidence: z.boolean().default(true)
});

export const ContextRequestResultSchema = z.object({
  contextPack: ContextPackSchema
});

export const ContextSearchParamsSchema = z.object({
  grantId: z.string().min(1),
  query: z.string().min(1),
  contextTypes: z.array(ContextTypeSchema).optional(),
  limit: z.number().int().min(1).max(100).default(10)
});

export const ContextSearchResultSchema = z.object({
  items: z.array(ContextItemSchema),
  total: z.number().int().min(0)
});

export const MemoryProposeParamsSchema = z.object({
  grantId: z.string().min(1),
  proposedItem: NewContextItemSchema,
  reason: z.string().min(1)
});

export const MemoryProposeResultSchema = z.object({
  proposal: MemoryProposalSchema.pick({
    id: true,
    status: true,
    createdAt: true
  })
});

export const MemoryCreateParamsSchema = z.object({
  grantId: z.string().min(1),
  item: NewContextItemSchema
});

export const MemoryCreateResultSchema = z.object({
  item: ContextItemSchema
});

export const ConsentListParamsSchema = z.object({
  clientId: z.string().min(1).optional()
});

export const ConsentListResultSchema = z.object({
  grants: z.array(ConsentGrantSchema)
});

export const ConsentRevokeParamsSchema = z.object({
  grantId: z.string().min(1)
});

export const ConsentRevokeResultSchema = z.object({
  grant: ConsentGrantSchema
});

export const ExportCreateParamsSchema = z.object({
  grantId: z.string().min(1),
  format: z.literal("json").default("json"),
  contextTypes: z.array(ContextTypeSchema).optional()
});

export const ExportCreateResultSchema = z.object({
  export: z.object({
    id: z.string().min(1),
    format: z.literal("json"),
    createdAt: z.string().datetime({ offset: true }),
    itemCount: z.number().int().min(0),
    data: z.object({
      contextItems: z.array(ContextItemSchema)
    })
  })
});

export type ContextRequestParams = z.infer<typeof ContextRequestParamsSchema>;
export type ContextSearchParams = z.infer<typeof ContextSearchParamsSchema>;
export type MemoryProposeParams = z.infer<typeof MemoryProposeParamsSchema>;
export type MemoryCreateParams = z.infer<typeof MemoryCreateParamsSchema>;
export type ConsentListParams = z.infer<typeof ConsentListParamsSchema>;
export type ConsentRevokeParams = z.infer<typeof ConsentRevokeParamsSchema>;
export type ExportCreateParams = z.infer<typeof ExportCreateParamsSchema>;
