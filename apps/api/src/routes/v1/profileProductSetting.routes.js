import express from "express";
import {
  getProfileProductSettings,
  updateProfileProductSettings,
} from "../../controllers/ProfileProductSetting.controller.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router.use(auth);

router.get("/:user_profile_id", getProfileProductSettings);
router.post("/", updateProfileProductSettings);

export default router;
