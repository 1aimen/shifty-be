export const config = {
  port: process.env.BACKEND_PORT || 3000,
  api_version: process.env.API_VERSION || "api/v1",
  jwt_secret: process.env.JWT_SECRET || "so-secret",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "so-secret",
  qr_code_secret: process.env.QRCODE_SECRET || "so-secret",
};
