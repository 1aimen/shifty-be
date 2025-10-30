import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { OrganizationProjectManagement } from "./organization.project.service";

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Manage projects within organizations
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}/duplicate:
 *   post:
 *     summary: Duplicate a project into another organization
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
 *               targetOrgId:
 *                 type: string
 *                 example: "c9f253ee-aaa8-4988-8243-43a1e2d4609c"
 *     responses:
 *       201:
 *         description: Project duplicated successfully
 *       404:
 *         description: Project not found
 *       403:
 *         description: Not authorized
 */
export const duplicateProjectController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { role } = req.user!;
    if (role !== "ADMIN")
      return res.status(403).json({ message: "Not authorized" });

    const { projectId } = req.params;
    const { targetOrgId } = req.body;

    const duplicatedProject =
      await OrganizationProjectManagement.duplicateProject(
        projectId!,
        targetOrgId
      );
    return res.status(201).json(duplicatedProject);
  } catch (err: any) {
    return res.status(err.statusCode || 400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/projects/{projectId}/move:
 *   post:
 *     summary: Move a project to another organization
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
 *               targetOrgId:
 *                 type: string
 *                 example: "c9f253ee-aaa8-4988-8243-43a1e2d4609c"
 *     responses:
 *       200:
 *         description: Project moved successfully
 *       404:
 *         description: Project not found
 *       403:
 *         description: Not authorized
 */
export const moveProjectController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { role } = req.user!;
    if (role !== "ADMIN")
      return res.status(403).json({ message: "Not authorized" });

    const { projectId } = req.params;
    const { targetOrgId } = req.body;

    const movedProject = await OrganizationProjectManagement.moveProject(
      projectId!,
      targetOrgId
    );
    return res.status(200).json(movedProject);
  } catch (err: any) {
    return res.status(err.statusCode || 400).json({ message: err.message });
  }
};
