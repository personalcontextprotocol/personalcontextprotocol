import { z } from "zod";
import { DateTimeSchema } from "./common.js";
import { ContextItemSchema } from "./context-item.js";

export const ContextPackSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  clientId: z.string().min(1),
  grantId: z.string().min(1),
  purpose: z.string().min(1),
  generatedAt: DateTimeSchema,
  expiresAt: DateTimeSchema.optional(),
  items: z.array(ContextItemSchema),
  warnings: z.array(z.string()),
  limits: z.object({
    maxItems: z.number().int().positive(),
    sensitiveItemsExcluded: z.number().int().min(0)
  })
});

export type ContextPack = z.infer<typeof ContextPackSchema>;
