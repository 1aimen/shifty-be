import { Request, Response } from "express";
import { ClockService } from "./clock.service";
import { AuthRequest } from "../../types/auth.types";
import { QRCodeUtils } from "../../utils/qrcode.utils";

/**
 * @swagger
 * tags:
 *   name: Clock
 *   description: Clock in/out and shift clock rules
 */

/**
 * @swagger
 * /api/v1/clock/{shiftId}/clock-in:
 *   post:
 *     summary: Clock in for a shift
 *     tags: [Clock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shiftId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the shift
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               method:
 *                 type: string
 *                 description: Clock method (e.g., GEO, QR)
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               ipAddress:
 *                 type: string
 *               device:
 *                 type: string
 *               clockAt:
 *                 type: string
 *                 format: date-time
 */
export const clockInController = async (req: AuthRequest, res: Response) => {
  try {
    const { shiftId } = req.params;
    const { id: userId } = req.user!;
    const { method, latitude, longitude, ipAddress, device, clockAt } =
      req.body;

    const clock = await ClockService.createClockIn(shiftId!, userId, userId, {
      method,
      latitude,
      longitude,
      ipAddress,
      device,
      clockAt,
    });

    return res.status(201).json(clock);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/clock/{shiftId}/clock-out:
 *   post:
 *     summary: Clock out for a shift
 *     tags: [Clock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shiftId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the shift
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               method:
 *                 type: string
 *                 description: Clock method (e.g., GEO, QR)
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               ipAddress:
 *                 type: string
 *               device:
 *                 type: string
 *               clockAt:
 *                 type: string
 *                 format: date-time
 */
export const clockOutController = async (req: AuthRequest, res: Response) => {
  try {
    const { shiftId } = req.params;
    const { id: userId } = req.user!;
    const { method, latitude, longitude, ipAddress, device, clockAt } =
      req.body;

    const clock = await ClockService.createClockOut(shiftId!, userId, {
      method,
      latitude,
      longitude,
      ipAddress,
      device,
      clockAt,
    });

    return res.status(201).json(clock);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/clock/{shiftId}/clocks:
 *   get:
 *     summary: Get all clock-ins and clock-outs for a shift
 *     tags: [Clock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shiftId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the shift
 */
export const getShiftClocksController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { shiftId } = req.params;
    const clocks = await ClockService.getClocksByShift(shiftId!);
    return res.json(clocks);
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/clock/{shiftId}/clock-rules:
 *   put:
 *     summary: Update clock in/out requirements for a shift
 *     tags: [Clock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shiftId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the shift
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requireGeo:
 *                 type: boolean
 *               requireDeviceLock:
 *                 type: boolean
 */
export const updateClockRulesController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { shiftId } = req.params;
    const { requireGeo, requireDeviceLock } = req.body;

    const updatedShift = await ClockService.updateClock(shiftId!, {
      requireGeo,
      requireDeviceLock,
    });
    return res.json(updatedShift);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/clock/{shiftId}/generate-qr-code:
 *   get:
 *     summary: Generate a short-lived QR code for clock-in
 *     tags: [Clock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shiftId
 *         required: true
 *         schema:
 *           type: string
 *         description: Shift ID
 */
export const generateQRCodeController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { shiftId } = req.params;
    const { id: userId } = req.user!;
    const qrCodeBase64 = await ClockService.generateQRCodeForClock(
      shiftId!,
      userId
    );
    return res.json({ qrCode: qrCodeBase64 });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/v1/clock/{shiftId}/validate-qr-code:
 *   post:
 *     summary: Validate a QR code and clock-in
 *     tags: [Clock]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shiftId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qrContent:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               ipAddress:
 *                 type: string
 *               device:
 *                 type: string
 *               clockAt:
 *                 type: string
 *                 format: date-time
 */
export const validateQRCodeController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { shiftId } = req.params;
    const { qrContent, latitude, longitude, ipAddress, device, clockAt } =
      req.body;
    const { id: userId } = req.user!;

    const clockId = QRCodeUtils.validateQRCode(qrContent, shiftId!, userId);

    const clock = await ClockService.clockInWithQRCode(
      clockId,
      shiftId!,
      userId,
      {
        latitude,
        longitude,
        ipAddress,
        device,
        clockAt,
      }
    );

    return res.status(201).json(clock);
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
