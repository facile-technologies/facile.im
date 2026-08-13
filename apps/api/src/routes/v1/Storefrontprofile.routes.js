// routes/v1/businessprofile.routes.js

import express from "express";
const router = express.Router();

import authMiddleware from "../../middlewares/auth.js";
import StoreFrontProfileController from "../../controllers/profile/StoreFrontProfileController.js";
import upload from "../../middlewares/multer.js";

// BUSINESS PROFILE ROUTES

// create business profile (profile + customization + links + contacts)
router.post(
  "/create-profile",
  authMiddleware,
  StoreFrontProfileController.createNewStoreFrontProfile
);


router.get(
  "/get-profile/:userProfileId",
  authMiddleware,
  StoreFrontProfileController.getMyStoreFrontProfile
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
  StoreFrontProfileController.updateMyStoreFrontProfile
);


router.get(
  "/customization",
  authMiddleware,
  StoreFrontProfileController.getMyStoreFrontProfileCustomization
);

router.post(
  "/link/:userProfileId",
  authMiddleware,
  StoreFrontProfileController.createMyStoreFrontProfileLink
);

router.get(
  "/link/:userProfileId",
  authMiddleware,
  StoreFrontProfileController.getMyStoreFrontProfileLinks
);

router.put(
"/links/sequence/:userProfileId",
authMiddleware,
StoreFrontProfileController.updateMyStoreFrontProfileLinksSequence
);


router.patch(
 "/:userProfileId/links/:linkId",
 authMiddleware,
 StoreFrontProfileController.editMyStoreFrontProfileLink
);

router.delete(
    "/:userProfileId/links/:linkId",
  authMiddleware,
  StoreFrontProfileController.deleteMyStoreFrontProfileLink
);

router.patch(
  "/link/customization/:userProfileId",
  authMiddleware,
  StoreFrontProfileController.updateMyStoreFrontProfileLinkCustomization
);

router.get(
  "/platforms",
  authMiddleware,
  StoreFrontProfileController.getSupportedPlatformLinks
);

router.post(
  "/custom-link/:userProfileId",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  StoreFrontProfileController.createMyStoreFrontCustomLink
);

router.get(
  "/custom-link/:userProfileId",
  authMiddleware,
  StoreFrontProfileController.getMyStoreFrontCustomLinks
);

router.put(
  "/custom-link/sequence/:userProfileId",
  authMiddleware,
  StoreFrontProfileController.updateMyStoreFrontCustomLinksSequence
);

router.patch(
  "/:userProfileId/custom-link/:linkId",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  StoreFrontProfileController.editMyStoreFrontCustomLink
);

router.delete(
  "/:userProfileId/custom-link/:linkId",
  authMiddleware,
  StoreFrontProfileController.deleteMyStoreFrontCustomLink
);

router.patch(
  "/custom-link/customization/:userProfileId",
  authMiddleware,
  StoreFrontProfileController.updateMyStoreFrontCustomLinkCustomization
);


router.get(
  "/contact/:userProfileId",
  authMiddleware,
StoreFrontProfileController.getMyStoreFrontProfileContact
);

router.put(
  "/contact/:userProfileId",
  authMiddleware,
  StoreFrontProfileController.updateMyStoreFrontProfileContact
);

router.patch(
  "/contact/status/:userProfileId",
  authMiddleware,
  StoreFrontProfileController.toggleMyStoreFrontProfileContactStatus
);

router.get(
  "/contact/save/:userProfileId",
  authMiddleware,
  StoreFrontProfileController.getMyStoreFrontProfileSaveContact
);

router.put(
  "/contact/save/:userProfileId",
  authMiddleware, 
  StoreFrontProfileController.updateMyStoreFrontProfileSaveContact
);

router.patch(
  "/contact/save/status/:userProfileId",
  authMiddleware,
  StoreFrontProfileController.toggleMyStoreFrontProfileSaveContactStatus
);

router.post("/media/:userProfileId",
  authMiddleware,
  upload.single("media"),
  StoreFrontProfileController.createMyStoreFrontProfileMedia
  );

router.put(["/media", "/media/:userProfileId"],
  authMiddleware,
  StoreFrontProfileController.updateMyStoreFrontProfileMediaSequenceAndLayout
);

router.delete(
  "/media/:id",
  authMiddleware,
  StoreFrontProfileController.deleteMyStoreFrontProfileMedia
);


// Added by Mujeeb
router.get('/existing-links', 
  authMiddleware,
  StoreFrontProfileController.getStoreFrontProfileExistingLinks);

export default router;
