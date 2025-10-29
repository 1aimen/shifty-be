// src/modules/project/project.controller.ts
import { Request, Response } from "express";
import { ProjectService } from "./project.service";
import { AuthRequest } from "../../types/auth.types";

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Project management endpoints
 */

export const createProjectController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { orgId } = req.params;
    const project = await ProjectService.createProject(orgId!, req.body);
    return res.status(201).json(project);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateProjectController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { projectId } = req.params;
    const project = await ProjectService.updateProject(projectId!, req.body);
    return res.status(200).json(project);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const getProjectController = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const project = await ProjectService.getProject(projectId!);
    return res.status(200).json(project);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

export const deleteProjectController = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const result = await ProjectService.deleteProject(projectId!);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

export const listProjectsController = async (req: Request, res: Response) => {
  try {
    const { orgId } = req.params;
    const projects = await ProjectService.listProjects(orgId!);
    return res.status(200).json(projects);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Project management endpoints
 */

/**
 * @swagger
 * /api/v1/organizations/{orgId}/projects:
 *   post:
 *     summary: Create a new project under an organization
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the organization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectDTO'
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /api/v1/organizations/{orgId}/projects:
 *   get:
 *     summary: List all projects under an organization
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the organization
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProjectDTO'
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}:
 *   get:
 *     summary: Get a project by ID
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectDTO'
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}:
 *   put:
 *     summary: Update a project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProjectDTO'
 *       400:
 *         description: Invalid request
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Project]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project deleted successfully
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         organizationId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
