import { Router } from "express";
import { healthCheckController } from "../modules/healthcheck/healthcheck.controller";
import { config } from "../config/index";
import authRoutes from "../modules/auth/auth.route";
import {
  loginController,
  logoutController,
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
import {
  duplicateProjectController,
  moveProjectController,
} from "../modules/organization/organization.project.controller";
import {
  getUserPreferencesController,
  updateUserPreferencesController,
} from "../modules/settings/settings.controller";
import { updateUserRoleController } from "../modules/users/users.role.controller";
import {
  getPasswordResetLinkController,
  resetPasswordController,
  sendPasswordResetLinkController,
} from "../modules/auth/auth.reset-password.controller";
import { getAllUsersController } from "../modules/organization/organization.users.controller";
import {
  sendVerificationEmailController,
  verifyEmailController,
} from "../modules/auth/auth.email-verification.controller";
import {
  assignUserToProjectController,
  getProjectUsersController,
} from "../modules/project/project.users.controller";
import {
  createShiftsController,
  assignUsersToShiftController,
  updateShiftController,
  getShiftController,
  getShiftsController,
  getShiftSettingsController,
  updateShiftSettingsController,
} from "../modules/shifts/shifts.controller";
import {
  assignUsersToLeaveController,
  getLeaveController,
  getLeavesController,
  updateLeaveController,
} from "../modules/leave/leave.controller";
import {
  clockInController,
  clockOutController,
  generateQRCodeController,
  getShiftClocksController,
  updateClockRulesController,
  validateQRCodeController,
} from "../modules/clock/clock.controller";
import {
  generateOrganizationReportController,
  generatePersonalReportController,
  generateProjectReportController,
  generateShiftReportController,
  scheduleReportController,
} from "../modules/reports/reports.controller";
import {
  assignUsersToTask,
  createTasks,
  getTask,
  getTasks,
  startStopTask,
  updateTask,
  updateTaskSettings,
} from "../modules/tasks/tasks.controller";
const API_VERSION = config.api_version;
const router = Router();

// healthcheck
router.get(`/${API_VERSION}/healthcheck`, healthCheckController);
router.post("/api/v1/auth/register", registerController);
router.post("/api/v1/auth/login", loginController);
router.post("/api/v1/auth/logout", authMiddleware, logoutController);
router.post(
  "/api/v1/auth/email-verification-request",
  sendVerificationEmailController
);
router.post("/api/v1/auth/verify-email", verifyEmailController);

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

/**
 * GET /api/v1/organizations/:orgId/users
 * Only admins can access
 */
router.get(
  "/api/v1/organizations/:orgId/users",
  authMiddleware, // validates JWT & sets req.user
  authorize("ADMIN"),
  getAllUsersController
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
router.get(
  "/api/v1/organizations/:orgId/projects",
  authMiddleware,
  listProjectsController
);

router.post(
  "/api/v1/projects/:projectId/assign-users",
  authMiddleware,
  authorize("ADMIN"),
  assignUserToProjectController
);

// List all users of a project
router.get(
  "/api/v1/projects/:projectId/users",
  authMiddleware,
  authorize("ADMIN"),
  getProjectUsersController
);

/**
 * Only ADMIN can duplicate or move projects
 */
router.post(
  "/api/v1/projects/:projectId/duplicate",
  authMiddleware,
  authorize("ADMIN"),
  duplicateProjectController
);

router.post(
  "/api/v1/projects/:projectId/move",
  authMiddleware,
  authorize("ADMIN"),
  moveProjectController
);

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

/**
 * @route POST /api/v1/organizations/:orgId/shifts
 * @desc Create one or multiple shifts under a project/organization
 * @access Admin, Manager
 */
router.post(
  "/api/v1/organizations/:orgId/shifts",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  createShiftsController
);

/**
 * @route POST /api/v1/shifts/:shiftId/users
 * @desc Assign multiple users to an existing shift
 * @access Admin, Manager
 */
router.post(
  "/api/v1/shifts/:shiftId/users",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  assignUsersToShiftController
);

/**
 * @route PUT /api/v1/shifts/:shiftId
 * @desc Update a shift (startTime, endTime, etc.)
 * @access Admin, Manager
 */
router.put(
  "/api/v1/shifts/:shiftId",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  updateShiftController
);

/**
 * @route GET /api/v1/shifts/:shiftId
 * @desc Get a single shift information
 * @access Admin, Manager
 */
router.get(
  "/api/v1/shifts/:shiftId",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  getShiftController
);

/**
 * @route GET /api/v1/organizations/:orgId/shifts
 * @desc Get all shifts under a project/organization
 *       Managers see only their shifts
 * @access Admin, Manager
 */
router.get(
  "/api/v1/organizations/:orgId/shifts",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  getShiftsController
);

/**
 * @route GET /api/v1/organizations/:orgId/shifts/settings
 * @desc Get shift settings for the organization
 * @access Admin, Manager
 */
router.get(
  "/api/v1/organizations/:orgId/shifts/settings",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  getShiftSettingsController
);

/**
 * @route PUT /api/v1/organizations/:orgId/shifts/settings
 * @desc Update shift settings for the organization
 * @access Admin, Manager
 */
router.put(
  "/api/v1/organizations/:orgId/shifts/settings",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  updateShiftSettingsController
);

//tasks

// create tasks (admin/manager/employee)
// router.post(
//   "/api/v1/organizations/:orgId/projects/:projectId/tasks",
//   authMiddleware,
//   authorize("ADMIN", "MANAGER", "EMPLOYEE"),
//   createTasksController
// );

// // list tasks under project
// router.get(
//   "/api/v1/organizations/:orgId/projects/:projectId/tasks",
//   authMiddleware,
//   authorize("ADMIN", "MANAGER", "EMPLOYEE"),
//   listTasksController
// );

// // get single task
// router.get("/api/v1/tasks/:taskId", authMiddleware, authorize("ADMIN", "MANAGER", "EMPLOYEE"), getTaskController);

// // update task
// router.put("/api/v1/tasks/:taskId", authMiddleware, authorize("ADMIN", "MANAGER", "EMPLOYEE"), updateTaskController);

// // assign users (admin/manager)
// router.post("/api/v1/tasks/:taskId/assign", authMiddleware, authorize("ADMIN", "MANAGER"), assignUsersToTaskController);

// // start/stop
// router.post("/api/v1/tasks/:taskId/toggle", authMiddleware, authorize("ADMIN", "MANAGER", "EMPLOYEE"), toggleTaskController);

// leaves

/**
 * @route POST /api/v1/projects/:projectId/leaves
 * @desc Create one or multiple leaves under a project
 *       Employees can only create for themselves
 * @access Admin, Manager, Employee
 */
router.post(
  "/api/v1/projects/:projectId/leaves",
  authMiddleware,
  authorize("ADMIN", "MANAGER", "EMPLOYEE"),
  getLeaveController
);

/**
 * @route GET /api/v1/projects/:projectId/leaves
 * @desc Get all leaves under a project
 *       Admin: all leaves in organization
 *       Manager: leaves only in their projects
 *       Employee: only their own leaves
 * @access Admin, Manager, Employee
 */
router.get(
  "/api/v1/projects/:projectId/leaves",
  authMiddleware,
  authorize("ADMIN", "MANAGER", "EMPLOYEE"),
  getLeavesController
);

/**
 * @route POST /api/v1/leaves/:leaveId/assign-users
 * @desc Assign one or multiple users to a leave (e.g. public holiday)
 *       Only Admins and Managers can assign users
 * @access Admin, Manager
 */
router.post(
  "/api/v1/leaves/:leaveId/assign-users",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  assignUsersToLeaveController
);

/**
 * @route PUT /api/v1/leaves/:leaveId
 * @desc Update a leave
 *       Admins and Managers can update any
 *       Employees can update only their own
 * @access Admin, Manager, Employee
 */
router.put(
  "/api/v1/leaves/:leaveId",
  authMiddleware,
  authorize("ADMIN", "MANAGER", "EMPLOYEE"),
  updateLeaveController
);

/**
 * @route GET /api/v1/leaves/:leaveId
 * @desc Get a single leave
 *       Admins and Managers can view any
 *       Employees can view only their own
 * @access Admin, Manager, Employee
 */
router.get(
  "/api/v1/leaves/:leaveId",
  authMiddleware,
  authorize("ADMIN", "MANAGER", "EMPLOYEE"),
  getLeaveController
);

// clock

/**
 * Clock in for a shift
 */
router.post(
  "/api/v1/clock/:shiftId/clock-in",
  authMiddleware,
  clockInController
);

/**
 * Clock out for a shift
 */
router.post(
  "/api/v1/clock/:shiftId/clock-out",
  authMiddleware,
  clockOutController
);

/**
 * Get all clock-ins and clock-outs for a shift
 */
router.get(
  "/api/v1/clock/:shiftId/clocks",
  authMiddleware,
  getShiftClocksController
);

/**
 * Update clock rules for a shift (requireGeo, requireDeviceLock)
 * Only ADMIN or MANAGER should be able to update rules
 */
router.put(
  "/api/v1/clock/:shiftId/clock-rules",
  authMiddleware,
  authorize("ADMIN", "MANAGER"),
  updateClockRulesController
);

/**
 * QR code endpoints
 */
router.get(
  "/api/v1/clock/:shiftId/generate-qr-code",
  authMiddleware,
  generateQRCodeController
);
router.post(
  "/api/v1/clock/:shiftId/validate-qr-code",
  authMiddleware,
  validateQRCodeController
);

// geolocation
// reports

router.get(
  "/api/v1/reports/personal/:userId",
  authMiddleware,
  generatePersonalReportController
);

router.get(
  "/api/v1/reports/shift/:shiftId",
  authMiddleware,
  generateShiftReportController
);

router.get(
  "/api/v1/reports/project/:projectId",
  authorize("ADMIN", "MANAGER"),
  authMiddleware,
  generateProjectReportController
);

router.get(
  "/api/v1/reports/organization/:orgId",
  authMiddleware,
  authorize("ADMIN"),
  generateOrganizationReportController
);

router.post(
  "/api/v1/reports/schedule",
  authMiddleware,
  scheduleReportController
);

// notifications
// dashboard
// users
/**
 * GET /api/v1/user/preferences
 * Get the logged-in user's preferences
 */
router.get(
  "/api/v1/user/preferences",
  authMiddleware,
  getUserPreferencesController
);

/**
 * PUT /api/v1/user/preferences
 * Update the logged-in user's preferences
 */
router.put(
  "/api/v1/user/preferences",
  authMiddleware,
  updateUserPreferencesController
);

/**
 * PUT /api/v1/user/:userId/role
 * as admin update a user role as under your organization
 */
router.put(
  "/api/v1/users/:userId/role",
  authMiddleware,
  authorize("ADMIN"),
  updateUserRoleController
);

/**
 * @route POST /api/v1/users/:id/reset-password
 * @desc Admin sends password reset link to a user
 */
router.post(
  "/api/v1/users/:id/reset-password",
  authMiddleware,
  authorize("ADMIN"),
  sendPasswordResetLinkController
);

/**
 * @route POST /api/v1/auth/reset-password-request
 * @desc Non-logged-in user requests a password reset link by email
 */
router.post(
  "/api/v1/auth/reset-password-request",
  getPasswordResetLinkController
);

/**
 * @route POST /api/v1/auth/reset-password
 * @desc Reset password using token
 */
router.post("/api/v1/auth/reset-password", resetPasswordController);

// tasks

// Create one or multiple tasks under a project
router.post("/api/v1/projects/:projectId/tasks", authMiddleware, createTasks);

// Assign multiple users to a task
router.post("/api/v1/tasks/:taskId/assign", authMiddleware, assignUsersToTask);

// Update task details
router.patch("/api/v1/tasks/:taskId", authMiddleware, updateTask);

// Update task settings (priority, deadline, custom rules)
router.patch(
  "/api/v1/tasks/:taskId/settings",
  authMiddleware,
  updateTaskSettings
);

// Start or stop a task
router.patch("/api/v1/tasks/:taskId/action", authMiddleware, startStopTask);

// Get a single task
router.get("/api/v1/tasks/:taskId", authMiddleware, getTask);

// Get all tasks under a project
router.get("/api/v1/projects/:projectId/tasks", authMiddleware, getTasks);

export default router;
