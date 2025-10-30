import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { UserPreferencesService } from "./settings.service";

/**
 * @swagger
 * tags:
 *   name: User Preferences
 *   description: Manage the current user's settings and preferences
 */

/**
 * @swagger
 * /api/v1/user/preferences:
 *   get:
 *     summary: Get the logged-in user's preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Preferences retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 language:
 *                   type: string
 *                   example: "fr"
 *                 darkMode:
 *                   type: boolean
 *                   example: false
 *                 notifications:
 *                   type: boolean
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Preferences not found
 */
export const getUserPreferencesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id: userId } = req.user!;
    const preferences = await UserPreferencesService.getPreferences(userId);
    return res.status(200).json(preferences);
  } catch (err: any) {
    return res.status(err.statusCode || 404).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/user/preferences:
 *   put:
 *     summary: Update the logged-in user's preferences
 *     tags: [User Preferences]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 example: "en"
 *               darkMode:
 *                 type: boolean
 *                 example: true
 *               notifications:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 language:
 *                   type: string
 *                 darkMode:
 *                   type: boolean
 *                 notifications:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request
 */
export const updateUserPreferencesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id: userId } = req.user!;
    const data = req.body;

    const updated = await UserPreferencesService.updatePreferences(
      userId,
      data
    );
    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(err.statusCode || 400).json({ message: err.message });
  }
};
