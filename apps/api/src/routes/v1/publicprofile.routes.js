import express from "express";
const  router = express.Router();

import PublicProfileController from "../../controllers/profile/PublicProfileController.js";

// Simple security middleware for public access
const publicSecurityHeaders = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Facile-Public-Access", "true");
  next();
};


router.post("/submit-contact", publicSecurityHeaders, PublicProfileController.submitContactForm);
router.get("/resolve/:code", publicSecurityHeaders, PublicProfileController.resolveCodeProfileType);
router.get("/rescue/:type/:username", publicSecurityHeaders, PublicProfileController.getPublicRescueProfile);
router.get("/:username", publicSecurityHeaders, PublicProfileController.getPublicProfileByUsername);
router.get("/:code", publicSecurityHeaders, PublicProfileController.getPublicProfileByCode);
router.post("/profile-clicks/:userprofileId", publicSecurityHeaders, PublicProfileController.profileClickCount);

export default router;
