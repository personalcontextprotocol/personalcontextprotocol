import { z } from "zod";
import { PCP_METHODS } from "./constants.js";
import {
  InitializeParamsSchema,
  InitializeResultSchema
} from "./schemas/initialize.js";
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
import type {
  ConsentListParams,
  ConsentListResult,
  ConsentRevokeParams,
  ConsentRevokeResult,
  ContextRequestParams,
  ContextRequestResult,
  ContextSearchParams,
  ContextSearchResult,
  ExportCreateParams,
  ExportCreateResult,
  InitializeParams,
  InitializeResult,
  MemoryCreateParams,
  MemoryCreateResult,
  MemoryProposeParams,
  MemoryProposeResult
} from "./schemas/types.js";

export type PcpMethodDefinition<
  TParamsSchema extends z.ZodTypeAny,
  TResultSchema extends z.ZodTypeAny
> = {
  method: string;
  paramsSchema: TParamsSchema;
  resultSchema: TResultSchema;
};

export const PCP_METHOD_REGISTRY = {
  [PCP_METHODS.initialize]: {
    method: PCP_METHODS.initialize,
    paramsSchema: InitializeParamsSchema,
    resultSchema: InitializeResultSchema
  },
  [PCP_METHODS.contextRequest]: {
    method: PCP_METHODS.contextRequest,
    paramsSchema: ContextRequestParamsSchema,
    resultSchema: ContextRequestResultSchema
  },
  [PCP_METHODS.contextSearch]: {
    method: PCP_METHODS.contextSearch,
    paramsSchema: ContextSearchParamsSchema,
    resultSchema: ContextSearchResultSchema
  },
  [PCP_METHODS.memoryPropose]: {
    method: PCP_METHODS.memoryPropose,
    paramsSchema: MemoryProposeParamsSchema,
    resultSchema: MemoryProposeResultSchema
  },
  [PCP_METHODS.memoryCreate]: {
    method: PCP_METHODS.memoryCreate,
    paramsSchema: MemoryCreateParamsSchema,
    resultSchema: MemoryCreateResultSchema
  },
  [PCP_METHODS.consentList]: {
    method: PCP_METHODS.consentList,
    paramsSchema: ConsentListParamsSchema,
    resultSchema: ConsentListResultSchema
  },
  [PCP_METHODS.consentRevoke]: {
    method: PCP_METHODS.consentRevoke,
    paramsSchema: ConsentRevokeParamsSchema,
    resultSchema: ConsentRevokeResultSchema
  },
  [PCP_METHODS.exportCreate]: {
    method: PCP_METHODS.exportCreate,
    paramsSchema: ExportCreateParamsSchema,
    resultSchema: ExportCreateResultSchema
  }
} as const;

export type PcpMethodSpec = {
  [PCP_METHODS.initialize]: {
    params: InitializeParams;
    result: InitializeResult;
  };
  [PCP_METHODS.contextRequest]: {
    params: ContextRequestParams;
    result: ContextRequestResult;
  };
  [PCP_METHODS.contextSearch]: {
    params: ContextSearchParams;
    result: ContextSearchResult;
  };
  [PCP_METHODS.memoryPropose]: {
    params: MemoryProposeParams;
    result: MemoryProposeResult;
  };
  [PCP_METHODS.memoryCreate]: {
    params: MemoryCreateParams;
    result: MemoryCreateResult;
  };
  [PCP_METHODS.consentList]: {
    params: ConsentListParams;
    result: ConsentListResult;
  };
  [PCP_METHODS.consentRevoke]: {
    params: ConsentRevokeParams;
    result: ConsentRevokeResult;
  };
  [PCP_METHODS.exportCreate]: {
    params: ExportCreateParams;
    result: ExportCreateResult;
  };
};
