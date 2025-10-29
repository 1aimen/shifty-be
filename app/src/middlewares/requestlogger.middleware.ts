// src/middlewares/requestLogger.middleware.ts
import { Request, Response, NextFunction } from "express";
import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const { combine, timestamp, printf, colorize } = format;

// Directory for request logs
const logDir = path.resolve(__dirname, "../../../logs/requests");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

// Create timestamped file names
const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
const successLogFile = path.join(logDir, `success-${date}.log`);
const errorLogFile = path.join(logDir, `error-${date}.log`);
const combinedLogFile = path.join(logDir, `combined-${date}.log`);

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Winston logger for requests
const requestLogger = createLogger({
  level: "info",
  format: combine(timestamp({ format: "DD/MM/YYYY HH:mm:ss" }), logFormat),
  transports: [
    new transports.File({ filename: successLogFile, level: "info" }),
    new transports.File({ filename: errorLogFile, level: "error" }),
    new transports.File({ filename: combinedLogFile }),
    // Console only in non-production
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
        logFormat
      ),
    }),
  ],
});

export const logRequests = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  res.on("finish", () => {
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const duration = Date.now() - start;
    const logMessage = `${method} ${originalUrl} ${statusCode} - ${duration}ms`;

    if (statusCode >= 400) requestLogger.error(logMessage);
    else requestLogger.info(logMessage);
  });

  next();
};
