import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const { combine, timestamp, printf, colorize } = format;
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});
const logDir =
  process.env.NODE_ENV === "production"
    ? "/usr/src/app/logs"
    : path.resolve(__dirname, "../../../logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new transports.File({ filename: path.join(logDir, "combined.log") }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, "exceptions.log") }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, "rejections.log") }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}
