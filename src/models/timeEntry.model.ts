export interface TimeEntry {
  id: string;
  userId: string;
  projectId?: string;
  organizationId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  description?: string;
  adhoc: boolean;
  createdAt: Date;
}
