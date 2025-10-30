import QRCode from "qrcode";
import crypto from "crypto";
import { config } from "../config";

const SECRET_KEY = config.qr_code_secret || "supersecret";

export const QRCodeUtils = {
  /**
   * Generate a QR code for clock-in
   * @param clockId string
   * @param shiftId string
   * @param userId string
   * @returns base64 QR code
   */
  async generateQRCodeBase64(clockId: string, shiftId: string, userId: string) {
    const expiresAt = Date.now() + 15_000; // 15 seconds
    const payload = JSON.stringify({ clockId, shiftId, userId, expiresAt });
    const signature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(payload)
      .digest("hex");
    const qrContent = JSON.stringify({ payload, signature });
    return QRCode.toDataURL(qrContent);
  },

  /**
   * Validate a QR code
   * @param qrContent string
   * @param shiftId string
   * @param userId string
   * @returns clockId if valid
   */
  validateQRCode(qrContent: string, shiftId: string, userId: string) {
    try {
      const { payload, signature } = JSON.parse(qrContent);
      const expectedSignature = crypto
        .createHmac("sha256", SECRET_KEY)
        .update(payload)
        .digest("hex");
      if (expectedSignature !== signature)
        throw new Error("Invalid QR code signature");

      const {
        clockId,
        shiftId: qrShiftId,
        userId: qrUserId,
        expiresAt,
      } = JSON.parse(payload);

      if (Date.now() > expiresAt) throw new Error("QR code expired");
      if (qrShiftId !== shiftId)
        throw new Error("QR code does not belong to this shift");
      if (qrUserId !== userId)
        throw new Error("QR code does not belong to this user");

      return clockId;
    } catch (err) {
      throw new Error("Invalid QR code format or expired");
    }
  },
};
