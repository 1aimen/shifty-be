// src/modules/users/user.controller.ts
import { Request, Response } from "express";
import { userPasswordService } from "./auth.reset-password.service";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and password reset
 */

/**
 * @swagger
 * /api/v1/users/{id}/reset-password:
 *   post:
 *     summary: Admin sends a password reset link to a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       400:
 *         description: User not found or error
 */
export const sendPasswordResetLinkController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await userPasswordService.sendPasswordResetLink(
      req.params.id!
    );
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/auth/reset-password-request:
 *   post:
 *     summary: Request password reset link by email (for non-logged-in users)
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
 *         description: Password reset link sent successfully if email exists
 *       400:
 *         description: Email not found or error
 */
export const getPasswordResetLinkController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await userPasswordService.getPasswordResetLink(
      req.body.email
    );
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password using token
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
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const result = await userPasswordService.resetPassword(token, newPassword);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
