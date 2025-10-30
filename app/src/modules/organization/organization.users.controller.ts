// src/modules/user/user.controller.ts
import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { OrganizationUserService } from "./organization.users.service";

/**
 * @swagger
 * /api/v1/organizations/{orgId}/users:
 *   get:
 *     summary: View all users under an organization (Admin only)
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Organization ID
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: pageSize
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *           description: Search by username or email
 *     responses:
 *       200:
 *         description: List of users with pagination info
 */
export const getAllUsersController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { orgId } = req.params;
    const { page, pageSize, search } = req.query;

    if (!orgId)
      return res.status(400).json({ message: "organizationId is required" });

    // Only admins can view users
    if (req.user!.role !== "ADMIN")
      return res.status(403).json({ message: "Forbidden: Admins only" });

    // Ensure the admin belongs to this organization
    if (req.user!.organizationId !== orgId)
      return res.status(403).json({ message: "Forbidden" });

    const result = await OrganizationUserService.getAllUsersForOrganization({
      organizationId: orgId,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      search: search as string | undefined,
    });

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
