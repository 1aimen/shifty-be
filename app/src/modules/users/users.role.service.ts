// src/modules/userrole/userrole.service.ts
import { prisma } from "../../utils/prisma.utils";
import { AppError } from "../../middlewares/error.middleware";
import { UserRole } from "../../models/enums";

export class UserRoleService {
  static async updateUserRole(
    adminId: string,
    targetUserId: string,
    newRole: UserRole
  ) {
    // 1. Verify role validity
    const validRoles: UserRole[] = ["ADMIN", "MANAGER", "EMPLOYEE"];
    if (!validRoles.includes(newRole)) {
      throw new AppError(
        "Invalid role. Allowed: ADMIN, MANAGER, EMPLOYEE",
        400
      );
    }

    // 2. Verify admin privileges
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      include: { organization: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      throw new AppError("Only admins can change roles", 403);
    }

    // 3. Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new AppError("User not found", 404);
    }

    // 4. Ensure same organization
    if (admin.organizationId !== targetUser.organizationId) {
      throw new AppError(
        "You can only manage users within your organization",
        403
      );
    }

    // 5. Update role
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole, updatedAt: new Date() },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        organizationId: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}
