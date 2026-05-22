import dotenv from "dotenv";

dotenv.config();

const activeDatabaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.DATABASE_URL_TEST || process.env.DATABASE_URL
    : process.env.DATABASE_URL;

if (!activeDatabaseUrl) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? "3001"),
  databaseUrl: activeDatabaseUrl,
  testDatabaseUrl: process.env.DATABASE_URL_TEST,
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173"
};
