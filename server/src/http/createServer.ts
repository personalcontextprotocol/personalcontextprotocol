import Fastify from "fastify";
import type { ServerConfig } from "../config.js";
import { openDatabase } from "../db/client.js";
import { registerPcpRoute } from "./pcpRoute.js";

export function createServer(config: ServerConfig) {
  const db = openDatabase(config.databasePath);
  const app = Fastify({
    logger: true
  });

  app.get("/health", async () => ({
    ok: true,
    protocol: "pcp",
    version: "2026-06-24"
  }));

  registerPcpRoute(app, config, db);

  app.addHook("onClose", async () => {
    db.close();
  });

  return app;
}
