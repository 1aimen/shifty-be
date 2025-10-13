import { Router } from "express";
import { healthCheckController } from "../modules/healthcheck/healthcheck.controller";
import { config } from "../config/index";
import authRoutes from "../modules/auth/auth.route";

const API_VERSION = config.api_version;
const router = Router();
// healthcheck
/**
 * @swagger
 * /api/v1/healthcheck:
 *   get:
 *     summary: Get system health status
 *     tags:
 *       - Healthcheck
 *     responses:
 *       200:
 *         description: System is healthy
 *       500:
 *         description: Internal server error
 */
router.get(`/${API_VERSION}/healthcheck`, healthCheckController);

// authentication
router.use(authRoutes);

// authorization
// admin
// organization
// users
// shifts
// clock-in
// clock-out
// geolocation
// reports
// notifications
// dashboard

export default router;
