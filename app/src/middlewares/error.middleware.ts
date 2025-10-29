import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.utils";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err as AppError).statusCode || 500;
  const isOperational = (err as AppError).isOperational ?? false;

  // Operational errors go to error.log (also combined.log)
  if (isOperational) {
    logger.error(
      `[${req.method} ${req.originalUrl}] ${statusCode} : ${err.message}`
    );
  } else {
    // Internal errors (stack trace) go to exceptions.log
    logger.error(
      `[${req.method} ${req.originalUrl}] ${statusCode} : ${err.message}\n${err.stack}`
    );
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: isOperational ? err.message : "Internal Server Error",
  });
};
