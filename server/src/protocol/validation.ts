import { JSON_RPC_ERROR_CODES, PcpError } from "@pcp/protocol";
import { z } from "zod";

export function parseParams<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  params: unknown
): z.output<TSchema> {
  const parsed = schema.safeParse(params ?? {});
  if (!parsed.success) {
    throw new PcpError(
      JSON_RPC_ERROR_CODES.INVALID_PARAMS,
      "Invalid params",
      parsed.error.flatten()
    );
  }

  return parsed.data;
}
