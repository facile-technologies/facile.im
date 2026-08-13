import express from "express";
import {
  getProductCustomization,
  updateProductCustomization,
} from "../../controllers/ProductCustomization.controller.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();

router.use(auth);

router.get("/:user_profile_id", getProductCustomization);
router.post("/", updateProductCustomization);

export default router;
