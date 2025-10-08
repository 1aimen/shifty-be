export interface PaymentProvider {
  id: string;
  organizationId: string;
  type: PaymentProviderType;
  configJson: string;
  createdAt: Date;
}
