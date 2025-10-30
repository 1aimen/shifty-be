import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { InvitationService } from "./organization.invitation.service";

/**
 * @swagger
 * /api/v1/organizations/{orgId}/invite:
 *   post:
 *     summary: Invite a user to an organization
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *               role:
 *                 type: string
 *                 example: "EMPLOYEE"
 *     responses:
 *       201:
 *         description: Invitation sent successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Not authorized
 */
export const inviteUserToOrganizationController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id: userId, role } = req.user!;
    if (role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { orgId } = req.params;
    const { email, role: invitedRole } = req.body;

    const result = await InvitationService.inviteUserToOrganization(
      userId,
      orgId!,
      email,
      invitedRole
    );

    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
