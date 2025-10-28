// src/modules/auth/auth.service.ts
import {
  RegisterRequestDTO,
  RegisterResponseDTO,
  LoginRequestDTO,
  LoginResponseDTO,
} from "./auth.dto";
import {
  comparePasswords,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from "../../utils/auth.utils";
import { prisma } from "../../utils/prisma.utils";
import { UserRole } from "../../models/enums";

export class AuthService {
  static async register(
    data: RegisterRequestDTO
  ): Promise<RegisterResponseDTO> {
    const { email, password, username, firstName, lastName } = data;
    const now = new Date();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already in use");

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        username,
        role: "EMPLOYEE",
        updatedAt: now,
      },
    });

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await prisma.refreshtoken.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  static async login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    const valid = await comparePasswords(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    const existingToken = await prisma.refreshtoken.findFirst({
      where: { userId: user.id },
    });

    if (existingToken) {
      await prisma.refreshtoken.update({
        where: { id: existingToken.id },
        data: {
          refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    } else {
      await prisma.refreshtoken.create({
        data: {
          userId: user.id,
          refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}
