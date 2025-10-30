// src/modules/projects/project-user.service.ts
import { prisma } from "../../utils/prisma.utils";

export class ProjectUserService {
  // Assign one or multiple users to a project
  static async assignUsersToProject(
    projectId: string,
    userIds: string[] | string
  ) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new Error("Project not found");

    // Normalize input: convert single string to array
    const userIdsArray = Array.isArray(userIds) ? userIds : [userIds];

    // Fetch all valid users
    const users = await prisma.user.findMany({
      where: { id: { in: userIdsArray } },
    });

    // Detect missing IDs
    const missingUserIds = userIdsArray.filter(
      (id) => !users.some((u) => u.id === id)
    );
    if (missingUserIds.length) {
      throw new Error(`Users not found: ${missingUserIds.join(", ")}`);
    }

    const assignedUserIds: string[] = [];

    for (const userId of userIdsArray) {
      const existing = await prisma.projectUser.findFirst({
        where: { projectId, userId },
      });
      if (!existing) {
        await prisma.projectUser.create({ data: { projectId, userId } });
        assignedUserIds.push(userId);
      }
    }

    return {
      message: "Users assigned successfully",
      assignedUserIds,
    };
  }

  // Optional: list users of a project
  static async getProjectUsers(projectId: string) {
    const users = await prisma.projectUser.findMany({
      where: { projectId },
      include: { user: true },
    });

    return users.map(
      (u: { user: { id: any; email: any; username: any; role: any } }) => ({
        id: u.user.id,
        email: u.user.email,
        username: u.user.username,
        role: u.user.role,
      })
    );
  }
}
