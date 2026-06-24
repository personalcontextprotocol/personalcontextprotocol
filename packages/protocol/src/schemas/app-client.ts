import { z } from "zod";
import { DateTimeSchema } from "./common.js";

export const AppClientTypeSchema = z.enum([
  "local_cli",
  "ai_assistant",
  "ide_agent",
  "web_app",
  "desktop_app",
  "other"
]);

export const AppClientSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  description: z.string().optional(),
  type: AppClientTypeSchema.default("other"),
  createdAt: DateTimeSchema
});

export const AppClientInputSchema = AppClientSchema.omit({ createdAt: true }).extend({
  type: AppClientTypeSchema.default("other")
});

export type AppClient = z.infer<typeof AppClientSchema>;
export type AppClientInput = z.infer<typeof AppClientInputSchema>;
