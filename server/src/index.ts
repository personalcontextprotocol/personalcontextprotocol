import { loadConfig } from "./config.js";
import { createServer } from "./http/createServer.js";

const config = loadConfig();
const app = createServer(config);

try {
  await app.listen({ host: config.host, port: config.port });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
