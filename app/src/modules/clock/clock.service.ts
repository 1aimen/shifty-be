import { AppError } from "../../middlewares/error.middleware";
import { prisma } from "../../utils/prisma.utils";
import { QRCodeUtils } from "../../utils/qrcode.utils";

export const ClockService = {
  async createClockIn(
    shiftId: string,
    userId: string,
    createdById: string,
    data: any
  ) {
    // Find or create a clock for this shift and user
    let clock = await prisma.clock.findFirst({
      where: { shiftId, userId },
    });

    if (!clock) {
      clock = await prisma.clock.create({
        data: {
          shiftId,
          userId,
          createdById,
        },
      });
    }

    const clockIn = await prisma.clockIn.create({
      data: {
        clockId: clock.id,
        clockAt: data.clockAt ?? new Date(),
        method: data.method,
        latitude: data.latitude,
        longitude: data.longitude,
        ipAddress: data.ipAddress,
        device: data.device,
      },
    });

    return prisma.clock.findUnique({
      where: { id: clock.id },
      include: { clockIns: true, clockOuts: true },
    });
  },

  async createClockOut(shiftId: string, userId: string, data: any) {
    // Find existing clock for this shift and user
    const clock = await prisma.clock.findFirst({
      where: { shiftId, userId },
    });

    if (!clock) throw new AppError("Clock not found for this shift/user");

    const clockOut = await prisma.clockOut.create({
      data: {
        clockId: clock.id,
        clockAt: data.clockAt ?? new Date(),
        method: data.method,
        latitude: data.latitude,
        longitude: data.longitude,
        ipAddress: data.ipAddress,
        device: data.device,
      },
    });

    return prisma.clock.findUnique({
      where: { id: clock.id },
      include: { clockIns: true, clockOuts: true },
    });
  },

  async getClocksByShift(shiftId: string) {
    return prisma.clock.findMany({
      where: { shiftId },
      include: { clockIns: true, clockOuts: true },
    });
  },

  async updateClock(clockId: string, data: any) {
    return prisma.clock.update({
      where: { id: clockId },
      data,
    });
  },

  async generateQRCodeForClock(shiftId: string, userId: string) {
    // Find or create a clock for this user in this shift
    let clock = await prisma.clock.findFirst({ where: { shiftId, userId } });
    if (!clock) {
      clock = await prisma.clock.create({
        data: { shiftId, userId, createdById: userId },
      });
    }

    // Generate QR code
    return QRCodeUtils.generateQRCodeBase64(clock.id, shiftId, userId);
  },

  async clockInWithQRCode(
    clockId: string,
    shiftId: string,
    userId: string,
    data: any
  ) {
    const clock = await prisma.clock.findFirst({
      where: { id: clockId, shiftId, userId },
    });
    if (!clock) throw new AppError("Clock not found for this shift/user");

    await prisma.clockIn.create({
      data: {
        clockId: clock.id,
        clockAt: data.clockAt ?? new Date(),
        method: "QR",
        latitude: data.latitude,
        longitude: data.longitude,
        ipAddress: data.ipAddress,
        device: data.device,
      },
    });

    return prisma.clock.findUnique({
      where: { id: clock.id },
      include: { clockIns: true, clockOuts: true },
    });
  },
};
