import { Router } from "express";
import { healthCheckController } from "../modules/healthcheck/healthcheck.controller";
import { config } from "../config/index";
import authRoutes from "../modules/auth/auth.route";
import {
  loginController,
  registerController,
} from "../modules/auth/auth.controller";
import {
  createOrganizationController,
  deleteOrganizationController,
  getOrganizationController,
  updateOrganizationController,
} from "../modules/organization/organization.controller";
import { authMiddleware } from "../middlewares/authentication.middleware";
import { authorize } from "../middlewares/authorization.middleware";
import {
  createProjectController,
  deleteProjectController,
  getProjectController,
  listProjectsController,
  updateProjectController,
} from "../modules/project/project.controller";
import { inviteUserToOrganizationController } from "../modules/organization/organization.invitation.controller";
import {
  getOrganizationSettingsController,
  updateOrganizationSettingsController,
} from "../modules/organization/organization.settings.controller";

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
/**
 * Create a new organization
 * POST /api/v1/organizations
 */
router.post(
  "/api/v1/organizations",
  authMiddleware,
  authorize("ADMIN"), // pass allowed roles here
  createOrganizationController
);
/**
 * Get organization by ID
 * GET /api/v1/organizations/:orgId
 */
router.get(
  "/api/v1/organizations/:orgId",
  authMiddleware,
  authorize("ADMIN"),
  getOrganizationController
);
/**
 * Update organization by ID
 * PUT /api/v1/organizations/:orgId
 */
router.put(
  "/api/v1/organizations/:orgId",
  authMiddleware,
  authorize("ADMIN"),
  updateOrganizationController
);
/**
 * Delete organization by ID
 * DELETE /api/v1/organizations/:orgId
 */
router.delete(
  "/api/v1/organizations/:orgId",
  authMiddleware,
  authorize("ADMIN"),
  deleteOrganizationController
);

// organization settings

router.get(
  "/api/v1/organizations/:orgId/settings",
  authMiddleware,
  authorize("ADMIN"),
  getOrganizationSettingsController
);

router.put(
  "/api/v1/organizations/:orgId/settings",
  authMiddleware,
  authorize("ADMIN"),
  updateOrganizationSettingsController
);

// projects

// Projects under organization
router.post(
  "/api/v1/organizations/:orgId/projects",
  authMiddleware,
  authorize("ADMIN"),
  createProjectController
);
router.get("/organizations/:orgId/projects", listProjectsController);

// Project-specific operations
router.get(
  "/api/v1/projects/:projectId",
  authMiddleware,
  authorize("ADMIN"),
  getProjectController
);
router.put(
  "/api/v1/projects/:projectId",
  authMiddleware,
  authorize("ADMIN"),
  updateProjectController
);
router.delete(
  "/api/v1/projects/:projectId",
  authMiddleware,
  authorize("ADMIN"),
  deleteProjectController
);

// users
// POST /api/v1/organizations/:orgId/invite
router.post(
  "/api/v1/organizations/:orgId/invite",
  authMiddleware,
  inviteUserToOrganizationController
);
// shifts
// clock-in
// clock-out
// geolocation
// reports
// notifications
// dashboard

export default router;
