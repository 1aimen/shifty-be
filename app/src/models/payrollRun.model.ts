import { Decimal } from "@prisma/client/runtime/library";
import { PayrollStatus } from "./enums";

export interface PayrollRun {
  id: string;
  organizationId: string;
  periodStart: Date;
  periodEnd: Date;
  status: PayrollStatus;
  totalAmount?: Decimal;
  currency: string;
  createdAt: Date;
  processedAt?: Date;
  paymentProviderId?: string;
  payoutId?: string;
  createdById?: string;
}
