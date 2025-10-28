export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";
export type PlanTier = "FREE" | "PRO" | "ENTERPRISE";
export type SubscriptionStatus = "ACTIVE" | "INACTIVE" | "CANCELED" | "TRIAL";
export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
export type ExportFormat = "CSV" | "PDF";
export type ExportStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
export type PayrollStatus =
  | "PENDING"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED"
  | "PAID";
export type PaymentProviderType = "STRIPE" | "OTHER";
