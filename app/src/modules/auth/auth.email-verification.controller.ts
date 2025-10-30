// src/modules/auth/auth.email-verification.controller.ts
import { Request, Response } from "express";
import { EmailVerificationService } from "./auth.email-verification.service";

/**
 * @swagger
 * /api/v1/auth/email-verification-request:
 *   post:
 *     summary: Request verification email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Error
 */
export const sendVerificationEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;
    const result = await EmailVerificationService.sendVerificationEmail(email);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: Verify email with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
export const verifyEmailController = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const result = await EmailVerificationService.verifyEmail(token);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
