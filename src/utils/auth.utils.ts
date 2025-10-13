import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/index";

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed one
 */
export async function comparePasswords(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate an access token (short-lived)
 */
export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, config.jwt_secret, { expiresIn: "15m" });
}

/**
 * Generate a refresh token (long-lived)
 */
export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, config.jwt_refresh_secret, { expiresIn: "7d" });
}
