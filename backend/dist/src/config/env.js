"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const activeDatabaseUrl = process.env.NODE_ENV === "test"
    ? process.env.DATABASE_URL_TEST || process.env.DATABASE_URL
    : process.env.DATABASE_URL;
if (!activeDatabaseUrl) {
    throw new Error("Missing required environment variable: DATABASE_URL");
}
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: Number(process.env.PORT ?? "3001"),
    databaseUrl: activeDatabaseUrl,
    testDatabaseUrl: process.env.DATABASE_URL_TEST,
    corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173"
};
