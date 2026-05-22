"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const knex_1 = require("./db/knex");
const errorHandler_1 = require("./middleware/errorHandler");
const employeeRoutes_1 = require("./routes/employeeRoutes");
const insightsRoutes_1 = require("./routes/insightsRoutes");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)({
    origin: env_1.env.corsOrigin
}));
exports.app.use(express_1.default.json());
exports.app.get("/health", async (_req, res) => {
    try {
        await knex_1.db.raw("SELECT 1");
        res.json({ status: "ok", database: "connected" });
    }
    catch {
        res.status(503).json({ status: "degraded", database: "disconnected" });
    }
});
exports.app.use("/api/employees", employeeRoutes_1.employeeRoutes);
exports.app.use("/api/insights", insightsRoutes_1.insightsRoutes);
exports.app.use(errorHandler_1.notFoundHandler);
exports.app.use(errorHandler_1.errorHandler);
