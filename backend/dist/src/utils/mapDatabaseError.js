"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDatabaseError = void 0;
const appError_1 = require("../errors/appError");
const mapDatabaseError = (error) => {
    const pgError = error;
    if (pgError.code === "23505") {
        if (pgError.constraint?.includes("email")) {
            return new appError_1.AppError("Email already exists", 409, "EMAIL_ALREADY_EXISTS");
        }
        if (pgError.constraint?.includes("employee_number")) {
            return new appError_1.AppError("Employee number already exists", 409, "EMPLOYEE_NUMBER_EXISTS");
        }
        return new appError_1.AppError("Duplicate record", 409, "DUPLICATE_RECORD");
    }
    if (pgError.code === "22P02") {
        return new appError_1.AppError("Invalid identifier format", 400, "INVALID_ID");
    }
    return null;
};
exports.mapDatabaseError = mapDatabaseError;
