// src/modules/user/organization.user.service.ts
import { prisma } from "../../utils/prisma.utils";

interface GetAllUsersOptions {
  organizationId: string;
  page?: number | undefined;
  pageSize?: number | undefined;
  search?: string | undefined;
}

export class OrganizationUserService {
  static async getAllUsersForOrganization(options: GetAllUsersOptions) {
    const { organizationId, page = 1, pageSize = 20, search } = options;
    const skip = (page - 1) * pageSize;

    const whereClause: any = { organizationId };
    if (search) {
      whereClause.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          isEmailVerified: true,
          isDeactivated: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return {
      users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
