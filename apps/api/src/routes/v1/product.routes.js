import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  mapProductToProfile,
  unmapProductFromProfile,
  getProfileProducts,
} from "../../controllers/Product.controller.js";
import auth from "../../middlewares/auth.js";
import upload from "../../middlewares/multer.js";

const router = express.Router();

router.use(auth);

// Product CRUD
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post(
  "/",
  upload.fields([
    { name: "productImage", maxCount: 1 },
    { name: "productFile", maxCount: 10 },
    { name: "productFileImage", maxCount: 10 },
    { name: "productLinkImage", maxCount: 10 },
  ]),
  createProduct
);
router.patch(
  "/:id",
  upload.fields([
    { name: "productImage", maxCount: 1 },
    { name: "productFile", maxCount: 10 },
    { name: "productFileImage", maxCount: 10 },
    { name: "productLinkImage", maxCount: 10 },
  ]),
  updateProduct
);
// Product Mapping
router.post("/map", mapProductToProfile);
router.delete("/unmap", unmapProductFromProfile);
router.get("/profile/:user_profile_id", getProfileProducts);

router.delete("/:id", deleteProduct);

export default router;
