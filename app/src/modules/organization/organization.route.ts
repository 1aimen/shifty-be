// // src/modules/organization/organization.route.ts
// import { Router } from "express";
// import {
//   createOrganizationController,
//   updateOrganizationController,
//   inviteUserController,
//   createProjectController,
//   getOrganizationController,
// } from "./organization.controller";
// import { authMiddleware } from "../../middleware/authentication.middleware";
// import { authorizeRoles } from "../../middleware/authorization.middleware";

// const router = Router();

// // Only authenticated users
// router.use(authMiddleware);

// // ─── Organization routes ───
// router.post("/", authorizeRoles("ADMIN"), createOrganizationController); // create org
// router.patch(
//   "/:id",
//   authorizeRoles("ADMIN", "MANAGER"),
//   updateOrganizationController
// ); // update org
// router.post(
//   "/:id/invite",
//   authorizeRoles("ADMIN", "MANAGER"),
//   inviteUserController
// ); // invite user
// router.post(
//   "/:id/project",
//   authorizeRoles("ADMIN", "MANAGER"),
//   createProjectController
// ); // create project
// router.get(
//   "/:id",
//   authorizeRoles("ADMIN", "MANAGER", "EMPLOYEE"),
//   getOrganizationController
// ); // view org

// export default router;
