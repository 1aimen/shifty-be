import crypto from "crypto";
import { prisma } from "../../utils/prisma.utils";

export class InvitationService {
  static async inviteUserToOrganization(
    invitedById: string,
    organizationId: string,
    email: string,
    role: string = "EMPLOYEE"
  ) {
    // 1. Check if the user already exists in the organization
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.organizationId === organizationId) {
      throw new Error("User is already part of this organization.");
    }

    // 2. Check for an existing pending invitation
    const existingInvitation = await prisma.organizationinvitation.findFirst({
      where: { email, organizationId, status: "PENDING" },
    });
    if (existingInvitation) {
      throw new Error("An active invitation already exists for this user.");
    }

    // 3. Create unique token and expiration (48 hours from now)
    const token = crypto.randomBytes(20).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    // 4. Create invitation
    const invitation = await prisma.organizationinvitation.create({
      data: {
        email,
        organizationId,
        invitedById,
        role: role as any,
        token,
        expiresAt,
      },
    });

    // TODO: send email with invitation link (e.g., `${process.env.FRONTEND_URL}/invite/${token}`)

    return {
      message: "Invitation created successfully.",
      invitation,
    };
  }
}
