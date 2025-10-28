import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export interface ErrorDetail {
  field?: string;
  message: string;
}

// ─── Custom App Error ───────────────────────────
export class AppError extends Error {
  statusCode: number;
  errors?: ErrorDetail[];

  constructor(message: string | ErrorDetail[], statusCode = 500) {
    super(typeof message === "string" ? message : "Multiple errors occurred");
    this.statusCode = statusCode;
    if (Array.isArray(message)) this.errors = message;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Helper: Map Prisma errors to user-friendly messages ─────
const mapPrismaErrorToMessage = (
  err: Prisma.PrismaClientKnownRequestError
): { message: string; errors?: ErrorDetail[] } => {
  switch (err.code) {
    case "P2002": // Unique constraint failed
      // err.meta.target contains the columns that failed
      const fields = (err.meta?.target as string[]) || [];
      return {
        message: "Duplicate value",
        errors: fields.map((field) => ({
          field,
          message: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } already exists`,
        })),
      };

    case "P2025": // Record not found
      return { message: "Item not found" };

    default:
      return { message: "Database error" };
  }
};

// ─── Global Error Middleware ───────────────────
export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the real error internally
  console.error("[ERROR]", err);

  // ───── Prisma known errors ─────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { message, errors } = mapPrismaErrorToMessage(err);
    return res
      .status(400)
      .json({ status: "error", message, ...(errors ? { errors } : {}) });
  }

  // ───── Prisma validation errors ─────
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      status: "error",
      message: "Invalid data provided",
    });
  }

  // ───── Custom AppError ─────
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }

  // ───── Generic JS errors ─────
  if (err instanceof Error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }

  // ───── Fallback ─────
  return res
    .status(500)
    .json({ status: "error", message: "Something went wrong" });
};
