import express from "express";
const router = express.Router();

import DeviceController from "../../controllers/Device.controller.js";
import auth from "../../middlewares/auth.js";

router.post("/activate", DeviceController.activateDevice);
router.post("/unlink", auth, DeviceController.unlinkDevice);
router.get("/", auth, DeviceController.getUserDevices);
router.patch("/one-share", auth, DeviceController.setupOneShare);
router.post("/generate-code", auth, DeviceController.generateActivationCode);
router.get("/profiles/:code", DeviceController.getProfilesByCode);
router.get("/status/:code", DeviceController.checkCodeStatus);

export default router;
