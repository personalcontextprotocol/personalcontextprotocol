import { z } from "zod";
import { PCP_DEFAULTS } from "../constants.js";
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
  maxItems: z.number().int().min(1).max(100).default(PCP_DEFAULTS.contextRequestMaxItems),
  freshnessPreference: FreshnessPreferenceSchema.default(
    PCP_DEFAULTS.contextRequestFreshnessPreference
  ),
  includeSources: z.boolean().default(PCP_DEFAULTS.contextRequestIncludeSources),
  includeConfidence: z.boolean().default(PCP_DEFAULTS.contextRequestIncludeConfidence)
});

export const ContextRequestResultSchema = z.object({
  contextPack: ContextPackSchema
});

export const ContextSearchParamsSchema = z.object({
  grantId: z.string().min(1),
  query: z.string().min(1),
  contextTypes: z.array(ContextTypeSchema).optional(),
  limit: z.number().int().min(1).max(100).default(PCP_DEFAULTS.contextSearchLimit)
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
  format: z.literal(PCP_DEFAULTS.exportFormat).default(PCP_DEFAULTS.exportFormat),
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
export type ContextRequestResult = z.infer<typeof ContextRequestResultSchema>;
export type ContextSearchParams = z.infer<typeof ContextSearchParamsSchema>;
export type ContextSearchResult = z.infer<typeof ContextSearchResultSchema>;
export type MemoryProposeParams = z.infer<typeof MemoryProposeParamsSchema>;
export type MemoryProposeResult = z.infer<typeof MemoryProposeResultSchema>;
export type MemoryCreateParams = z.infer<typeof MemoryCreateParamsSchema>;
export type MemoryCreateResult = z.infer<typeof MemoryCreateResultSchema>;
export type ConsentListParams = z.infer<typeof ConsentListParamsSchema>;
export type ConsentListResult = z.infer<typeof ConsentListResultSchema>;
export type ConsentRevokeParams = z.infer<typeof ConsentRevokeParamsSchema>;
export type ConsentRevokeResult = z.infer<typeof ConsentRevokeResultSchema>;
export type ExportCreateParams = z.infer<typeof ExportCreateParamsSchema>;
export type ExportCreateResult = z.infer<typeof ExportCreateResultSchema>;
