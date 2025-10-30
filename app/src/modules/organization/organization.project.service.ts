import { prisma } from "../../utils/prisma.utils";
import { AppError } from "../../middlewares/error.middleware";

export class OrganizationProjectManagement {
  static async duplicateProject(projectId: string, targetOrgId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { timeentry: true },
    });
    if (!project) throw new AppError("Project not found", 404);

    const duplicatedProject = await prisma.project.create({
      data: {
        name: project.name + "_copy",
        description: project.description,
        organizationId: targetOrgId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (project.timeentry.length > 0) {
      await prisma.timeentry.createMany({
        data: project.timeentry.map((te) => ({
          userId: te.userId,
          projectId: duplicatedProject.id,
          organizationId: targetOrgId,
          startTime: te.startTime,
          endTime: te.endTime,
          duration: te.duration,
          description: te.description,
          adhoc: te.adhoc,
          createdAt: new Date(),
        })),
      });
    }

    return duplicatedProject;
  }

  static async moveProject(projectId: string, targetOrgId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new AppError("Project not found", 404);

    const movedProject = await prisma.project.update({
      where: { id: projectId },
      data: { organizationId: targetOrgId, updatedAt: new Date() },
    });

    return movedProject;
  }
}
