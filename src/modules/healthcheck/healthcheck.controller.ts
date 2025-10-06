import type { Request, Response } from "express";
import { getHealthStatus } from "./healthcheck.service";

export const healthCheck = (req: Request, res: Response) => {
  const status = getHealthStatus();
  res.json(status);
};
