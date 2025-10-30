// src/modules/project/project.dto.ts

// ─── Requests ──────────────────────────────
export interface CreateProjectDTO {
  name: string;
  description?: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
}

// ─── Responses ─────────────────────────────
export interface ProjectDTO {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}
