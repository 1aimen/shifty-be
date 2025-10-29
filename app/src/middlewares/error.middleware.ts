// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { appLogger } from "../utils/applogger.utils";

const logger = appLogger("ErrorMiddleware");

// Custom AppError class
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

// Express error middleware
export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err as AppError).statusCode || 500;
  const isOperational = (err as AppError).isOperational ?? false;

  logger.error(
    `[${req.method} ${req.originalUrl}] ${statusCode} : ${err.message}\n${err.stack}`
  );

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: isOperational ? err.message : "Internal Server Error",
  });
};
