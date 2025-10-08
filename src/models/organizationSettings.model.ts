export interface OrganizationSettings {
  id: string;
  organizationId: string;
  timezone: string;
  weekStartDay: number;
  requireGeo: boolean;
  requireDeviceLock: boolean;
  minimumClockSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}
