import dotenv from "dotenv";
import knex from "knex";

dotenv.config();

const testDatabaseUrl = process.env.DATABASE_URL_TEST || process.env.DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error("DATABASE_URL_TEST or DATABASE_URL must be configured for tests.");
}

export const testDb = knex({
  client: "pg",
  connection: testDatabaseUrl
});

export const migrateTestDb = async () => {
  await testDb.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
  await testDb.migrate.latest({
    directory: "./migrations"
  });
};

export const clearEmployees = async () => {
  await testDb("employees").del();
};
