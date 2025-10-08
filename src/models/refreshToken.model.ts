export interface RefreshToken {
  id: string;
  userId: string;
  refreshToken: string;
  createdAt: Date;
  expiresAt: Date;
}
