"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearEmployees = exports.migrateTestDb = exports.testDb = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const knex_1 = __importDefault(require("knex"));
dotenv_1.default.config();
const testDatabaseUrl = process.env.DATABASE_URL_TEST || process.env.DATABASE_URL;
if (!testDatabaseUrl) {
    throw new Error("DATABASE_URL_TEST or DATABASE_URL must be configured for tests.");
}
exports.testDb = (0, knex_1.default)({
    client: "pg",
    connection: testDatabaseUrl
});
const migrateTestDb = async () => {
    await exports.testDb.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await exports.testDb.migrate.latest({
        directory: "./migrations"
    });
};
exports.migrateTestDb = migrateTestDb;
const clearEmployees = async () => {
    await (0, exports.testDb)("employees").del();
};
exports.clearEmployees = clearEmployees;
