export interface PaymentMethod {
  id: string;
  userId?: string;
  organizationId?: string;
  provider: string;
  providerMethodId: string;
  label?: string;
  createdAt: Date;
}
