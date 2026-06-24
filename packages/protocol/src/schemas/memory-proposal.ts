import { z } from "zod";
import { DateTimeSchema } from "./common.js";
import { NewContextItemSchema } from "./context-item.js";

export const MemoryProposalStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "accepted_with_edits",
  "expired"
]);

export const MemoryProposalSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  clientId: z.string().min(1),
  grantId: z.string().min(1),
  proposedItem: NewContextItemSchema,
  reason: z.string().min(1),
  status: MemoryProposalStatusSchema,
  createdAt: DateTimeSchema,
  resolvedAt: DateTimeSchema.optional()
});

export type MemoryProposal = z.infer<typeof MemoryProposalSchema>;
