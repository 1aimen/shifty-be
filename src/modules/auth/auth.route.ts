// src/modules/auth/auth.routes.ts
import { Router } from "express";
import { registerController, loginController } from "./auth.controller";

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/api/v1/auth/register", registerController);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/api/v1/auth/login", loginController);

export default router;
