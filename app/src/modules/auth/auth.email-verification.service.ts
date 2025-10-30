// src/modules/auth/auth.email-verification.service.ts
import crypto from "crypto";
import { prisma } from "../../utils/prisma.utils";
// import { sendEmail } from "../../utils/email.utils";

export class EmailVerificationService {
  // User provides email, we send verification link
  static async sendVerificationEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    if (user.isEmailVerified) return { message: "Email already verified" };

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    await prisma.emailverificationtoken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    // await sendEmail({
    //   to: user.email,
    //   subject: "Verify your email",
    //   text: `Click here to verify your email: ${verificationUrl}`,
    // });

    return { message: "Verification email sent", verificationUrl };
  }

  static async verifyEmail(token: string) {
    const record = await prisma.emailverificationtoken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record) throw new Error("Invalid verification token");
    if (record.expiresAt < new Date()) throw new Error("Token expired");

    await prisma.user.update({
      where: { id: record.userId },
      data: { isEmailVerified: true },
    });

    await prisma.emailverificationtoken.delete({ where: { id: record.id } });

    return { message: "Email verified successfully" };
  }
}
