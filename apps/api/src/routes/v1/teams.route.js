import express from 'express'
const router = express.Router()


import authMiddleware from "../../middlewares/auth.js";
import upload from "../../middlewares/multer.js";
import teamController from '../../controllers/team/team.controller.js';



router.post(
  "/create-team",
  authMiddleware,
  teamController.createTeam
);


router.post(
  "/get-user-team",
  authMiddleware,
  teamController.getUserTeam
);

router.post(
  "/add-team-members",
  authMiddleware,
  teamController.addTeamMembers
);

router.get(
  "/get-team-members",
  authMiddleware,
  teamController.getTeamMembers
);


// api to get team member by id (to get member info on signup)
router.get(
  "/get-team-member/:id",
//   authMiddleware,
  teamController.getTeamMemberById
);



router.delete(
  "/delete-team-member/:id",
  authMiddleware,
  teamController.deleteTeamMember
);


router.post(
  "/accept-invitation/:id",
  authMiddleware,
  teamController.acceptInvitation
);


router.get(
  "/get-member-profiles/:memberId",
  // authMiddleware, // keeping it public as per requirements/patterns
  teamController.getMemberProfiles
);


export default router;