// src/modules/reports/report.service.ts
import { AppError } from "../../middlewares/error.middleware";
import { prisma } from "../../utils/prisma.utils";
import { PdfUtils } from "../../utils/pdf.utils";
import path from "path";

export const ReportService = {
  async generatePersonalReport(
    userId: string,
    requesterId: string,
    requesterRole: string,
    format: "CSV" | "PDF" | "EXCEL"
  ) {
    // permission check (unchanged)
    if (userId !== requesterId && requesterRole !== "ADMIN") {
      const isManager = await prisma.projectUser.findFirst({
        where: {
          userId: requesterId,
          project: { ProjectUser: { some: { userId } } },
        },
        include: { project: true },
      });
      if (!isManager)
        throw new AppError("You are not authorized to generate this report");
    }

    // fetch data
    const timeEntries = await prisma.timeentry.findMany({
      where: { userId },
    });

    if (format === "PDF") {
      const filename = `personal_report_${userId}_${Date.now()}`;
      const filePath = await PdfUtils.exportPDF(timeEntries, filename);
      return { path: filePath, format };
    }

    // for now just return raw data for CSV/EXCEL
    return { data: timeEntries, format };
  },

  async generateShiftReport(
    shiftId: string,
    requesterId: string,
    requesterRole: string,
    format: "CSV" | "PDF" | "EXCEL"
  ) {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: { organization: true },
    });
    if (!shift) throw new AppError("Shift not found");

    if (shift.userId !== requesterId && requesterRole !== "ADMIN") {
      const isManagerInOrg = await prisma.projectUser.findFirst({
        where: {
          userId: requesterId,
          project: { organizationId: shift.organizationId },
        },
        include: { project: true },
      });
      if (!isManagerInOrg)
        throw new AppError("You are not authorized to generate this report");
    }

    const clocks = await prisma.clock.findMany({
      where: { shiftId },
      include: { clockIns: true, clockOuts: true },
    });

    if (format === "PDF") {
      const filename = `shift_report_${shiftId}_${Date.now()}`;
      const filePath = await PdfUtils.exportPDF(clocks, filename);
      return { path: filePath, format };
    }

    return { data: clocks, format };
  },

  async generateProjectReport(
    projectId: string,
    requesterId: string,
    requesterRole: string,
    format: "CSV" | "PDF" | "EXCEL"
  ) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new AppError("Project not found");

    if (requesterRole !== "ADMIN") {
      const isUserInProject = await prisma.projectUser.findFirst({
        where: { projectId, userId: requesterId },
      });
      if (!isUserInProject)
        throw new AppError("You are not authorized to generate this report");
    }

    const tasks = await prisma.task.findMany({ where: { projectId } });

    if (format === "PDF") {
      const filename = `project_report_${projectId}_${Date.now()}`;
      const filePath = await PdfUtils.exportPDF(tasks, filename);
      return { path: filePath, format };
    }

    return { data: tasks, format };
  },

  async generateOrganizationReport(
    orgId: string,
    requesterId: string,
    requesterRole: string,
    format: "CSV" | "PDF" | "EXCEL"
  ) {
    if (requesterRole !== "ADMIN") {
      throw new AppError("Only admins can generate organization reports");
    }

    const shifts = await prisma.shift.findMany({
      where: { organizationId: orgId },
    });

    if (format === "PDF") {
      const filename = `organization_report_${orgId}_${Date.now()}`;
      const filePath = await PdfUtils.exportPDF(shifts, filename);
      return { path: filePath, format };
    }

    return { data: shifts, format };
  },

  async scheduleReport(
    reportType: "PERSONAL" | "SHIFT" | "PROJECT" | "ORGANIZATION",
    recipientId: string,
    frequency: "DAILY" | "WEEKLY" | "MONTHLY",
    timeConfig: any
  ) {
    return prisma.reportSchedule.create({
      data: {
        reportType,
        recipientId,
        frequency,
        timeConfig: JSON.stringify(timeConfig),
      },
    });
  },
};
