export type ServerConfig = {
  host: string;
  port: number;
  demoToken: string;
  databasePath: string;
  allowedOrigins: string[];
  defaultClientId: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  return {
    host: env.PCP_HOST ?? "127.0.0.1",
    port: Number(env.PCP_PORT ?? 8787),
    demoToken: env.PCP_DEMO_TOKEN ?? "pcp_demo_token",
    databasePath: env.PCP_DATABASE_PATH ?? ".pcp/pcp.sqlite",
    allowedOrigins: (env.PCP_ALLOWED_ORIGINS ?? "http://127.0.0.1:8787,http://localhost:8787")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    defaultClientId: env.PCP_DEFAULT_CLIENT_ID ?? "codex-local"
  };
}
