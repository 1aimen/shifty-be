// src/modules/organization/organization.dto.ts

// ─── Requests ──────────────────────────────
export interface CreateOrganizationDTO {
  name: string;
}

export interface UpdateOrganizationDTO {
  name?: string;
}

export interface InviteUserDTO {
  email: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE";
  expiresAt: Date;
}

export interface CreateProjectDTO {
  name: string;
  description?: string;
}

// ─── Responses ─────────────────────────────
export interface OrganizationDTO {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectDTO {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvitationDTO {
  id: string;
  email: string;
  role: string;
  status: string;
  token: string;
  expiresAt: Date;
}
