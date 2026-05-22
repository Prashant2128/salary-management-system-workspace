import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";
import { AppError } from "../errors/appError";
import { mapDatabaseError } from "../utils/mapDatabaseError";

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: "Resource not found",
      code: "NOT_FOUND"
    }
  });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: error.issues.map((issue) => issue.message).join(", "),
        code: "VALIDATION_ERROR"
      }
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code
      }
    });
  }

  const mapped = mapDatabaseError(error);
  if (mapped) {
    return res.status(mapped.statusCode).json({
      error: {
        message: mapped.message,
        code: mapped.code
      }
    });
  }

  if (env.nodeEnv !== "test") {
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
