// src/modules/reports/report.service.ts
import { AppError } from "../../middlewares/error.middleware";
import { prisma } from "../../utils/prisma.utils";

export const ReportService = {
  /**
   * Generate a personal report
   */
  async generatePersonalReport(
    userId: string,
    requesterId: string,
    requesterRole: string,
    format: "CSV" | "PDF" | "EXCEL"
  ) {
    // check permissions: self, admin, or manager of any project of the user
    if (userId !== requesterId && requesterRole !== "ADMIN") {
      const isManager = await prisma.projectUser.findFirst({
        where: {
          userId: requesterId,
          project: { ProjectUser: { some: { userId } } },
        },
        include: { project: true },
      });

      if (!isManager) {
        throw new AppError("You are not authorized to generate this report");
      }
    }

    // fetch data
    const timeEntries = await prisma.timeentry.findMany({
      where: { userId },
    });

    return { data: timeEntries, format };
  },

  /**
   * Generate a shift report
   */
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

    // check permissions: shift owner, admin, or manager of any project in the org
    if (shift.userId !== requesterId && requesterRole !== "ADMIN") {
      const isManagerInOrg = await prisma.projectUser.findFirst({
        where: {
          userId: requesterId,
          project: {
            organizationId: shift.organizationId,
          },
        },
        include: { project: true },
      });

      if (!isManagerInOrg) {
        throw new AppError("You are not authorized to generate this report");
      }
    }

    const clocks = await prisma.clock.findMany({
      where: { shiftId },
      include: { clockIns: true, clockOuts: true },
    });

    return { data: clocks, format };
  },

  /**
   * Generate a project report
   */
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

    // check permissions: admin or associated user in ProjectUser
    if (requesterRole !== "ADMIN") {
      const isUserInProject = await prisma.projectUser.findFirst({
        where: { projectId, userId: requesterId },
      });

      if (!isUserInProject) {
        throw new AppError("You are not authorized to generate this report");
      }
    }

    const tasks = await prisma.task.findMany({ where: { projectId } });
    return { data: tasks, format };
  },

  /**
   * Generate an organization report
   */
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
    return { data: shifts, format };
  },

  /**
   * Schedule automatic reports
   */
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
