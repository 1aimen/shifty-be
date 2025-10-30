// src/modules/projects/project-user.controller.ts
import { Request, Response } from "express";
import { ProjectUserService } from "./project.users.service";
import { AuthRequest } from "../../types/auth.types"; // for req.user typing

/**
 * @swagger
 * /api/v1/projects/{projectId}/assign-users:
 *   post:
 *     summary: Assign one or multiple users to a project (Admin only)
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
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
 *               userIds:
 *                 oneOf:
 *                   - type: string
 *                   - type: array
 *                     items:
 *                       type: string
 *             example:
 *               userIds: ["user1", "user2"]
 *     responses:
 *       200:
 *         description: Users assigned successfully
 *       400:
 *         description: Error
 *       403:
 *         description: Forbidden
 */
export const assignUserToProjectController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { projectId } = req.params;
    let { userIds } = req.body;

    // support single string or array
    if (!Array.isArray(userIds)) userIds = [userIds];

    const result = await ProjectUserService.assignUsersToProject(
      projectId!,
      userIds
    );
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/projects/{projectId}/users:
 *   get:
 *     summary: Get all users assigned to a project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of users
 *       400:
 *         description: Error
 *       403:
 *         description: Forbidden
 */
export const getProjectUsersController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { projectId } = req.params;
    const users = await ProjectUserService.getProjectUsers(projectId!);
    return res.status(200).json(users);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
