import type { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  parent?: {
    message?: string;
    detail?: string;
    code?: string;
  };
  original?: {
    message?: string;
    detail?: string;
    code?: string;
  };
  sql?: string;
}

export function createError(message: string, statusCode = 500): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.isOperational ? err.message : "Internal server error";

  if (process.env.NODE_ENV !== "test") {
    console.error("[Error]", err);
    console.error("[DB Error]", err.parent?.message);
    console.error("[SQL]", err.sql);
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      dbError: err.parent?.message ?? err.original?.message,
      sql: err.sql,
    }),
  });
}