import crypto from "crypto";
import { prisma } from "../../utils/prisma.utils";
// import { sendEmail } from "../utils/email"; // your email sending utility

export class userPasswordService {
  // Admin-forced password reset by user ID
  static async sendPasswordResetLink(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.passwordresettoken.create({
      data: { userId, token, expiresAt },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // await sendEmail({ to: user.email, subject: "Password Reset Request", text: `Click here to reset: ${resetUrl}` });

    return { message: "Password reset link sent successfully", resetUrl };
  }

  // Non-logged-in user requesting reset by email
  static async getPasswordResetLink(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("No user found with this email");

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.passwordresettoken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // await sendEmail({ to: user.email, subject: "Password Reset Request", text: `Click here to reset: ${resetUrl}` });

    return { message: "Password reset link sent successfully", resetUrl };
  }

  // Reset password using token
  static async resetPassword(token: string, newPassword: string) {
    const resetToken = await prisma.passwordresettoken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) throw new Error("Invalid token");
    if (resetToken.expiresAt < new Date()) throw new Error("Token expired");

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: newPassword }, // hash in production
    });

    await prisma.passwordresettoken.delete({ where: { id: resetToken.id } });

    return { message: "Password reset successfully" };
  }
}
