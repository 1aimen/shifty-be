// src/modules/shift/shift.service.ts
import { prisma } from "../../utils/prisma.utils";
import { AppError } from "../../middlewares/error.middleware";

export class ShiftService {
  // ─── Create one or multiple shifts ───
  static async createShifts(
    orgId: string,
    shifts: Array<{ userId: string; startTime: Date; endTime?: Date }>
  ) {
    const createdShifts = [];
    for (const s of shifts) {
      const shift = await prisma.shift.create({
        data: {
          userId: s.userId,
          organizationId: orgId,
          startTime: s.startTime,
          endTime: s.endTime ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      createdShifts.push(shift);
    }
    return createdShifts;
  }

  // ─── Assign multiple users to a shift ───
  static async assignUsersToShift(shiftId: string, userIds: string[]) {
    const shift = await prisma.shift.findUnique({ where: { id: shiftId } });
    if (!shift) throw new AppError("Shift not found", 404);

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    const missingUserIds = userIds.filter(
      (id) => !users.some((u) => u.id === id)
    );
    if (missingUserIds.length)
      throw new AppError(`Users not found: ${missingUserIds.join(", ")}`, 400);

    // We'll create individual shifts for each user (if your model needs that)
    const assignedShifts = [];
    for (const user of users) {
      const newShift = await prisma.shift.create({
        data: {
          userId: user.id,
          organizationId: shift.organizationId,
          startTime: shift.startTime,
          endTime: shift.endTime ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      assignedShifts.push(newShift);
    }

    return assignedShifts;
  }

  // ─── Update shift ───
  static async updateShift(
    shiftId: string,
    data: { startTime?: Date; endTime?: Date }
  ) {
    const shift = await prisma.shift.update({
      where: { id: shiftId },
      data: { ...data, endTime: data.endTime ?? null, updatedAt: new Date() },
    });
    return shift;
  }

  // ─── Get a single shift ───
  static async getShift(shiftId: string) {
    const shift = await prisma.shift.findUnique({
      where: { id: shiftId },
      include: { user: true },
    });
    if (!shift) throw new AppError("Shift not found", 404);
    return shift;
  }

  // ─── Get all shifts under a project/organization ───
  static async getShifts(orgId: string, managerId?: string) {
    const where: any = { organizationId: orgId };
    if (managerId) {
      // Managers see only their shifts
      where.userId = managerId;
    }
    const shifts = await prisma.shift.findMany({
      where,
      include: { user: true },
      orderBy: { startTime: "asc" },
    });
    return shifts;
  }

  // ─── Get shift settings ───
  static async getShiftSettings(orgId: string) {
    const settings = await prisma.organizationsettings.findUnique({
      where: { organizationId: orgId },
    });
    if (!settings) throw new AppError("Settings not found", 404);
    return settings;
  }

  // ─── Update shift settings ───
  static async updateShiftSettings(orgId: string, data: Partial<any>) {
    const updated = await prisma.organizationsettings.update({
      where: { organizationId: orgId },
      data: { ...data, updatedAt: new Date() },
    });
    return updated;
  }
}
