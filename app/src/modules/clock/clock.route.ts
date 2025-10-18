import { Router } from "express";
import { clockInController, clockOutController } from "./attendance.controller";

const router = Router();

router.post("/api/v1/clock-in", clockInController);
router.post("/api/v1/clock-out", clockOutController);

export default router;
