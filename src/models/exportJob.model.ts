import { ExportFormat, ExportStatus } from "./enums";

export interface ExportJob {
  id: string;
  organizationId: string;
  requestedById?: string;
  format: ExportFormat;
  status: ExportStatus;
  filtersJson?: string;
  fileId?: string;
  createdAt: Date;
  completedAt?: Date;
  errorMessage?: string;
}
