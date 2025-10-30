// src/modules/organization/organization.service.ts
import {
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
} from "./organization.dto";
import { prisma } from "../../utils/prisma.utils";
import { AppError } from "../../middlewares/error.middleware";
import { moduleLogger } from "../../utils/modulelogger.utils";

const logger = moduleLogger("OrganizationService");
export class OrganizationService {
  // ─── Create organization (only admin) ───
  static async createOrganization(userId: string, data: CreateOrganizationDTO) {
    // Verify user role
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "ADMIN") {
      throw new AppError(
        "You are not authorized to create an organization",
        403
      );
    }

    const now = new Date();
    const org = await prisma.organization.create({
      data: {
        name: data.name,
        createdAt: now,
        updatedAt: now,
        user: { connect: { id: userId } }, // admin becomes member
      },
    });

    await prisma.organizationsettings.create({
      data: {
        organizationId: org.id,
        timezone: "Europe/Paris",
        weekStartDay: 1,
        requireGeo: false,
        requireDeviceLock: false,
        minimumClockSeconds: null,
        updatedAt: new Date(),
      },
    });
    return org;
  }

  // ─── Update organization ───
  static async updateOrganization(orgId: string, data: UpdateOrganizationDTO) {
    const org = await prisma.organization.update({
      where: { id: orgId },
      data: { ...data, updatedAt: new Date() },
    });
    return org;
  }

  // ─── Get organization with projects & invitations ───
  static async getOrganization(orgId: string) {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        project: true,
        organizationinvitation: true,
        organizationsettings: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
    if (!org) throw new AppError("Organization not found", 404);
    return org;
  }

  static async deleteOrganization(orgId: string, userId: string) {
    // Verify user role (only ADMIN can delete)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "ADMIN") {
      throw new AppError(
        "You are not authorized to delete this organization",
        403
      );
    }

    // Check if organization exists
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new AppError("Organization not found", 404);

    // Delete organization (cascade deletes related records)
    await prisma.organization.delete({ where: { id: orgId } });

    return { message: "Organization deleted successfully" };
  }
}
