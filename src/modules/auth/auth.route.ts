// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { registerController, loginController } from "./auth.controller";

const router = Router();

router.post("/api/v1/auth/register", registerController);
router.post("/api/v1/auth/login", loginController);

export default router;
