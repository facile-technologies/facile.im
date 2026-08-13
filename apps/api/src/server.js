import express from "express";
const app = express();
import morgan from "morgan";
import { PORT, FRONTEND_URL, NODE_ENV } from "./config/index.js";
import getDirname from "./utils/getDirName.js";
import connectDB, { sequelize } from "./database/connectDB.js";
import errorHandler from "./middlewares/errors/errorHandler.js";
import cors from "cors";
import path from "path";
import router from "./routes/v1/index.js";
import { BusinessCustomLinkCustomization, BusinessProfileLinkCustomization, initAssociations, PetProfile, ProfileContactSubmission, ProfileCustomLink, ProfileLink, ProfileSaveContact, QrCustomization, User, UserPlan } from "./models/Association.js";
import SosAddress from "./models/SosAddress.model.js";
import SosContactsCustomization from "./models/SosContactsCustomization.model.js";
import SosDoctorsContact from "./models/SosDoctorsContact.model.js";
import SosEmergencyContact from "./models/SosEmergencyContact.model.js";
import SosMedicalCustomization from "./models/SosMedicalCustomization.model.js";
import SosMedicalDetail from "./models/SosMedicalDetail.model.js";
import SosMedicalInsurance from "./models/SosMedicalInsurance.model.js";
import SosProfile from "./models/SosProfile.model.js";
import SosProfileCustomization from "./models/SosProfileCustomization.model.js";
import PlatformLink from './models/PlatformLink.model.js'
import PetAddress from "./models/PetAddress.model.js";
import PetContactsCustomization from "./models/PetContactsCustomization.model.js";
import PetDoctorsContact from "./models/PetDoctorsContact.model.js";
import PetEmergencyContact from "./models/PetEmergencyContact.model.js";
import PetIdentification from "./models/PetIdentification.model.js";
import PetMedicalCustomization from "./models/PetMedicalCustomization.model.js";
import PetMedicalDetail from "./models/PetMedicalDetail.model.js";
import PetMedicalInsurance from "./models/PetMedicalInsurance.model.js";
import PetProfileCustomization from "./models/PetProfileCustomization.model.js";
import Team from './models/Team.model.js'
import TeamMember from "./models/TeamMember.model.js";
import UserAnalytics from "./models/UserAnalytics.model.js";

import UserAnalyticsTotal from './models/UserAnalyticsTotal.model.js'
import Template from "./models/Template.model.js";
import UserAnalyticsCountryDaily from './models/UserAnalyticsCountryDaily.model.js'
import RecentActivities from './models/RecentActivity.model.js'
import UserProfile from "./models/UserProfile.model.js";

import ProfileType from './models/ProfileType.model.js'
import ProfileMedia from "./models/ProfileMedia.model.js";
import ProfileMediaCustomization from "./models/ProfileMediaCustomization.model.js"; import UserModel from "./models/User.model.js"
import UniqueCode from "./models/UniqueCode.model.js";
import Otp from "./models/Otp.model.js";
import PersonalProfile from "./models/PersonalProfile.model.js"
import BusinessProfile from "./models/BusinessProfile.model.js";
import Product from "./models/Product.model.js";
import ProductFile from "./models/ProductFile.model.js";
import ProfileProduct from "./models/ProfileProduct.model.js";
import ProfileProductSetting from "./models/ProfileProductSetting.model.js";
import ProductCustomization from "./models/ProductCustomization.model.js";
import StripeConnectAccount from "./models/StripeConnectAccount.model.js";
import ProductPurchase from "./models/ProductPurchase.model.js";
import ProductView from "./models/ProductView.model.js";
import UserAnalyticsCountryTotal from "./models/UserAnalyticsCountryTotal.model.js";
import UserAnalyticsSource from "./models/UserAnalyticsSource.model.js";
import UserAnalyticsHourly from "./models/UserAnalyticsHourly.model.js";
import PlatformLinkAnalytics from "./models/PlatformLinkAnalytics.model.js";
import CustomLinkAnalytics from "./models/CustomLinkAnalytics.model.js";

// app.use(express.json());
app.use(express.json({
  limit: "50mb",
  verify: (req, res, buf) => {
    if (req.originalUrl.includes("/webhook")) {
      req.rawBody = buf;
    }
  }
}));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.disable("x-powered-by");

// CORS — allowlist real origins. Frontends are served same-origin (nginx), so
// browser requests carry the site's own Origin; localhost is allowed only in dev.
const allowedOrigins = [
  FRONTEND_URL,
  "https://facile.im",
  "https://www.facile.im",
  "https://staging.facile.im",
  ...(NODE_ENV === "dev"
    ? ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]
    : []),
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser / same-origin requests with no Origin header (curl, health checks, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin not allowed: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Static
const __dirname = getDirname(import.meta.url);
app.use("/public", express.static(__dirname + "/public"));
app.use("/profile_pic", express.static(path.resolve("public", "profile_pic")));
app.use("/uploads", express.static(path.resolve("public", "uploads")));
app.use(
  "/public/exports",
  express.static(path.resolve("public", "exports"))
);

// Health + routes
app.use("/health", (req, res) => {
  res.json({ STATUS: "OK", MESSAGE: "Welcome to FACILE REST API's" });
});

app.use("/", router);

// Errors
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({ STATUS: "ERROR", MESSAGE: "Page not Found" });
});

// Startup sequence
(async () => {
  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Init associations (sets up relationships between models)
    initAssociations();

    // 3. Schema is managed by umzug migrations (`npm run migrate`), applied by the
    //    deploy pipeline before this process reloads. No sync() on boot — migrations
    //    are the single source of truth (add a file in ./migrations to change schema).

    // 4. Start server
    const server = app.listen(PORT, () => {
      console.log(`app is listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error during startup:", error);
    process.exit(1);
  }
})();
