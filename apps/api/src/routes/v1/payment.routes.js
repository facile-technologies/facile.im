import express from "express";
import { createCheckoutSession, stripeWebhook, cancelSubscription } from "../../controllers/Payment.controller.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

// The webhook doesn't use verifyToken and uses rawBody
router.post("/webhook", stripeWebhook);

// Protected routes (require user to be logged in)
router.use(auth);
router.post("/create-checkout-session", createCheckoutSession);
router.post("/cancel-subscription", cancelSubscription);

export default router;
