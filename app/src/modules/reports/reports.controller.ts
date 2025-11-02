// src/modules/reports/reports.controller.ts
import { Request, Response } from "express";
import { ReportService } from "./reports.service";
import { AuthRequest } from "../../types/auth.types";

/**
 * @swagger
 * tags:
 *   name: Report
 *   description: Generate and schedule reports
 */

/**
 * @swagger
 * /api/v1/reports/personal/{userId}:
 *   get:
 *     summary: Generate a personal report for a specific user
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to generate the report for
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PDF, CSV, JSON]
 *         description: Format of the generated report
 *     responses:
 *       200:
 *         description: Successfully generated the personal report
 *       403:
 *         description: Forbidden or access denied
 */
export const generatePersonalReportController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const { id: requesterId, role } = req.user!;
    const { format } = req.query;

    const report = await ReportService.generatePersonalReport(
      userId!,
      requesterId,
      role,
      format as any
    );
    return res.json(report);
  } catch (err: any) {
    return res.status(403).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/reports/shift/{shiftId}:
 *   get:
 *     summary: Generate a shift report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shiftId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the shift
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PDF, CSV, JSON]
 *         description: Format of the generated report
 *     responses:
 *       200:
 *         description: Successfully generated the shift report
 *       403:
 *         description: Forbidden or access denied
 */
export const generateShiftReportController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { shiftId } = req.params;
    const { id: requesterId, role } = req.user!;
    const { format } = req.query;

    const report = await ReportService.generateShiftReport(
      shiftId!,
      requesterId,
      role,
      format as any
    );
    return res.json(report);
  } catch (err: any) {
    return res.status(403).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/reports/project/{projectId}:
 *   get:
 *     summary: Generate a project report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PDF, CSV, JSON]
 *         description: Format of the generated report
 *     responses:
 *       200:
 *         description: Successfully generated the project report
 *       403:
 *         description: Forbidden or access denied
 */
export const generateProjectReportController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { projectId } = req.params;
    const { id: requesterId, role } = req.user!;
    const { format } = req.query;

    const report = await ReportService.generateProjectReport(
      projectId!,
      requesterId,
      role,
      format as any
    );
    return res.json(report);
  } catch (err: any) {
    return res.status(403).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/reports/organization/{orgId}:
 *   get:
 *     summary: Generate an organization-wide report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the organization
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *           enum: [PDF, CSV, JSON]
 *         description: Format of the generated report
 *     responses:
 *       200:
 *         description: Successfully generated the organization report
 *       403:
 *         description: Forbidden or access denied
 */
export const generateOrganizationReportController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { orgId } = req.params;
    const { id: requesterId, role } = req.user!;
    const { format } = req.query;

    const report = await ReportService.generateOrganizationReport(
      orgId!,
      requesterId,
      role,
      format as any
    );
    return res.json(report);
  } catch (err: any) {
    return res.status(403).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/reports/schedule:
 *   post:
 *     summary: Schedule a report for automatic generation
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reportType
 *               - recipientId
 *               - frequency
 *               - timeConfig
 *             properties:
 *               reportType:
 *                 type: string
 *                 enum: [PERSONAL, SHIFT, PROJECT, ORGANIZATION]
 *                 description: Type of report to schedule
 *               recipientId:
 *                 type: string
 *                 description: ID of the user to receive the report
 *               frequency:
 *                 type: string
 *                 enum: [DAILY, WEEKLY, MONTHLY]
 *                 description: Frequency of the report
 *               timeConfig:
 *                 type: object
 *                 description: Additional time configuration (e.g., hour or day)
 *     responses:
 *       201:
 *         description: Report successfully scheduled
 *       400:
 *         description: Invalid input or scheduling failed
 */
export const scheduleReportController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { reportType, recipientId, frequency, timeConfig } = req.body;
    const scheduled = await ReportService.scheduleReport(
      reportType,
      recipientId,
      frequency,
      timeConfig
    );
    return res.status(201).json(scheduled);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
