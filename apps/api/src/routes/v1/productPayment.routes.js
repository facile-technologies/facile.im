import express from "express";
import auth from "../../middlewares/auth.js";
import {
  onboardSeller,
  getConnectStatus,
  refreshOnboardingLink,
  getConnectBalance,
  withdrawFunds,
  getPayoutHistory,
  getTransactionHistory,
  getSalesAnalytics,
  createProductCheckout,
  productPurchaseWebhook,
  trackProductView,
  getSellerPurchases,
} from "../../controllers/ProductPayment.controller.js";

const router = express.Router();

// ─── Stripe webhook (no auth — Stripe signs its own requests) ─────────────────
router.post("/product/webhook", productPurchaseWebhook);

// ─── Public routes (no auth — called from buyer's browser) ────────────────────
router.post("/product/checkout", createProductCheckout);
router.post("/product/view", trackProductView);

// ─── Seller routes (authenticated) ───────────────────────────────────────────

// Stripe Connect onboarding
router.post("/connect/onboard", auth, onboardSeller);
router.get("/connect/status", auth, getConnectStatus);
router.post("/connect/refresh-link", auth, refreshOnboardingLink);

// Balance + Withdraw + Transaction history + Sales history
router.get("/connect/balance", auth, getConnectBalance);
router.post("/connect/withdraw", auth, withdrawFunds);
router.get("/connect/payouts", auth, getPayoutHistory);
router.get("/connect/transactions", auth, getTransactionHistory);
router.get("/connect/analytics", auth, getSalesAnalytics);
router.get("/connect/purchases", auth, getSellerPurchases);

export default router;
