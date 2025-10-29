import { Request, Response } from "express";
import { getHealthStatus } from "./healthcheck.service";

/**
 * @swagger
 * tags:
 *   name: Healthcheck
 *   description: API to check server health
 */

/**
 * @swagger
 * /api/v1/healthcheck:
 *   get:
 *     summary: Get server health status
 *     tags: [Healthcheck]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 uptime:
 *                   type: number
 *                 timestamp:
 *                   type: string
 *                 system:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     platform:
 *                       type: string
 *                     arch:
 *                       type: string
 *                     uptime:
 *                       type: number
 *                     load:
 *                       type: array
 *                       items:
 *                         type: number
 *                     memory:
 *                       type: object
 *                       properties:
 *                         free:
 *                           type: number
 *                         total:
 *                           type: number
 */
export async function healthCheckController(req: Request, res: Response) {
  try {
    const status = await getHealthStatus();
    res.status(200).json(status);
  } catch (error) {
    console.error("Healthcheck error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
