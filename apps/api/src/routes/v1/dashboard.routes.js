import express from "express";
const router = express.Router();
import DashboardController from "../../controllers/Dashboard.controller.js";
import authMiddleware from "../../middlewares/auth.js";

router.get("/", authMiddleware, DashboardController.getDashboardData);

export default router;
