export interface Shift {
  id: string;
  userId: string;
  organizationId: string;
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}
