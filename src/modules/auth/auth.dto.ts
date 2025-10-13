// src/dto/auth.dto.ts

// ─── Request DTOs ──────────────────────────────
export interface RegisterRequestDTO {
  email: string;
  password: string;
  username: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

// ─── Response DTOs ─────────────────────────────
export interface AuthUserDTO {
  id: string;
  email: string;
  username: string;
  role: string;
}

export interface RegisterResponseDTO {
  user: AuthUserDTO;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseDTO {
  user: AuthUserDTO;
  accessToken: string;
  refreshToken: string;
}
