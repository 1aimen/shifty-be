// src/modules/shift/shift.controller.ts
import { Request, Response } from "express";
import { ShiftService } from "./shifts.service";
import { AuthRequest } from "../../types/auth.types";

/**
 * @swagger
 * tags:
 *   name: Shift
 *   description: Shift management endpoints
 */

/**
 * @swagger
 * /api/v1/organizations/{orgId}/shifts:
 *   post:
 *     summary: Create one or multiple shifts under an organization
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shifts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       201:
 *         description: Shifts created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShiftDTO'
 *       400:
 *         description: Invalid request
 */
export const createShiftsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { orgId } = req.params;
    const shifts = await ShiftService.createShifts(orgId!, req.body.shifts);
    return res.status(201).json(shifts);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/shifts/{shiftId}/assign-users:
 *   post:
 *     summary: Assign multiple users to a shift
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: shiftId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Users assigned to shift successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShiftDTO'
 *       400:
 *         description: Invalid request
 */
export const assignUsersToShiftController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { shiftId } = req.params;
    const { userIds } = req.body;
    const result = await ShiftService.assignUsersToShift(shiftId!, userIds);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/shifts/{shiftId}:
 *   put:
 *     summary: Update a shift
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: shiftId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Shift updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftDTO'
 *       400:
 *         description: Invalid request
 */
export const updateShiftController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { shiftId } = req.params;
    const shift = await ShiftService.updateShift(shiftId!, req.body);
    return res.status(200).json(shift);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/shifts/{shiftId}:
 *   get:
 *     summary: Get a single shift by ID
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: shiftId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift ID
 *     responses:
 *       200:
 *         description: Shift retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftDTO'
 *       404:
 *         description: Shift not found
 */
export const getShiftController = async (req: AuthRequest, res: Response) => {
  try {
    const { shiftId } = req.params;
    const shift = await ShiftService.getShift(shiftId!);
    return res.status(200).json(shift);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/organizations/{orgId}/shifts:
 *   get:
 *     summary: Get all shifts under an organization (manager sees only their shifts)
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: List of shifts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShiftDTO'
 *       400:
 *         description: Invalid request
 */
export const getShiftsController = async (req: AuthRequest, res: Response) => {
  try {
    const { orgId } = req.params;
    const managerId = req.user?.role === "MANAGER" ? req.user.id : undefined;
    const shifts = await ShiftService.getShifts(orgId!, managerId);
    return res.status(200).json(shifts);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/organizations/{orgId}/shifts/settings:
 *   get:
 *     summary: Get shift settings for an organization
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Shift settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftSettingsDTO'
 *       404:
 *         description: Settings not found
 */
export const getShiftSettingsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { orgId } = req.params;
    const settings = await ShiftService.getShiftSettings(orgId!);
    return res.status(200).json(settings);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/organizations/{orgId}/shifts/settings:
 *   put:
 *     summary: Update shift settings for an organization
 *     tags: [Shift]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               timezone:
 *                 type: string
 *               weekStartDay:
 *                 type: integer
 *               requireGeo:
 *                 type: boolean
 *               requireDeviceLock:
 *                 type: boolean
 *               minimumClockSeconds:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Shift settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftSettingsDTO'
 *       400:
 *         description: Invalid request
 */
export const updateShiftSettingsController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { orgId } = req.params;
    const settings = await ShiftService.updateShiftSettings(orgId!, req.body);
    return res.status(200).json(settings);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     ShiftDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         organizationId:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         user:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: string
 *             username:
 *               type: string
 *     ShiftSettingsDTO:
 *       type: object
 *       properties:
 *         timezone:
 *           type: string
 *         weekStartDay:
 *           type: integer
 *         requireGeo:
 *           type: boolean
 *         requireDeviceLock:
 *           type: boolean
 *         minimumClockSeconds:
 *           type: integer
 */
