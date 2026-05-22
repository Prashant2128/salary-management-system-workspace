import { afterAll } from "vitest";
import { db } from "../src/db/knex";
import { testDb } from "./testDb";

afterAll(async () => {
  if (db !== testDb) {
    await db.destroy();
  }
  await testDb.destroy();
});
