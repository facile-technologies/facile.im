// // controllers/Sos.controller.js

// import HttpError from "../middlewares/errors/HttpError.js";
// // import CustomErrorHandler from "../middlewares/errors/customErrorHandler.js"; // Uncomment if needed

// import db from "../models/Association.js";
// import joiValidation from "../utils/joiValidation.js";

// const {
//   SosProfileModel,
//   SosContactProfileModel,
//   SosMedicalProfileModel,
// } = db;

// class SosController {
//   /**
//    * Helper: Get authenticated user id
//    */
//   static getUserId = (req) => {
//     // Support both patterns, but prefer req.userId like in User.controller.js
//     return req.userId || req.user?.id || null;
//   };

//   /**
//    * Helper: Find SOS profile for current user or throw 404
//    */
//   static findUserSosProfileOrThrow = async (sosProfileId, userId) => {
//     const sosProfile = await SosProfileModel.findOne({
//       where: { id: sosProfileId, userId },
//     });

//     if (!sosProfile) {
//       throw new HttpError(404, "SOS profile not found or unauthorized");
//     }

//     return sosProfile;
//   };

//   /**
//    * --------------------------------------------------------------------
//    * CREATE SOS PROFILE (User can have multiple SOS profiles)
//    * POST /v1/user/sos
//    * --------------------------------------------------------------------
//    */
//   static createSosProfile = async (req, res, next) => {
//     try {
//       const userId = SosController.getUserId(req);
//       if (!userId) {
//         throw new HttpError(401, "Unauthorized");
//       }

//       // Joi validation (implement in joiValidation)
//       // const { error } = joiValidation.createSosProfileValidation(req.body);
//       // if (error) return next(error);

//       const {
//         firstName,
//         lastName,
//         gender,
//         birthday,
//         height,
//         weight,
//         bloodGroup,
//         bio,
//         isPinned,
//         layoutType,
//         backgroundColor,
//         backgroundImage,
//         fontFamily,
//         fontSize,
//         blurBackground,
//       } = req.body;

//       const sosProfile = await SosProfileModel.create({
//         userId,
//         firstName: firstName?.trim() || "",
//         lastName: lastName?.trim() || "",
//         gender: gender ?? null,
//         birthday: birthday ?? null,
//         height: height ?? null,
//         weight: weight ?? null,
//         bloodGroup: bloodGroup ?? null,
//         bio: bio?.trim() || "",
//         isPinned: Boolean(isPinned),
//         layoutType: layoutType || "compact",
//         backgroundColor: backgroundColor ?? null,
//         backgroundImage: backgroundImage ?? null,
//         fontFamily: fontFamily ?? null,
//         fontSize: fontSize ?? null,
//         blurBackground:
//           blurBackground !== undefined && blurBackground !== null
//             ? Number(blurBackground)
//             : 0,
//       });

//       return res.status(201).json({
//         status: true,
//         message: "SOS profile created successfully",
//         data: sosProfile,
//       });
//     } catch (error) {
//       console.error(error);
//       return next(error);
//     }
//   };

//   /**
//    * --------------------------------------------------------------------
//    * UPSERT CONTACT PROFILE (1 per SOS profile)
//    * POST /v1/user/sos/:sosProfileId/contact
//    * --------------------------------------------------------------------
//    */
//   static upsertContactProfile = async (req, res, next) => {
//     try {
//       const userId = SosController.getUserId(req);
//       const { sosProfileId } = req.params;

//       if (!userId) {
//         throw new HttpError(401, "Unauthorized");
//       }

//       // Joi validation (implement in joiValidation)
//       // const { error } = joiValidation.upsertSosContactProfileValidation(req.body);
//       // if (error) return next(error);

//       await SosController.findUserSosProfileOrThrow(sosProfileId, userId);

//       const {
//         emergencyContacts,
//         doctorContacts,
//         addresses,
//         sectionCustomization,
//       } = req.body;

//       const defaultSectionCustomization = {
//         backgroundColor: "",
//         headerColor: "",
//         bodyColor: "",
//         buttonType: "call",
//         buttonIcon: "",
//       };

//       let contactProfile = await SosContactProfileModel.findOne({
//         where: { sosProfileId },
//       });

//       if (!contactProfile) {
//         contactProfile = await SosContactProfileModel.create({
//           sosProfileId,
//           emergencyContacts: emergencyContacts ?? [],
//           doctorContacts: doctorContacts ?? [],
//           addresses: addresses ?? [],
//           sectionCustomization: sectionCustomization ?? defaultSectionCustomization,
//         });
//       } else {
//         contactProfile.emergencyContacts =
//           emergencyContacts ?? contactProfile.emergencyContacts;

//         contactProfile.doctorContacts =
//           doctorContacts ?? contactProfile.doctorContacts;

//         contactProfile.addresses = addresses ?? contactProfile.addresses;

//         contactProfile.sectionCustomization =
//           sectionCustomization ?? contactProfile.sectionCustomization;

//         await contactProfile.save();
//       }

//       return res.status(200).json({
//         status: true,
//         message: "Contact profile saved successfully",
//         data: contactProfile,
//       });
//     } catch (error) {
//       console.error(error);
//       return next(error);
//     }
//   };

//   /**
//    * --------------------------------------------------------------------
//    * UPSERT MEDICAL PROFILE (1 per SOS profile)
//    * POST /v1/user/sos/:sosProfileId/medical
//    * --------------------------------------------------------------------
//    */
//   static upsertMedicalProfile = async (req, res, next) => {
//     try {
//       const userId = SosController.getUserId(req);
//       const { sosProfileId } = req.params;

//       if (!userId) {
//         throw new HttpError(401, "Unauthorized");
//       }

//       // Joi validation (implement in joiValidation)
//       // const { error } = joiValidation.upsertSosMedicalProfileValidation(req.body);
//       // if (error) return next(error);

//       await SosController.findUserSosProfileOrThrow(sosProfileId, userId);

//       const { medicalDetails, insuranceDetails, sectionCustomization } = req.body;

//       const defaultSectionCustomization = {
//         backgroundColor: "",
//         headerColor: "",
//         bodyColor: "",
//       };

//       let medicalProfile = await SosMedicalProfileModel.findOne({
//         where: { sosProfileId },
//       });

//       if (!medicalProfile) {
//         medicalProfile = await SosMedicalProfileModel.create({
//           sosProfileId,
//           medicalDetails: medicalDetails ?? [],
//           insuranceDetails: insuranceDetails ?? [],
//           sectionCustomization:
//             sectionCustomization ?? defaultSectionCustomization,
//         });
//       } else {
//         medicalProfile.medicalDetails =
//           medicalDetails ?? medicalProfile.medicalDetails;

//         medicalProfile.insuranceDetails =
//           insuranceDetails ?? medicalProfile.insuranceDetails;

//         medicalProfile.sectionCustomization =
//           sectionCustomization ?? medicalProfile.sectionCustomization;

//         await medicalProfile.save();
//       }

//       return res.status(200).json({
//         status: true,
//         message: "Medical profile saved successfully",
//         data: medicalProfile,
//       });
//     } catch (error) {
//       console.error(error);
//       return next(error);
//     }
//   };

//   /**
//    * --------------------------------------------------------------------
//    * GET FULL SOS PROFILE (with contact + medical)
//    * GET /v1/user/sos/:sosProfileId
//    * --------------------------------------------------------------------
//    */
//   static getSosProfile = async (req, res, next) => {
//     try {
//       const userId = SosController.getUserId(req);
//       const { sosProfileId } = req.params;

//       if (!userId) {
//         throw new HttpError(401, "Unauthorized");
//       }

//       const sosProfile = await SosProfileModel.findOne({
//         where: { id: sosProfileId, userId },
//         include: [
//           { model: SosContactProfileModel, as: "contactProfile" },
//           { model: SosMedicalProfileModel, as: "medicalProfile" },
//         ],
//       });

//       if (!sosProfile) {
//         throw new HttpError(404, "SOS profile not found or unauthorized");
//       }

//       return res.status(200).json({
//         status: true,
//         message: "SOS profile fetched successfully",
//         data: sosProfile,
//       });
//     } catch (error) {
//       console.error(error);
//       return next(error);
//     }
//   };
// }

// export default SosController;
