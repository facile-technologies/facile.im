// routes/v1/user.routes.js

import express from "express";
const router = express.Router();

import AuthController from "../../controllers/auth/Auth.controller.js";
import PasswordController from "../../controllers/auth/Password.controller.js";
// import ProfileController from "../../controllers/profile/Profile.controller.js";
// import LinksController from "../../controllers/links/Links.controller.js";

import upload from "../../middlewares/multer.js";
import authMiddleware from "../../middlewares/auth.js";
import { authLimiter, sessionLimiter } from "../../middlewares/rateLimiter.js";
import UserController from "../../controllers/User.controller.js";

// Profile Management
router.get("/profiles", authMiddleware, UserController.getUserProfiles);
router.delete("/profile/:userProfileId", authMiddleware, UserController.deleteUserProfile);

// Plans
router.get("/plans", UserController.getAllPlans);

// Username check (GET)
router.get("/check-username", AuthController.checkUsername);

// Auth & account (POST) — authLimiter throttles these unauthenticated endpoints.
router.post("/signup", authLimiter, AuthController.signup);                        // Sign up a new user
router.post("/verify-otp", authLimiter, AuthController.verifyOtp);                 // Verify OTP during registration
router.post("/resend-register-otp", authLimiter, AuthController.resendRegisterOtp); // Resend OTP during registration
router.post("/login", authLimiter, AuthController.login);                          // Login existing user

// Session endpoints — silently rotate the refresh cookie / revoke on logout.
// sessionLimiter (moderate) instead of the strict authLimiter: refreshes are
// routine and multi-tab / shared-IP users must not be locked out. Shared by
// both the dashboard and admin apps.
router.post("/refresh", sessionLimiter, AuthController.refresh);                    // Rotate refresh token -> new access token
router.post("/logout", sessionLimiter, AuthController.logout);                      // Revoke refresh family + clear cookie

// Forget password flow (POST)
router.post(
  "/forget-password-otp",
  authLimiter,
  PasswordController.sendForgetPasswordOtp
); // Send OTP for password reset

router.post(
  "/verify-forget-password-otp",
  authLimiter,
  PasswordController.verifyForgetPasswordOtp
); // Verify OTP for password reset

router.post(
  "/resend-password-otp",
  authLimiter,
  PasswordController.reSendForgetPasswordOtp
); // Resend OTP for password reset

router.post(
  "/reset-forget-password",
  authLimiter,
  PasswordController.resetForgetPasswordOtp
); // Reset the password using OTP


export default router;
