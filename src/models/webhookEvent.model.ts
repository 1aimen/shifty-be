export interface WebhookEvent {
  id: string;
  organizationId?: string;
  provider: string;
  eventType: string;
  payloadJson: string;
  receivedAt: Date;
  processed: boolean;
}
