// src/modules/leaves/leave.controller.ts
import { Request, Response } from "express";
import { LeaveService } from "./leave.service";
import { AuthRequest } from "../../types/auth.types";

/**
 * @swagger
 * tags:
 *   name: Leave
 *   description: Leave management endpoints (per project)
 */

/**
 * @swagger
 * /api/v1/projects/{projectId}/leaves:
 *   post:
 *     summary: Create one or multiple leaves under a project
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *               - type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     startDate:
 *                       type: string
 *                       format: date
 *                     endDate:
 *                       type: string
 *                       format: date
 */
export const createLeavesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { projectId } = req.params;
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const { id: userId, role } = req.user!;

    const leaves = await LeaveService.createLeaves(
      projectId!,
      userId,
      role,
      data
    );
    return res.status(201).json(leaves);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/leaves/{leaveId}/assign-users:
 *   post:
 *     summary: Assign one or multiple users to a leave (e.g. public holiday)
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 */
export const assignUsersToLeaveController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { leaveId } = req.params;
    const { userIds } = req.body;
    const { role } = req.user!;

    const result = await LeaveService.assignUsersToLeave(
      leaveId!,
      userIds,
      role
    );
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/leaves/{leaveId}:
 *   put:
 *     summary: Update a leave
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 */
export const updateLeaveController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { leaveId } = req.params;
    const { id: userId, role } = req.user!;

    const updated = await LeaveService.updateLeave(
      leaveId!,
      role,
      userId,
      req.body
    );
    return res.json(updated);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/leaves/{leaveId}:
 *   get:
 *     summary: Get a single leave
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 */
export const getLeaveController = async (req: AuthRequest, res: Response) => {
  try {
    const { leaveId } = req.params;
    const { id: userId, role } = req.user!;

    const leave = await LeaveService.getLeave(leaveId!, role, userId);
    return res.json(leave);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/projects/{projectId}/leaves:
 *   get:
 *     summary: Get all leaves under a project
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 */
export const getLeavesController = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { id: userId, role } = req.user!;

    const leaves = await LeaveService.getLeaves(projectId!, role, userId);
    return res.json(leaves);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};
