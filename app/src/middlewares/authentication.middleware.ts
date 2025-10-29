import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../types/auth.types";
import { prisma } from "../utils/prisma.utils";
import { config } from "../config";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const secret = config.jwt_secret;
    if (!secret) throw new Error("JWT_SECRET not defined");

    const decoded = jwt.verify(token!, secret) as CustomJwtPayload;

    if (!decoded || !decoded.userId) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    // Fetch the user from DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) return res.status(403).json({ message: "User not found" });

    // Attach full user object to req
    req.user = { id: user.id, role: user.role };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
