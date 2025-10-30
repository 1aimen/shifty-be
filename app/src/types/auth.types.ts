import { Request } from "express";

export type AuthRequest = Request & {
  user?: {
    id: string;
    role: string;
    organizationId: string;
  };
};
