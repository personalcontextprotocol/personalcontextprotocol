import type { FastifyRequest } from "fastify";
import type { ServerConfig } from "../config.js";

export function isAllowedOrigin(request: FastifyRequest, config: ServerConfig): boolean {
  const origin = request.headers.origin;
  if (!origin) {
    return true;
  }

  return config.allowedOrigins.includes(origin);
}
