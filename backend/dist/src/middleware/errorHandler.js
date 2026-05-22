"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const zod_1 = require("zod");
const env_1 = require("../config/env");
const appError_1 = require("../errors/appError");
const mapDatabaseError_1 = require("../utils/mapDatabaseError");
const notFoundHandler = (_req, res) => {
    res.status(404).json({
        error: {
            message: "Resource not found",
            code: "NOT_FOUND"
        }
    });
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (error, _req, res, _next) => {
    if (error instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: {
                message: error.issues.map((issue) => issue.message).join(", "),
                code: "VALIDATION_ERROR"
            }
        });
    }
    if (error instanceof appError_1.AppError) {
        return res.status(error.statusCode).json({
            error: {
                message: error.message,
                code: error.code
            }
        });
    }
    const mapped = (0, mapDatabaseError_1.mapDatabaseError)(error);
    if (mapped) {
        return res.status(mapped.statusCode).json({
            error: {
                message: mapped.message,
                code: mapped.code
            }
        });
    }
    if (env_1.env.nodeEnv !== "test") {
        // eslint-disable-next-line no-console
        console.error(error);
    }
    return res.status(500).json({
        error: {
            message: "Unexpected server error",
            code: "INTERNAL_SERVER_ERROR"
        }
    });
};
exports.errorHandler = errorHandler;
