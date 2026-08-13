

import express from "express";
const router = express.Router();

import authMiddleware from "../../middlewares/auth.js";
import PetProfileController from "../../controllers/profile/PetProfileController.js";
import upload from "../../middlewares/multer.js";


router.get(
  "/me",
  authMiddleware,
  PetProfileController.getMyPetProfile
);

router.put(
  "/me",
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },        
    { name: "backgroundImage", maxCount: 1 }    
  ]),
  PetProfileController.updateMyPetProfile
);


router.get(
  "/customization",
  authMiddleware,
  PetProfileController.getMyPetProfileCustomization
);

router.put(
  "/customization",
  authMiddleware,
  upload.single("backgroundImage"),
  PetProfileController.updateMyPetProfileCustomization
);

router.get("/contacts",
  authMiddleware,
  PetProfileController.getMyPetContacts
);

router.post(
  "/contacts/emergency",
  authMiddleware,
  PetProfileController.createMyPetEmergencyContact
);

router.post(
  "/contacts/doctor",
  authMiddleware,
  PetProfileController.createMyPetDoctorContact
);

router.post(
  "/contacts/address",
  authMiddleware,
  PetProfileController.createMyPetAddress
);

router.patch(
  "/contacts/:type",
  authMiddleware,
  PetProfileController.updateMyPetContactsVisibility
);

router.patch(
  "/contacts/:type/:id",
  authMiddleware,
  PetProfileController.editMyPetContactById
);

router.delete(
  "/contacts/:type/:id",
  authMiddleware,
  PetProfileController.deleteMyPetContactById
);

router.get(
  "/contacts/customization",
  authMiddleware,
  PetProfileController.getMyPetContactsCustomization
);

router.put(
  "/contacts/customization",
  authMiddleware,
  PetProfileController.updateMyPetContactsCustomization
);

router.get(
  "/medical",
  authMiddleware,
  PetProfileController.getMyPetMedicalInformation
);

router.post(
  "/medical/details",
  authMiddleware,
  PetProfileController.createMyPetMedicalDetail
);

router.patch(
  "/medical/details/customize",
  authMiddleware,
  PetProfileController.updateMyPetMedicalDetailsSequenceVisibility
);


router.patch(
  "/medical/details/:id",
  authMiddleware,
  PetProfileController.editMyPetMedicalDetailById
);

router.delete(
  "/medical/details/:id",
  authMiddleware,
  PetProfileController.deleteMyPetMedicalDetailById
);

router.patch(
  "/medical/insurance",
  authMiddleware,
  PetProfileController.updateMyPetMedicalInsurance
);

router.get(
  "/medical/customization",
  authMiddleware,
  PetProfileController.getMyPetMedicalCustomization
);

router.patch(
  "/medical/customization",
  authMiddleware,
  PetProfileController.updateMyPetMedicalCustomization
);

router.get(
  "/identification",
  authMiddleware,
  PetProfileController.getMyPetIdentification
);

router.patch(
  "/identification",
  authMiddleware,
  PetProfileController.updateMyPetIdentification
);



export default router;
