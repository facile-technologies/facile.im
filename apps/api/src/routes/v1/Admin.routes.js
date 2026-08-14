import express from "express";
const router = express.Router();

import auth from "../../middlewares/auth.js";
import isAdmin from "../../middlewares/isAdmin.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";
import AdminController from "../../controllers/admin/Admin.controller.js";


// Rate-limit the only unauthenticated admin route before the auth gate below.
router.post("/login", authLimiter, AdminController.login);


router.use(auth, isAdmin);

router.get("/devices", AdminController.getDevices)
router.post("/nfc/generate", AdminController.generateCodes);
router.patch("/nfc/:id", AdminController.updateNfc);
router.get("/nfc", AdminController.getNfcCodes);
router.get("/users", AdminController.getUsers);

router.get("/plans", AdminController.getPlans);
router.post("/plans", AdminController.createPlan);
router.put("/plans/:id", AdminController.updatePlan);
router.delete("/plans/:id", AdminController.deletePlan);

router.post("/platforms", AdminController.createPlatform);
router.get("/platforms", AdminController.getPlatforms);
router.get("/platforms/:id", AdminController.getPlatformById);
router.patch("/platforms/:id", AdminController.updatePlatform);
router.delete("/platforms/:id", AdminController.deletePlatform);

router.get("/dashboard", AdminController.getDashboardStats);
router.get("/teams", AdminController.getTeams);



export default router;
