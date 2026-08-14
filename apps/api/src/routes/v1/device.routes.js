import express from "express";
const router = express.Router();

import DeviceController from "../../controllers/Device.controller.js";
import auth from "../../middlewares/auth.js";
import { publicLimiter, pollLimiter } from "../../middlewares/rateLimiter.js";

// These routes stay PUBLIC by design (anonymous cross-device activation), so
// they carry no auth. publicLimiter throttles per-IP abuse / enumeration
// without blocking a legitimate single activation or the desktop poller.
router.post("/activate", publicLimiter, DeviceController.activateDevice);
router.post("/unlink", auth, DeviceController.unlinkDevice);
router.get("/", auth, DeviceController.getUserDevices);
router.patch("/one-share", auth, DeviceController.setupOneShare);
router.post("/generate-code", auth, DeviceController.generateActivationCode);
router.get("/profiles/:code", publicLimiter, DeviceController.getProfilesByCode);
router.get("/status/:code", pollLimiter, DeviceController.checkCodeStatus);
// Self-serve scan-to-onboard (Path A): public resolver for a scanned card, and
// the authenticated bind used once the visitor has an account + profile.
router.get("/scan/:code", publicLimiter, DeviceController.scanCode);
router.post("/claim", auth, DeviceController.claimDevice);

export default router;
