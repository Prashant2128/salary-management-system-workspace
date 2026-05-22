"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const knex_1 = require("../src/db/knex");
const testDb_1 = require("./testDb");
(0, vitest_1.afterAll)(async () => {
    if (knex_1.db !== testDb_1.testDb) {
        await knex_1.db.destroy();
    }
    await testDb_1.testDb.destroy();
});
