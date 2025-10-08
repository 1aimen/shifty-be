import { InvitationStatus, UserRole } from "./enums";

export interface OrganizationInvitation {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  status: InvitationStatus;
  organizationId: string;
  invitedById?: string;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
}
