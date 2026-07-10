import { z } from "zod";
import { ConsentGrantSchema } from "./consent-grant.js";
import { NonEmptyStringSchema } from "./common.js";
import { PermissionScopeSchema } from "./permission-scope.js";

export const ConsentAccessPolicySchema = z.object({
  mode: z.enum(["all", "selected_nodes"]),
  nodeIds: z.array(NonEmptyStringSchema).default([]),
  memoryReviewRequired: z.boolean().optional()
});

export const PcpAuthorizationRequestSchema = z.object({
  clientName: z.string().min(1).max(120),
  clientUri: z.string().url().optional(),
  redirectUri: z.string().url(),
  purpose: z.string().min(1).max(400),
  scopes: z.array(PermissionScopeSchema).min(1).max(12),
  state: z.string().max(500).optional(),
  codeChallenge: z.string().min(32).max(200),
  codeChallengeMethod: z.literal("S256")
});

export const PcpAuthorizationCodeExchangeSchema = z.object({
  code: z.string().min(20),
  codeVerifier: z.string().min(43).max(128)
});

export const PcpAuthorizationClientSchema = z.object({
  id: NonEmptyStringSchema,
  name: NonEmptyStringSchema,
  clientUri: z.string().url().optional()
});

export const PcpBindingEndpointSchema = z.object({
  endpoint: NonEmptyStringSchema,
  authorization: z.literal("Bearer <token>"),
  token: NonEmptyStringSchema.optional()
});

export const PcpAuthorizationBindingResultSchema = z.object({
  client: PcpAuthorizationClientSchema,
  grant: ConsentGrantSchema,
  pcp: PcpBindingEndpointSchema
});

export const PcpAuthorizationDiscoverySchema = z.object({
  appBinding: z.object({
    supported: z.literal(true),
    authorizeEndpoint: NonEmptyStringSchema.optional(),
    tokenEndpoint: NonEmptyStringSchema.optional(),
    grantManagementEndpoint: NonEmptyStringSchema.optional(),
    codeChallengeMethods: z.array(z.literal("S256")).default(["S256"])
  })
});

export type ConsentAccessPolicy = z.infer<typeof ConsentAccessPolicySchema>;
export type PcpAuthorizationRequest = z.infer<typeof PcpAuthorizationRequestSchema>;
export type PcpAuthorizationCodeExchange = z.infer<
  typeof PcpAuthorizationCodeExchangeSchema
>;
export type PcpAuthorizationBindingResult = z.infer<
  typeof PcpAuthorizationBindingResultSchema
>;
export type PcpAuthorizationDiscovery = z.infer<
  typeof PcpAuthorizationDiscoverySchema
>;
