// routes/index.js

import { Router } from "express";
const router = Router();

import userRouter from "./user.routes.js";
import personalprofileRouter from "./personalprofile.routes.js";
import businessprofileRouter from "./Businessprofile.routes.js"
import sosprofileRouter from "./Sosprofile.routes.js"
import petprofileRouter from "./Petprofile.routes.js"
import storeFrontRouter from "./Storefrontprofile.routes.js"
import teamRouter from './teams.route.js'
import adminRouter from "./Admin.routes.js"
import deviceRouter from "./device.routes.js"
import dashboardRouter from "./dashboard.routes.js"
import qrRouter from "./qr.routes.js"
import templateRouter from "./template.route.js"
import publicprofileRouter from "./publicprofile.routes.js";
import contactsRouter from "./contacts.routes.js";
import PaymentRoutes from "./payment.routes.js";
import productPaymentRouter from "./productPayment.routes.js";
import productRouter from "./product.routes.js";
import productCustomizationRouter from "./productCustomization.routes.js";
import profileProductSettingRouter from "./profileProductSetting.routes.js";

router.use("/v1/user", userRouter);
router.use("/v1/profile/personal", personalprofileRouter);
router.use("/v1/profile/business", businessprofileRouter);
router.use("/v1/profile/sos", sosprofileRouter);
router.use("/v1/profile/pet", petprofileRouter);
router.use("/v1/template", templateRouter);
router.use("/v1/profile/storefront", storeFrontRouter);
router.use("/v1/team", teamRouter);
router.use("/v1/device", deviceRouter);
router.use("/v1/dashboard", dashboardRouter);
router.use("/v1/qr", qrRouter);
router.use("/v1/profile/public", publicprofileRouter);
router.use("/v1/contacts", contactsRouter);
router.use("/v1/payment", productPaymentRouter);
router.use("/v1/payment", PaymentRoutes);
router.use("/v1/products", productRouter);
router.use("/v1/products/customization", productCustomizationRouter);
router.use("/v1/products/settings", profileProductSettingRouter);


// Admin Routes

router.use("/v1/admin", adminRouter);

export default router;
