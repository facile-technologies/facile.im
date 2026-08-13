// routes/v1/businessprofile.routes.js

import express from "express";
const router = express.Router();

import authMiddleware from "../../middlewares/auth.js";
import BusinessProfileController from "../../controllers/profile/BusinessProfileController.js";
import upload from "../../middlewares/multer.js";

// BUSINESS PROFILE ROUTES

// create business profile (profile + customization + links + contacts)
router.post(
  "/create-profile",
  authMiddleware,
  BusinessProfileController.createNewBusinessProfile
);


router.get(
  "/get-profile/:userProfileId",
  authMiddleware,
  BusinessProfileController.getMyBusinessProfile
);

router.put(
  "/update-profile/:userProfileId",
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  BusinessProfileController.updateMyBusinessProfile
);


router.get(
  "/customization",
  authMiddleware,
  BusinessProfileController.getMyBusinessProfileCustomization
);

router.post(
  "/link/:userProfileId",
  authMiddleware,
  BusinessProfileController.createMyBusinessProfileLink
);

router.get(
  "/link/:userProfileId",
  authMiddleware,
  BusinessProfileController.getMyBusinessProfileLinks
);

router.put(
"/links/sequence/:userProfileId",
authMiddleware,
BusinessProfileController.updateMyBusinessProfileLinksSequence
);


router.patch(
 "/:userProfileId/links/:linkId",
 authMiddleware,
 BusinessProfileController.editMyBusinessProfileLink
);

router.delete(
    "/:userProfileId/links/:linkId",
  authMiddleware,
  BusinessProfileController.deleteMyBusinessProfileLink
);

router.patch(
  "/link/customization/:userProfileId",
  authMiddleware,
  BusinessProfileController.updateMyBusinessProfileLinkCustomization
);

router.get(
  "/platforms",
  authMiddleware,
  BusinessProfileController.getSupportedPlatformLinks
);

router.post(
  "/custom-link/:userProfileId",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  BusinessProfileController.createMyBusinessCustomLink
);

router.get(
  "/custom-link/:userProfileId",
  authMiddleware,
  BusinessProfileController.getMyBusinessCustomLinks
);

router.put(
  "/custom-link/sequence/:userProfileId",
  authMiddleware,
  BusinessProfileController.updateMyBusinessCustomLinksSequence
);

router.patch(
  "/:userProfileId/custom-link/:linkId",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  BusinessProfileController.editMyBusinessCustomLink
);

router.delete(
  "/:userProfileId/custom-link/:linkId",
  authMiddleware,
  BusinessProfileController.deleteMyBusinessCustomLink
);

router.patch(
  "/custom-link/customization/:userProfileId",
  authMiddleware,
  BusinessProfileController.updateMyBusinessCustomLinkCustomization
);


router.get(
  "/contact/:userProfileId",
  authMiddleware,
BusinessProfileController.getMyBusinessProfileContact
);

router.put(
  "/contact/:userProfileId",
  authMiddleware,
  BusinessProfileController.updateMyBusinessProfileContact
);

router.patch(
  "/contact/status/:userProfileId",
  authMiddleware,
  BusinessProfileController.toggleMyBusinessProfileContactStatus
);

router.get(
  "/contact/save/:userProfileId",
  authMiddleware,
  BusinessProfileController.getMyBusinessProfileSaveContact
);

router.put(
  "/contact/save/:userProfileId",
  authMiddleware, 
  BusinessProfileController.updateMyBusinessProfileSaveContact
);

router.patch(
  "/contact/save/status/:userProfileId",
  authMiddleware,
  BusinessProfileController.toggleMyBusinessProfileSaveContactStatus
);

router.post("/media/:userProfileId",
  authMiddleware,
  upload.single("media"),
  BusinessProfileController.createMyBusinessProfileMedia
  );

router.put(["/media", "/media/:userProfileId"],
  authMiddleware,
  BusinessProfileController.updateMyBusinessProfileMediaSequenceAndLayout
);

router.delete(
  "/media/:id",
  authMiddleware,
  BusinessProfileController.deleteMyBusinessProfileMedia
);


// Added by Mujeeb
router.get('/existing-links', 
  authMiddleware,
  BusinessProfileController.getBusinessProfileExistingLinks);

  router.get('/user-analytics/:userProfileId', 
  authMiddleware,
  BusinessProfileController.getUserAnalytics);


    router.get('/live-user-analytics/:userProfileId', 
  authMiddleware,
  BusinessProfileController.liveUserAnalytics);

export default router;
