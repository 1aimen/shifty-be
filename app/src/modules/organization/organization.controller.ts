// src/modules/organization/organization.controller.ts
import { Request, Response } from "express";
import { OrganizationService } from "./organization.service";
import { logger } from "../../utils/logger.utils";
import { AuthRequest } from "../../types/auth.types";
/**
 * @swagger
 * tags:
 *   name: Organization
 *   description: Organization management endpoints
 */

/**
 * @swagger
 * /api/v1/organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       403:
 *         description: Not authorized
 */
export const createOrganizationController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id: userId, role } = req.user!;
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const result = await OrganizationService.createOrganization(
      userId,
      req.body
    );
    logger.info(`${res.statusCode} ${req.method} ${req.url}`);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
/**
 * @swagger
 * /api/v1/organizations/{orgId}:
 *   get:
 *     summary: Get an organization by ID
 *     tags: [Organization]
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
 *         description: Organization retrieved successfully
 *       404:
 *         description: Organization not found
 */
export const getOrganizationController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { orgId } = req.params;
    const result = await OrganizationService.getOrganization(orgId!);
    logger.info(`${res.statusCode} ${req.method} ${req.url}`);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/organizations/{orgId}:
 *   put:
 *     summary: Update an organization
 *     tags: [Organization]
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Organization not found
 */
export const updateOrganizationController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id: userId, role } = req.user!;
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { orgId } = req.params;
    const result = await OrganizationService.updateOrganization(
      orgId!,
      req.body
    );
    logger.info(`${res.statusCode} ${req.method} ${req.url}`);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
/**
 * @swagger
 * /api/v1/organizations/{orgId}:
 *   delete:
 *     summary: Delete an organization
 *     tags: [Organization]
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
 *         description: Organization deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Organization not found
 */
export const deleteOrganizationController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id: userId, role } = req.user!;
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { orgId } = req.params;
    const result = await OrganizationService.deleteOrganization(orgId!, userId);
    logger.info(`${res.statusCode} ${req.method} ${req.url}`);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};
