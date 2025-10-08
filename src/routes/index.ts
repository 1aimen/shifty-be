import { Router } from "express";
import { healthCheckController } from "../modules/healthcheck/healthcheck.controller";
import { config } from "../config/index";

const API_VERSION = config.api_version;
const router = Router();
// healthcheck
router.get(`/${API_VERSION}/healthcheck`, healthCheckController);

// authentication
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
