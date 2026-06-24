import type { FastifyRequest } from "fastify";
import type { ServerConfig } from "../config.js";

export type AuthContext = {
  token: string;
  isDemoAdmin: boolean;
};

export function authenticateRequest(
  request: FastifyRequest,
  config: ServerConfig
): AuthContext | undefined {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return undefined;
  }

  const token = header.slice("Bearer ".length).trim();
  if (token !== config.demoToken) {
    return undefined;
  }

  return {
    token,
    isDemoAdmin: token === config.demoToken
  };
}
