export interface Timesheet {
  id: string;
  organizationId: string;
  userId: string;
  periodStart: Date;
  periodEnd: Date;
  totalSeconds: number;
  approved: boolean;
  approvedById?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
