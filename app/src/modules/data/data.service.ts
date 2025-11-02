import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DataService {
  // ------------------- SHIFT METRICS -------------------

  // Get all shifts for a given period, optionally filtered by department (projectId)
  static async getShifts(
    organizationId: string,
    startDate?: Date,
    endDate?: Date,
    projectId?: string
  ) {
    return prisma.shift.findMany({
      where: {
        organizationId,
        ...(startDate && { startTime: { gte: startDate } }),
        ...(endDate && { endTime: { lte: endDate } }),
        ...(projectId && { project: { id: projectId } }),
      },
      include: {
        user: true,
        clock: {
          include: {
            clockIns: true,
            clockOuts: true,
          },
        },
      },
      orderBy: { startTime: "asc" },
    });
  }

  // Calculate shift adherence: % of shifts properly clocked in/out
  static async getShiftAdherence(organizationId: string) {
    const shifts = await prisma.shift.findMany({
      where: { organizationId },
      include: { clock: { include: { clockIns: true, clockOuts: true } } },
    });

    const totalShifts = shifts.length;
    const coveredShifts = shifts.filter(
      (s) =>
        s.clock.length > 0 &&
        s.clock[0]!.clockIns.length > 0 &&
        s.clock[0]!.clockOuts.length > 0
    ).length;

    return {
      totalShifts,
      coveredShifts,
      adherenceRate: totalShifts ? (coveredShifts / totalShifts) * 100 : 0,
    };
  }

  static async getClockedInCount(organizationId: string) {
    const now = new Date();
    const clocks = await prisma.clock.findMany({
      where: {
        shift: { organizationId },
        clockIns: { some: { clockAt: { lte: now } } },
        clockOuts: { none: { clockAt: { lte: now } } },
      },
    });
    return clocks.length;
  }

  //   static async getOffEmployeesCount(organizationId: string) {
  //     const today = new Date();
  //     const leaves = await prisma.leave.findMany({
  //       where: {
  //         project: { organizationId },
  //         status: "APPROVED",
  //         startDate: { lte: today },
  //         endDate: { gte: today },
  //       },
  //     });
  //     const offUserIds = new Set<string>();
  //     leaves.forEach((l) => l.assignees.forEach((a) => offUserIds.add(a.userId)));
  //     return offUserIds.size;
  //   }
  // Get late arrivals and early departures
  static async getShiftTimingIssues(organizationId: string) {
    const shifts = await prisma.shift.findMany({
      where: { organizationId },
      include: { clock: { include: { clockIns: true, clockOuts: true } } },
    });

    const issues = shifts.map((s) => {
      const firstClockIn = s.clock[0]?.clockIns[0]?.clockAt;
      const lastClockOut = s.clock[0]?.clockOuts[0]?.clockAt;
      return {
        shiftId: s.id,
        userId: s.userId,
        lateBy: firstClockIn
          ? Math.max(
              0,
              (firstClockIn.getTime() - s.startTime.getTime()) / 60000
            )
          : null,
        leftEarlyBy:
          lastClockOut && s.endTime
            ? Math.max(
                0,
                (s.endTime.getTime() - lastClockOut.getTime()) / 60000
              )
            : null,
      };
    });

    return issues.filter((i) => i.lateBy || i.leftEarlyBy);
  }

  // ------------------- TASK METRICS -------------------

  // Get tasks grouped by status
  static async getTaskStatusSummary(organizationId: string) {
    const tasks = await prisma.task.findMany({
      where: { project: { organizationId } },
      include: { assignees: true, project: true },
    });

    const summary: Record<string, number> = {
      OPEN: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
    };
    tasks.forEach((t) => {
      summary[t.status] = (summary[t.status] || 0) + 1;
    });

    return summary;
  }

  // Get overdue tasks
  static async getOverdueTasks(organizationId: string) {
    const now = new Date();
    return prisma.task.findMany({
      where: {
        project: { organizationId },
        dueTime: { lt: now },
        status: { not: "COMPLETED" },
      },
      include: { assignees: true, project: true, createdBy: true },
    });
  }

  // Tasks per user
  static async getTaskWorkloadPerUser(organizationId: string) {
    const tasks = await prisma.task.findMany({
      where: { project: { organizationId } },
      include: { assignees: true },
    });

    const workload: Record<string, number> = {};
    tasks.forEach((t) =>
      t.assignees.forEach(
        (a) => (workload[a.userId] = (workload[a.userId] || 0) + 1)
      )
    );
    return workload;
  }

  // ------------------- LEAVE METRICS -------------------

  // Get leaves by status
  static async getLeaveSummary(organizationId: string) {
    const leaves = await prisma.leave.findMany({
      where: { project: { organizationId } },
    });

    const summary: Record<string, number> = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      CANCELLED: 0,
    };
    leaves.forEach((l) => {
      summary[l.status] = (summary[l.status] || 0) + 1;
    });

    return summary;
  }

  // Leaves per user
  static async getLeavesPerUser(organizationId: string) {
    const leaves = await prisma.leave.findMany({
      where: { project: { organizationId } },
      include: { assignees: true },
    });

    const perUser: Record<string, number> = {};
    leaves.forEach((l) => {
      l.assignees.forEach((a) => {
        perUser[a.userId] = (perUser[a.userId] || 0) + 1;
      });
    });

    return perUser;
  }

  // Leaves by type (VACATION, SICK, etc.)
  static async getLeaveByType(organizationId: string) {
    const leaves = await prisma.leave.findMany({
      where: { project: { organizationId } },
    });

    const summary: Record<string, number> = {};
    leaves.forEach((l) => {
      summary[l.type] = (summary[l.type] || 0) + 1;
    });

    return summary;
  }

  // ------------------- CROSS-METRICS -------------------

  // Compare shifts worked vs tasks completed per user
  static async getUserProductivity(organizationId: string) {
    const [shifts, tasks] = await Promise.all([
      prisma.shift.findMany({ where: { organizationId } }),
      prisma.task.findMany({
        where: { project: { organizationId } },
        include: { assignees: true },
      }),
    ]);

    const productivity: Record<string, { shifts: number; tasks: number }> = {};
    shifts.forEach((s) => {
      if (!productivity[s.userId])
        productivity[s.userId] = { shifts: 0, tasks: 0 };
      productivity[s.userId]!.shifts += 1;
    });
    tasks.forEach((t) => {
      t.assignees.forEach((a) => {
        if (!productivity[a.userId])
          productivity[a.userId] = { shifts: 0, tasks: 0 };
        productivity[a.userId]!.tasks += 1;
      });
    });
    return productivity;
  }

  static async getDailyShiftCount(organizationId: string, days: number = 7) {
    const start = new Date();
    start.setDate(start.getDate() - days + 1);

    const shifts = await prisma.shift.findMany({
      where: { organizationId, startTime: { gte: start } },
      select: { startTime: true },
    });

    const dailyCount: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const key = day.toISOString().slice(0, 10);
      dailyCount[key] = shifts.filter(
        (s) => s.startTime.toISOString().slice(0, 10) === key
      ).length;
    }
    return dailyCount;
  }
}

export default DataService;
