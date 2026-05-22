import { app } from "./app";
import { env } from "./config/env";
import { db } from "./db/knex";

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend API running at http://localhost:${env.port}`);
});

const shutdown = async () => {
  server.close(async () => {
    await db.destroy();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
