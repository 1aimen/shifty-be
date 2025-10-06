import { Router } from "express";
import { healthCheck } from "../modules/healthcheck/healthcheck.controller";
import { config } from "../config/index";

const API_VERSION = config.api_version;
const router = Router();
// healthcheck
router.get(`/${API_VERSION}/healthcheck`, healthCheck);

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
