import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const { combine, timestamp, printf, colorize, label } = format;

const logDir = path.resolve(__dirname, "../../../logs/app");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logFormat = printf(({ level, message, timestamp, label }) => {
  return `${timestamp} [${level}]${label ? ` [${label}]` : ""} : ${message}`;
});

export const logger = createLogger({
  level: "info",
  format: combine(timestamp({ format: "DD/MM/YYYY HH:mm:ss" }), logFormat),
  transports: [
    // For operational errors (to frontend)
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    // All logs combined
    new transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
    // Console for dev
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
        logFormat
      ),
    }),
  ],
  // Internal errors
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, "exceptions.log") }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, "rejections.log") }),
  ],
});
