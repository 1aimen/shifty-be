export interface AuditLog {
  id: string;
  organizationId?: string;
  userId?: string;
  action: string;
  resource?: string;
  description?: string;
  metaJson?: string;
  createdAt: Date;
}
