import { Decimal } from "@prisma/client/runtime/library";

export interface Payout {
  id: string;
  organizationId: string;
  providerId: string;
  providerPayoutId?: string;
  amount: Decimal;
  currency: string;
  status: string;
  createdAt: Date;
  processedAt?: Date;
}
