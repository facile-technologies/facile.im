import express from 'express'
const router = express.Router()


import authMiddleware from "../../middlewares/auth.js";
import upload from "../../middlewares/multer.js";
import templateController from '../../controllers/team/template.controller.js';



// list of assigned and unassigned list of team members
router.get(
  "/members/:templateId",
  authMiddleware,
  templateController.getMembers
);


router.post(
  "/assign-template/:templateId",
  authMiddleware,
  templateController.assignTemplateToMember
);


router.post(
  "/unassign-template/:templateId",
  authMiddleware,
  templateController.unAssignTemplateFromMember
);  

router.post(
  "/create-template",
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  templateController.createTemplate
);


router.put(
  "/update-template/:id",
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  templateController.updateTemplate
);


router.get(
  "/get-all-templates",
  authMiddleware,
  templateController.getAllTemplates
);



router.get(
  "/get-template/:id",
  authMiddleware,
  templateController.getTemplateById
);








router.post(
  "/link/:templateId",
  authMiddleware,
  templateController.createTemplateProfileLink
);

router.get(
  "/link/:templateId",
  authMiddleware,
  templateController.getTemplateProfileLinks
);

router.put(
"/links/sequence/:templateId",
authMiddleware,
templateController.updateTemplateProfileLinksSequence
);


router.patch(
 "/:templateId/links/:linkId",
 authMiddleware,
 templateController.editTemplateProfileLink
);

///
router.delete(
    "/:templateId/links/:linkId",
  authMiddleware,
  templateController.deleteTemplateProfileLink
);

router.patch(
  "/link/customization/:templateId",
  authMiddleware,
  templateController.updateTemplateProfileLinkCustomization
);




router.post(
  "/custom-link/:templateId",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  templateController.createTemplateCustomLink
);

router.get(
  "/custom-link/:templateId",
  authMiddleware,
  templateController.getMyTemplateCustomLinks
);

router.put(
  "/custom-link/sequence/:templateId",
  authMiddleware,
  templateController.updateTemplateCustomLinksSequence
);

//
router.patch(
  "/:templateId/custom-link/:linkId",
  authMiddleware,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  templateController.editTemplateCustomLink
);

router.delete(
  "/:templateId/custom-link/:linkId",
  authMiddleware,
  templateController.deleteTemplateCustomLink
);

router.patch(
  "/custom-link/customization/:templateId",
  authMiddleware,
  templateController.updateTemplateCustomLinkCustomization
);


router.get(
  "/contact/:templateId",
  authMiddleware,
templateController.getTemplateProfileContact
);

//

router.put(
  "/contact/:templateId",
  authMiddleware,
  templateController.updateTemplateProfileContact
);

router.get(
  "/contact/save/:templateId",
  authMiddleware,
  templateController.getTemplateProfileSaveContact
);



router.put(
  "/contact/save/:templateId",
  authMiddleware, 
  templateController.updateTemplateProfileSaveContact
);



router.patch(
  "/contact/save/status/:templateId",
  authMiddleware,
  templateController.toggleTemplateSaveContactStatus
);

router.post("/media/:templateId",
  authMiddleware,
  upload.single("media"),
  templateController.createTemplateProfileMedia
  );


router.put(["/media", "/media/:templateId"],
  authMiddleware,
  templateController.updateTemplateMediaSequenceAndLayout
);

  
router.delete(
  "/media/:id",
  authMiddleware,
  templateController.deleteTemplateProfileMedia
);




export default router;