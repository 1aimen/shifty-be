// src/modules/userrole/userrole.controller.ts
import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { UserRoleService } from "./users.role.service";
import { UserRole } from "../../models/enums";

/**
 * @swagger
 * tags:
 *   name: User Role Management
 *   description: Manage user roles within the same organization (Admin only)
 */

/**
 * @swagger
 * /api/v1/user/{userId}/role:
 *   put:
 *     summary: Update a user's role (Admin only)
 *     tags: [User Role Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user whose role you want to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: "EMPLOYEE"
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 organizationId:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       403:
 *         description: Forbidden — Not allowed to update this user's role
 *       404:
 *         description: User not found
 */
export const updateUserRoleController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id: adminId } = req.user!;
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const updatedUser = await UserRoleService.updateUserRole(
      adminId,
      userId!,
      role as UserRole
    );

    return res.status(200).json(updatedUser);
  } catch (err: any) {
    return res.status(err.statusCode || 400).json({ message: err.message });
  }
};
