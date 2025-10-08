import { Decimal } from "@prisma/client/runtime/library";

export interface PayrollItem {
  id: string;
  payrollRunId?: string;
  timesheetId?: string;
  userId: string;
  grossAmount: Decimal;
  taxAmount?: Decimal;
  netAmount: Decimal;
  currency: string;
  createdAt: Date;
}
