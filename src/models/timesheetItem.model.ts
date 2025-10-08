export interface TimesheetItem {
  id: string;
  timesheetId: string;
  timeEntryId: string;
  seconds: number;
  createdAt: Date;
}
