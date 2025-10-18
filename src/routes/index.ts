import { Router } from "express";
import { healthCheckController } from "../modules/healthcheck/healthcheck.controller";
import { config } from "../config/index";
import authRoutes from "../modules/auth/auth.route";
import {
  loginController,
  registerController,
} from "../modules/auth/auth.controller";

const API_VERSION = config.api_version;
const router = Router();

// healthcheck
router.get(`/${API_VERSION}/healthcheck`, healthCheckController);
router.post("/api/v1/auth/register", registerController);
router.post("/api/v1/auth/login", loginController);

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
