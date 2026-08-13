// routes/v1/businessprofile.routes.js

import express from "express";
const router = express.Router();

import authMiddleware from "../../middlewares/auth.js";
import SosProfileController from "../../controllers/profile/SosProfileController.js";
import upload from "../../middlewares/multer.js";
import auth from "../../middlewares/auth.js";

// SOS PROFILE ROUTES

// Get full SOS profile (profile + customization + Contacts + Medical Informationm)
router.get("/me", authMiddleware, SosProfileController.getMySosProfile);

router.put(
  "/me",
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },  
  ]),
  SosProfileController.updateMySosProfile
);


router.get(
  "/customization",
  authMiddleware,
  SosProfileController.getMySosProfileCustomization
);

router.put(
  "/customization",
  authMiddleware,
  upload.single("backgroundImage"),
  SosProfileController.updateMySosProfileCustomization
);

router.get("/contacts",
   authMiddleware,
   SosProfileController.getMySosContacts
  );

router.post(
  "/contacts/emergency",
  authMiddleware,
  SosProfileController.createMySosEmergencyContact
);

router.post(
  "/contacts/doctor",
  authMiddleware,
  SosProfileController.createMySosDoctorContact
);

router.post(
  "/contacts/address",
  authMiddleware,
  SosProfileController.createMySosAddress
);

router.patch(
  "/contacts/:type",
  authMiddleware,
  SosProfileController.updateMySosContactsVisibility
);

router.patch(
  "/contacts/:type/:id",
  authMiddleware,
  SosProfileController.editMySosContactById
);

router.delete(
  "/contacts/:type/:id",
  authMiddleware,
  SosProfileController.deleteMySosContactById
);

router.put(
  "/contacts/customization",
  authMiddleware,
  SosProfileController.updateMySosContactsCustomization
);

router.get(
  "/contacts/customization",
  authMiddleware,
  SosProfileController.getMySosContactsCustomization
);

router.get(
  "/medical",
  authMiddleware,
  SosProfileController.getMySosMedicalInformation
);

router.post(
  "/medical/details",
  authMiddleware,
  SosProfileController.createMySosMedicalDetail
);

router.patch(
  "/medical/details/customize",
  authMiddleware,
  SosProfileController.updateMySosMedicalDetailsSequenceVisibility
);

router.patch(
  "/medical/details/:id",
  authMiddleware,
  SosProfileController.editMySosMedicalDetailById
);

router.delete(
  "/medical/details/:id",
  authMiddleware,
  SosProfileController.deleteMySosMedicalDetailById
);

router.patch(
  "/medical/insurance",
  authMiddleware,
  SosProfileController.updateMySosMedicalInsurance
);

router.get(
  "/medical/customization",
  authMiddleware,
  SosProfileController.getMySosMedicalCustomization
);

router.patch(
  "/medical/customization",
  authMiddleware,
  SosProfileController.updateMySosMedicalCustomization
);

export default router;
