import express from "express";
const router = express.Router();
import QrController from "../../controllers/Qr.controller.js";
import authMiddleware from "../../middlewares/auth.js";
import upload from "../../middlewares/multer.js";

router.get("/:user_profile_id", QrController.getQrDesign);
router.post("/update", authMiddleware, upload.single("logo_file"), QrController.updateQrDesign);
router.get("/download/:user_profile_id", QrController.downloadQrCode);

export default router;
