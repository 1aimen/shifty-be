import { Request, Response, NextFunction } from "express";

/**
 * Middleware to check if the authenticated user has one of the allowed roles.
 * Usage: authorize("ADMIN"), authorize("MANAGER", "EMPLOYEE")
 */
export const authorize =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role || (req as any).role;

    if (!userRole) {
      return res
        .status(403)
        .json({ message: "User role not found in request" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({
          message:
            "Forbidden: You do not have permission to access this resource",
        });
    }

    next();
  };
