import { prisma } from "../../utils/prisma.utils";
import { AppError } from "../../middlewares/error.middleware";

export class UserPreferencesService {
  static async getPreferences(userId: string) {
    const preferences = await prisma.userpreferences.findUnique({
      where: { userId },
    });

    if (!preferences) throw new AppError("Preferences not found", 404);

    return preferences;
  }

  static async updatePreferences(
    userId: string,
    data: Partial<{
      language: string;
      darkMode: boolean;
      notifications: boolean;
    }>
  ) {
    const existing = await prisma.userpreferences.findUnique({
      where: { userId },
    });

    if (!existing) throw new AppError("Preferences not found", 404);

    const updated = await prisma.userpreferences.update({
      where: { userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return updated;
  }
}
