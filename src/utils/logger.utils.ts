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

export const logger = createLogger({
  level: "info", // minimum level to log
  format: combine(
    colorize(), // adds colors for console
    timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
    myFormat
  ),
  transports: [
    new transports.Console(), // logs to console
    new transports.File({ filename: "error.log", level: "error" }), // errors to file
    new transports.File({ filename: "combined.log" }), // all logs to file
  ],
  exceptionHandlers: [
    new transports.File({ filename: "exceptions.log" }), // uncaught exceptions
  ],
  rejectionHandlers: [
    new transports.File({ filename: "rejections.log" }), // unhandled promise rejections
  ],
});
