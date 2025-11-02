export const config = {
  port: process.env.BACKEND_PORT || 3000,
  api_version: process.env.API_VERSION || "api/v1",
  jwt_secret: process.env.JWT_SECRET || "so-secret",
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "so-secret",
  qr_code_secret: process.env.QRCODE_SECRET || "so-secret",
  resend_api_key: process.env.RESEND_API_KEY || "",
  public_app_url: process.env.PUBLIC_APP_URL || "https://www.timetract.com/",
  internal_app_url: process.env.INTERNAL_APP_URL || "localhost:3000/",
};
