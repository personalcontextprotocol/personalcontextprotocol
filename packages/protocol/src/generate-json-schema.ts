import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { JsonRpcRequestSchema, JsonRpcResponseSchema } from "./jsonrpc.js";
import { AppClientSchema } from "./schemas/app-client.js";
import { AuditLogSchema } from "./schemas/audit-log.js";
import { ConsentGrantSchema } from "./schemas/consent-grant.js";
import { ContextItemSchema } from "./schemas/context-item.js";
import { ContextPackSchema } from "./schemas/context-pack.js";
import {
  InitializeParamsSchema,
  InitializeResultSchema
} from "./schemas/initialize.js";
import { MemoryProposalSchema } from "./schemas/memory-proposal.js";
import {
  ConsentListParamsSchema,
  ConsentListResultSchema,
  ConsentRevokeParamsSchema,
  ConsentRevokeResultSchema,
  ContextRequestParamsSchema,
  ContextRequestResultSchema,
  ContextSearchParamsSchema,
  ContextSearchResultSchema,
  ExportCreateParamsSchema,
  ExportCreateResultSchema,
  MemoryCreateParamsSchema,
  MemoryCreateResultSchema,
  MemoryProposeParamsSchema,
  MemoryProposeResultSchema
} from "./schemas/methods.js";

const PcpV01Schema = z.object({
  jsonRpcRequest: JsonRpcRequestSchema,
  jsonRpcResponse: JsonRpcResponseSchema,
  objects: z.object({
    appClient: AppClientSchema,
    consentGrant: ConsentGrantSchema,
    contextItem: ContextItemSchema,
    contextPack: ContextPackSchema,
    memoryProposal: MemoryProposalSchema,
    auditLog: AuditLogSchema
  }),
  methods: z.object({
    initialize: z.object({
      params: InitializeParamsSchema,
      result: InitializeResultSchema
    }),
    contextRequest: z.object({
      params: ContextRequestParamsSchema,
      result: ContextRequestResultSchema
    }),
    contextSearch: z.object({
      params: ContextSearchParamsSchema,
      result: ContextSearchResultSchema
    }),
    memoryPropose: z.object({
      params: MemoryProposeParamsSchema,
      result: MemoryProposeResultSchema
    }),
    memoryCreate: z.object({
      params: MemoryCreateParamsSchema,
      result: MemoryCreateResultSchema
    }),
    consentList: z.object({
      params: ConsentListParamsSchema,
      result: ConsentListResultSchema
    }),
    consentRevoke: z.object({
      params: ConsentRevokeParamsSchema,
      result: ConsentRevokeResultSchema
    }),
    exportCreate: z.object({
      params: ExportCreateParamsSchema,
      result: ExportCreateResultSchema
    })
  })
});

const outputPath = resolve("schemas/pcp-v0.1.schema.json");
const jsonSchema = zodToJsonSchema(PcpV01Schema, {
  name: "PcpV01",
  target: "jsonSchema7"
});

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(jsonSchema, null, 2)}\n`);
