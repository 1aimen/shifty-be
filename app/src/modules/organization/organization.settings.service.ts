import { prisma } from "../../utils/prisma.utils";

export class OrganizationSettingsService {
  static async getSettings(orgId: string) {
    const settings = await prisma.organizationsettings.findUnique({
      where: { organizationId: orgId },
    });

    if (!settings) {
      throw new Error("Settings not found for this organization");
    }

    return settings;
  }

  static async updateSettings(
    orgId: string,
    data: Partial<{
      timezone: string;
      weekStartDay: number;
      requireGeo: boolean;
      requireDeviceLock: boolean;
      minimumClockSeconds: number | null;
    }>
  ) {
    const existing = await prisma.organizationsettings.findUnique({
      where: { organizationId: orgId },
    });

    if (!existing) {
      throw new Error("Settings not found for this organization");
    }

    const updated = await prisma.organizationsettings.update({
      where: { organizationId: orgId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return updated;
  }
}
