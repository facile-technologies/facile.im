// routes/v1/profile.routes.js

import express from "express";
const router = express.Router();

import authMiddleware from "../../middlewares/auth.js";
import PersonalProfileController from "../../controllers/profile/PersonalProfileController.js";
import upload from "../../middlewares/multer.js";

// PERSONAL PROFILE ROUTES

// Get full personal profile (profile + customization + links + contacts)
router.get(
  "/get-profile/:userProfileId",
  authMiddleware,
  PersonalProfileController.getMyPersonalProfile
);



router.post(
  "/create-profile",
  authMiddleware,
  PersonalProfileController.createNewPersonalProfile
);

// Update personal profile + customization + files
router.put(
  "/update-profile/:userProfileId",
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  PersonalProfileController.updateMyPersonalProfile
);


// GET /v1/profile/personal/validate-username?username=someName
router.get(
  "/validate-username",
  authMiddleware,
  PersonalProfileController.validateUsernameUnique
);


// GET /v1/profile/personal/customization
router.get(
  "/customization",
  authMiddleware,
  PersonalProfileController.getMyPersonalProfileCustomization
);

// PROFILE LINKS API

router.get(
  "/platforms",
  authMiddleware,
  PersonalProfileController.getSupportedPlatformLinks
);

router.post(
  "/link/:userProfileId",
  authMiddleware,
  PersonalProfileController.createMyPersonalProfileLink
);

router.patch(
  "/link/customization/:userProfileId",
  authMiddleware,
  PersonalProfileController.updateMyPersonalProfileLinkCustomization
);

router.get(
  "/link/:userProfileId",
  authMiddleware,
  PersonalProfileController.getMyPersonalProfileLinks
);

router.put(
"/links/sequence/:userProfileId",
authMiddleware,
PersonalProfileController.updateMyPersonalProfileLinksSequence
);

router.patch(
"/:userProfileId/links/:linkId",
 authMiddleware,
 PersonalProfileController.editMyPersonalProfileLink  
);

router.delete(
  "/:userProfileId/links/:linkId",
  authMiddleware,
  PersonalProfileController.deleteMyPersonalProfileLink
);

 // CUSTOM LINKS API

router.post(
  "/custom-link/:userProfileId",
  authMiddleware,
  upload.fields([
    { name: "icon", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]),
  PersonalProfileController.createMyPersonalCustomLink
);

router.get(
  "/custom-link/:userProfileId",
  authMiddleware,
  PersonalProfileController.getMyPersonalCustomLinks
);

router.put(
  "/custom-link/sequence/:userProfileId",
  authMiddleware,
  PersonalProfileController.updateMyPersonalCustomLinksSequence
);

router.patch(
  "/:userProfileId/custom-link/:linkId",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  PersonalProfileController.editMyPersonalCustomLink
);

router.delete(
   "/:userProfileId/custom-link/:linkId",
  authMiddleware,
  PersonalProfileController.deleteMyPersonalCustomLink
);

router.patch(
  "/custom-link/customization/:userProfileId",
  authMiddleware,
  PersonalProfileController.updateMyPersonalCustomLinkCustomization
);

router.get(
  "/contact/:userProfileId",
  authMiddleware,
  PersonalProfileController.getMyPersonalProfileContact
);

router.put(
  "/contact/:userProfileId",
  authMiddleware,
  PersonalProfileController.updateMyPersonalProfileContact
);

router.patch(
  "/contact/status/:userProfileId",
  authMiddleware,
  PersonalProfileController.toggleMyPersonalProfileContactStatus
);

router.get(
  "/contact/save/:userProfileId",
  authMiddleware,
  PersonalProfileController.getMyPersonalProfileSaveContact
);

router.put(
  "/contact/save/:userProfileId",
  authMiddleware, 
  PersonalProfileController.updateMyPersonalProfileSaveContact
);

router.patch(
  "/contact/save/status/:userProfileId",
  authMiddleware,
  PersonalProfileController.toggleMyPersonalProfileSaveContactStatus
);

router.post("/media/:userProfileId",
  authMiddleware,
  upload.single("media"),
  PersonalProfileController.createMyPersonalProfileMedia
  );

router.put(["/media", "/media/:userProfileId"],
  authMiddleware,
  PersonalProfileController.updateMyPersonalProfileMediaSequenceAndLayout
);

router.delete(
  "/media/:id",
  authMiddleware,
  PersonalProfileController.deleteMyPersonalProfileMedia
);

export default router;
