import { Request, Response } from "express";
import { getHealthStatus } from "./healthcheck.service";

export async function healthCheckController(req: Request, res: Response) {
  try {
    const status = await getHealthStatus();
    res.status(200).json(status);
  } catch (error) {
    console.error("Healthcheck error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
