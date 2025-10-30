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
 *     summary: Generate personal report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Generate shift report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Generate project report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Generate organization report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Schedule a report
 *     tags: [Report]
 *     security:
 *       - bearerAuth: []
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
