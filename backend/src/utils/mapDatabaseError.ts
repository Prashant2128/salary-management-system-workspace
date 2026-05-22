import { AppError } from "../errors/appError";

interface PostgresError extends Error {
  code?: string;
  constraint?: string;
}

export const mapDatabaseError = (error: unknown): AppError | null => {
  const pgError = error as PostgresError;

  if (pgError.code === "23505") {
    if (pgError.constraint?.includes("email")) {
      return new AppError("Email already exists", 409, "EMAIL_ALREADY_EXISTS");
    }
    if (pgError.constraint?.includes("employee_number")) {
      return new AppError("Employee number already exists", 409, "EMPLOYEE_NUMBER_EXISTS");
    }
    return new AppError("Duplicate record", 409, "DUPLICATE_RECORD");
  }

  if (pgError.code === "22P02") {
    return new AppError("Invalid identifier format", 400, "INVALID_ID");
  }

  return null;
};
