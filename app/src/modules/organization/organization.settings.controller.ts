import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { OrganizationSettingsService } from "./organization.settings.service";

/**
 * @swagger
 * tags:
 *   name: Organization Settings
 *   description: Manage organization-level settings
 */

/**
 * @swagger
 * /api/v1/organizations/{orgId}/settings:
 *   get:
 *     summary: Get organization settings
 *     tags: [Organization Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization settings retrieved successfully
 *       404:
 *         description: Settings not found
 *       403:
 *         description: Not authorized
 */
export const getOrganizationSettingsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id: userId, role } = req.user!;
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { orgId } = req.params;
    const settings = await OrganizationSettingsService.getSettings(orgId!);

    return res.status(200).json(settings);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/organizations/{orgId}/settings:
 *   put:
 *     summary: Update organization settings
 *     tags: [Organization Settings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timezone:
 *                 type: string
 *                 example: "Europe/Paris"
 *               weekStartDay:
 *                 type: integer
 *                 example: 1
 *               requireGeo:
 *                 type: boolean
 *                 example: false
 *               requireDeviceLock:
 *                 type: boolean
 *                 example: true
 *               minimumClockSeconds:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       200:
 *         description: Organization settings updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Not authorized
 */
export const updateOrganizationSettingsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id: userId, role } = req.user!;
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { orgId } = req.params;
    const data = req.body;

    const updated = await OrganizationSettingsService.updateSettings(
      orgId!,
      data
    );

    return res.status(200).json(updated);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
