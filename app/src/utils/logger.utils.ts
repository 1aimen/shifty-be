// const formatDate = (date: Date) => {
//   const pad = (n: number) => n.toString().padStart(2, "0");
//   const day = pad(date.getDate());
//   const month = pad(date.getMonth() + 1);
//   const year = date.getFullYear();
//   const hours = pad(date.getHours());
//   const minutes = pad(date.getMinutes());
//   const seconds = pad(date.getSeconds());

//   return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
// };

// // ANSI color codes
// const colors = {
//   reset: "\x1b[0m",
//   info: "\x1b[32m",
//   warning: "\x1b[33m",
//   error: "\x1b[31m",
// };

// export const logger = {
//   info: (msg: string) =>
//     console.log(
//       `${colors.info}[INFO ${formatDate(new Date())}]${colors.reset} ${msg}`
//     ),

//   warning: (msg: string) =>
//     console.log(
//       `${colors.warning}[WARNING ${formatDate(new Date())}]${
//         colors.reset
//       } ${msg}`
//     ),

//   error: (msg: string) =>
//     console.error(
//       `${colors.error}[ERROR ${formatDate(new Date())}]${colors.reset} ${msg}`
//     ),
// };

import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

import path from "path";

const logDir = path.resolve(__dirname, "../../../logs");

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
