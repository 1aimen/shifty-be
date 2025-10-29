// src/modules/project/project.service.ts
import { prisma } from "../../utils/prisma.utils";
import { CreateProjectDTO, UpdateProjectDTO } from "./project.dto";
import { AppError } from "../../middlewares/error.middleware";
import { moduleLogger } from "../../utils/modulelogger.utils";

const logger = moduleLogger("ProjectService");

export class ProjectService {
  // ─── Create project under an organization ───
  static async createProject(orgId: string, data: CreateProjectDTO) {
    // Check if organization exists
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new AppError("Organization not found", 404);

    const now = new Date();
    const project = await prisma.project.create({
      data: {
        ...data,
        organizationId: orgId,
        createdAt: now,
        updatedAt: now,
      },
    });

    return project;
  }

  // ─── Update project ───
  static async updateProject(projectId: string, data: UpdateProjectDTO) {
    const project = await prisma.project.update({
      where: { id: projectId },
      data: { ...data, updatedAt: new Date() },
    });
    return project;
  }

  // ─── Get a project ───
  static async getProject(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { organization: true },
    });
    if (!project) throw new AppError("Project not found", 404);
    return project;
  }

  // ─── Delete project ───
  static async deleteProject(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) throw new AppError("Project not found", 404);

    await prisma.project.delete({ where: { id: projectId } });
    return { message: "Project deleted successfully" };
  }

  // ─── List projects under an organization ───
  static async listProjects(orgId: string) {
    const projects = await prisma.project.findMany({
      where: { organizationId: orgId },
    });
    return projects;
  }
}
