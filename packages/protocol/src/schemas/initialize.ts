import { z } from "zod";
import {
  PCP_PROTOCOL_VERSION,
  PCP_SERVER_INFO,
  PCP_SERVER_INSTRUCTIONS
} from "../constants.js";
import { AppClientInputSchema } from "./app-client.js";

export const ClientCapabilitiesSchema = z
  .object({
    context: z.record(z.unknown()).optional(),
    memory: z
      .object({
        propose: z.boolean().optional(),
        create: z.boolean().optional()
      })
      .optional(),
    consent: z.record(z.unknown()).optional(),
    export: z.record(z.unknown()).optional()
  })
  .default({});

export const ServerCapabilitiesSchema = z.object({
  context: z.object({
    request: z.literal(true),
    search: z.literal(true)
  }),
  memory: z.object({
    propose: z.literal(true),
    create: z.literal(true)
  }),
  consent: z.object({
    list: z.literal(true),
    revoke: z.literal(true)
  }),
  export: z.object({
    create: z.literal(true)
  }),
  audit: z.object({
    enabled: z.literal(true)
  })
});

export const InitializeParamsSchema = z.object({
  protocolVersion: z.literal(PCP_PROTOCOL_VERSION),
  clientInfo: AppClientInputSchema,
  capabilities: ClientCapabilitiesSchema
});

export const InitializeResultSchema = z.object({
  protocolVersion: z.literal(PCP_PROTOCOL_VERSION),
  serverInfo: z.object({
    name: z.literal(PCP_SERVER_INFO.name),
    version: z.literal(PCP_SERVER_INFO.version),
    description: z.literal(PCP_SERVER_INFO.description)
  }),
  capabilities: ServerCapabilitiesSchema,
  instructions: z.literal(PCP_SERVER_INSTRUCTIONS)
});

export type InitializeParams = z.infer<typeof InitializeParamsSchema>;
export type InitializeResult = z.infer<typeof InitializeResultSchema>;
