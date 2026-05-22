import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { db } from "./db/knex";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { employeeRoutes } from "./routes/employeeRoutes";
import { insightsRoutes } from "./routes/insightsRoutes";

export const app = express();

app.use(
  cors({
    origin: env.corsOrigin
  })
);
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await db.raw("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "degraded", database: "disconnected" });
  }
});

app.use("/api/employees", employeeRoutes);
app.use("/api/insights", insightsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
