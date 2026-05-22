"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const knex_1 = require("./db/knex");
const server = app_1.app.listen(env_1.env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend API running at http://localhost:${env_1.env.port}`);
});
const shutdown = async () => {
    server.close(async () => {
        await knex_1.db.destroy();
        process.exit(0);
    });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
