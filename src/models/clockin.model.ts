export interface ClockIn {
  id: string;
  shiftId: string;
  clockInAt: Date;
  clockOutAt?: Date;
  method?: string;
  latitude?: number;
  longitude?: number;
  ipAddress?: string;
  geoCountry?: string;
  geoCity?: string;
  device?: string;
  createdAt: Date;
}
