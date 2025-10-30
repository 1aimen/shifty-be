// src/modules/leaves/leave.service.ts
import { prisma } from "../../utils/prisma.utils";
import { AppError } from "../../middlewares/error.middleware";

export class LeaveService {
  static async createLeaves(
    projectId: string,
    userId: string,
    role: string,
    leaves: any[]
  ) {
    const createdLeaves = [];

    for (const leave of leaves) {
      let targetUserId = leave.userId;

      if (role === "EMPLOYEE") {
        if (leave.userId && leave.userId !== userId)
          throw new AppError(
            "Employees can only assign leaves to themselves",
            403
          );
        targetUserId = userId;
      } else if (role === "MANAGER") {
        // Verify manager is part of the project
        const projectUser = await prisma.projectUser.findFirst({
          where: { projectId, userId },
        });
        if (!projectUser)
          throw new AppError("Manager not assigned to this project", 403);
      }

      const newLeave = await prisma.leave.create({
        data: {
          projectId,
          createdById: userId,
          userId: role === "EMPLOYEE" ? userId : leave.userId ?? null,
          title: leave.title,
          description: leave.description,
          type: leave.type,
          startDate: leave.startDate,
          endDate: leave.endDate,
          status: leave.status ?? "PENDING",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      createdLeaves.push(newLeave);
    }

    return createdLeaves;
  }

  static async assignUsersToLeave(
    leaveId: string,
    userIds: string[],
    role: string
  ) {
    if (!["ADMIN", "MANAGER"].includes(role))
      throw new AppError("Not authorized", 403);

    const leave = await prisma.leave.findUnique({ where: { id: leaveId } });
    if (!leave) throw new AppError("Leave not found", 404);

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    if (users.length !== userIds.length)
      throw new AppError("Some users not found", 400);

    // 👇 Instead of creating leaves, we create entries in leaveAssignee
    const assigned = await prisma.$transaction(
      users.map((user) =>
        prisma.leaveAssignee.upsert({
          where: { leaveId_userId: { leaveId, userId: user.id } },
          update: {},
          create: { leaveId, userId: user.id },
        })
      )
    );

    return assigned;
  }

  static async updateLeave(
    leaveId: string,
    role: string,
    userId: string,
    data: any
  ) {
    const leave = await prisma.leave.findUnique({ where: { id: leaveId } });
    if (!leave) throw new AppError("Leave not found", 404);

    if (role === "EMPLOYEE" && leave.userId !== userId)
      throw new AppError("You can only update your own leave", 403);

    return prisma.leave.update({
      where: { id: leaveId },
      data: { ...data, updatedAt: new Date() },
    });
  }

  static async getLeave(leaveId: string, role: string, userId: string) {
    const leave = await prisma.leave.findUnique({
      where: { id: leaveId },
      include: {
        project: true,
        assignees: { include: { user: true } },
        createdBy: true,
      },
    });

    if (!leave) throw new AppError("Leave not found", 404);

    if (role === "EMPLOYEE") {
      const isAssigned = leave.assignees.some((a) => a.userId === userId);
      if (!isAssigned)
        throw new AppError("You can only view your own leave", 403);
    }

    return leave;
  }

  static async getLeaves(projectId: string, role: string, userId: string) {
    const where: any = { projectId };

    if (role === "EMPLOYEE") {
      // Only leaves where employee is assigned
      return prisma.leave.findMany({
        where: {
          projectId,
          assignees: { some: { userId } },
        },
        include: {
          assignees: { include: { user: true } },
          createdBy: true,
        },
        orderBy: { startDate: "asc" },
      });
    }

    if (role === "MANAGER") {
      // Check if manager belongs to this project
      const managerProject = await prisma.projectUser.findFirst({
        where: { projectId, userId },
      });
      if (!managerProject)
        throw new AppError("Manager not assigned to this project", 403);
    }

    // Admins and Managers can see all leaves under the project
    return prisma.leave.findMany({
      where,
      include: {
        assignees: { include: { user: true } },
        createdBy: true,
      },
      orderBy: { startDate: "asc" },
    });
  }
}
