// routes/v1/user.routes.js

import express from "express";
const router = express.Router();

import AuthController from "../../controllers/auth/Auth.controller.js";
import PasswordController from "../../controllers/auth/Password.controller.js";
// import ProfileController from "../../controllers/profile/Profile.controller.js";
// import LinksController from "../../controllers/links/Links.controller.js";

import upload from "../../middlewares/multer.js";
import authMiddleware from "../../middlewares/auth.js";
import UserController from "../../controllers/User.controller.js";

// Profile Management
router.get("/profiles", authMiddleware, UserController.getUserProfiles);
router.delete("/profile/:userProfileId", authMiddleware, UserController.deleteUserProfile);

// Plans
router.get("/plans", UserController.getAllPlans);

// Username check (GET)
router.get("/check-username", AuthController.checkUsername);

// Auth & account (POST)
router.post("/signup", AuthController.signup);                        // Sign up a new user
router.post("/verify-otp", AuthController.verifyOtp);                 // Verify OTP during registration
router.post("/resend-register-otp", AuthController.resendRegisterOtp); // Resend OTP during registration
router.post("/login", AuthController.login);                          // Login existing user

// Forget password flow (POST)
router.post(
  "/forget-password-otp",
  PasswordController.sendForgetPasswordOtp
); // Send OTP for password reset

router.post(
  "/verify-forget-password-otp",
  PasswordController.verifyForgetPasswordOtp
); // Verify OTP for password reset

router.post(
  "/resend-password-otp",
  PasswordController.reSendForgetPasswordOtp
); // Resend OTP for password reset

router.post(
  "/reset-forget-password",
  PasswordController.resetForgetPasswordOtp
); // Reset the password using OTP


export default router;
