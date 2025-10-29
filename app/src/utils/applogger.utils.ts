// src/utils/appLogger.utils.ts
import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const { combine, timestamp, printf, colorize } = format;

const logDir = path.resolve(__dirname, "../../../logs/app");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

export const appLogger = (moduleName: string) => {
  const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] [${moduleName}] : ${message}`;
  });

  return createLogger({
    level: "info",
    format: combine(timestamp({ format: "DD/MM/YYYY HH:mm:ss" }), logFormat),
    transports: [
      new transports.File({ filename: path.join(logDir, "combined.log") }),
      new transports.File({
        filename: path.join(logDir, "error.log"),
        level: "error",
      }),
      new transports.Console({
        format: combine(
          colorize(),
          timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
          logFormat
        ),
      }),
    ],
  });
};
