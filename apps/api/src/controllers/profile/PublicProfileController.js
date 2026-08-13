// src/controllers/profile/PublicProfileController.js

import User from "../../models/User.model.js";
import ProfileType from "../../models/ProfileType.model.js";
import PersonalProfile from "../../models/PersonalProfile.model.js";
import BusinessProfile from "../../models/BusinessProfile.model.js";
import UserProfile from "../../models/UserProfile.model.js";
import ProfileCustomization from "../../models/ProfileCustomization.model.js";
import PlatformLink from "../../models/PlatformLink.model.js";
import ProfileLink from "../../models/ProfileLink.model.js";
import ProfileCustomLink from "../../models/ProfileCustomLink.model.js";
import ProfileContact from "../../models/ProfileContact.model.js";
import ProfileContactField from "../../models/ProfileContactField.model.js";
import ProfileSaveContact from "../../models/ProfileSaveContact.model.js";
import ProfileMediaCustomization from "../../models/ProfileMediaCustomization.model.js";
import ProfileMedia from "../../models/ProfileMedia.model.js";
import ProfileContactSubmission from "../../models/ProfileContactSubmission.model.js";
import UniqueCode from "../../models/UniqueCode.model.js";
import { SERVER_URL_NORMALIZED } from "../../config/index.js";

import BusinessProfileLinkCustomization from "../../models/BusinessProfileLinkCustomization.model.js";
import BusinessCustomLinkCustomization from "../../models/BusinessCustomLinkCustomization.model.js";
import PersonalCustomLinkCustomization from "../../models/PersonalCustomLinkCustomization.model.js";
import PersonalProfileLinkCustomization from "../../models/PersonalProfileLinkCustomization.model.js";

import Product from "../../models/Product.model.js";
import ProductFile from "../../models/ProductFile.model.js";
import ProductCustomization from "../../models/ProductCustomization.model.js";
import ProfileProduct from "../../models/ProfileProduct.model.js";
import ProfileProductSetting from "../../models/ProfileProductSetting.model.js";
import StripeConnectAccount from "../../models/StripeConnectAccount.model.js";
import ProductView from "../../models/ProductView.model.js";
import axios from "axios";

import HttpError from "../../middlewares/errors/HttpError.js";
import UserAnalytics from "../../models/UserAnalytics.model.js";
import UserAnalyticsTotal from "../../models/UserAnalyticsTotal.model.js";
import UserAnalyticsHourly from "../../models/UserAnalyticsHourly.model.js";
import HelperMethods from "../../utils/helper.js";
import UserAnalyticsCountryTotal from "../../models/UserAnalyticsCountryTotal.model.js";
import UserAnalyticsSource from "../../models/UserAnalyticsSource.model.js";
import { platform } from "os";
import PlatformLinkAnalytics from "../../models/PlatformLinkAnalytics.model.js";
import CustomLinkAnalytics from "../../models/CustomLinkAnalytics.model.js";
import { where } from "sequelize";

// Rescue profile models
import SosProfile from "../../models/SosProfile.model.js";
import SosProfileCustomization from "../../models/SosProfileCustomization.model.js";
import SosAddress from "../../models/SosAddress.model.js";
import SosContactsCustomization from "../../models/SosContactsCustomization.model.js";
import SosDoctorsContact from "../../models/SosDoctorsContact.model.js";
import SosEmergencyContact from "../../models/SosEmergencyContact.model.js";
import SosMedicalCustomization from "../../models/SosMedicalCustomization.model.js";
import SosMedicalDetail from "../../models/SosMedicalDetail.model.js";
import SosMedicalInsurance from "../../models/SosMedicalInsurance.model.js";

import PetProfile from "../../models/PetProfile.model.js";
import PetProfileCustomization from "../../models/PetProfileCustomization.model.js";
import PetAddress from "../../models/PetAddress.model.js";
import PetContactsCustomization from "../../models/PetContactsCustomization.model.js";
import PetDoctorsContact from "../../models/PetDoctorsContact.model.js";
import PetEmergencyContact from "../../models/PetEmergencyContact.model.js";
import PetMedicalCustomization from "../../models/PetMedicalCustomization.model.js";
import PetMedicalDetail from "../../models/PetMedicalDetail.model.js";
import PetMedicalInsurance from "../../models/PetMedicalInsurance.model.js";
import PetIdentification from "../../models/PetIdentification.model.js";

// Helper function to build the unified profile response
const buildUnifiedProfileResponse = async (userProfile, profileData, exactType, visitorIp = null) => {
  const userId = userProfile.user_id;
  const user = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  // 4. Fetch Customization
  let customization = await ProfileCustomization.findOne({
    where: { user_profile_id: userProfile.id },
  });

  // 5. Fetch Links
  const links = await ProfileLink.findAll({
    where: { user_profile_id: userProfile.id },
    include: [{ model: PlatformLink }],
    order: [["sequence", "ASC"]],
  });

  let linkCustomization = null;
  if (exactType === "PERSONAL") {
    linkCustomization = await PersonalProfileLinkCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });
  } else {
    linkCustomization = await BusinessProfileLinkCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });
  }

  // 6. Fetch Custom Links
  const customLinks = await ProfileCustomLink.findAll({
    where: { user_profile_id: userProfile.id },
    order: [["sequence", "ASC"]],
  });

  let customLinkCustomization = null;
  if (exactType === "PERSONAL") {
    customLinkCustomization = await PersonalCustomLinkCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });
  } else {
    customLinkCustomization = await BusinessCustomLinkCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });
  }

  // 7. Fetch Media
  const media = await ProfileMedia.findAll({
    where: { user_profile_id: userProfile.id },
    order: [["sequence", "ASC"]],
  });

  const mediaCustomization = await ProfileMediaCustomization.findOne({
    where: { user_profile_id: userProfile.id },
  });

  // 8. Fetch Contact Config
  const contact = await ProfileContact.findOne({
    where: { user_profile_id: userProfile.id },
  });

  let contactFields = [];
  if (contact) {
    contactFields = await ProfileContactField.findAll({
      where: { profile_contacts_id: contact.id },
      order: [["sort_order", "ASC"]],
    });
  }

  // 9. Fetch Save Contact button
  const saveContact = await ProfileSaveContact.findOne({
    where: { profile_id: profileData.id },
  });

  // 10. Fetch Products mapped to this profile (with files + per-profile display settings)
  const productCustomization = await ProductCustomization.findOne({
    where: { user_profile_id: userProfile.id },
  });

  // Step 1: Get product IDs mapped to this profile directly from the join table.
  // Using a direct ProfileProduct query is more reliable than a belongsToMany
  // include with required:true+where, which can produce empty results in Sequelize 6.
  const profileProductRows = await ProfileProduct.findAll({
    where: { user_profile_id: userProfile.id },
    attributes: ["product_id"],
    raw: true,
  });
  const mappedProductIds = profileProductRows.map((row) => row.product_id);

  let products = [];
  if (mappedProductIds.length > 0) {
    const rawProducts = await Product.findAll({
      where: { id: mappedProductIds },
      include: [
        { model: ProductFile, as: "files" },
        {
          model: ProfileProductSetting,
          as: "displaySettings",
          where: { user_profile_id: userProfile.id },
          required: false,
        },
      ],
    });

    products = rawProducts
      .map((p) => {
        const pJson = p.toJSON();
        const setting = pJson.displaySettings?.[0] || null;
        const isVisible = setting ? setting.is_visible : true;
        const sequence = setting ? setting.sequence : 0;

        const imageUrl = pJson.image_url
          ? pJson.image_url.startsWith("http")
            ? pJson.image_url
            : `${SERVER_URL_NORMALIZED}${pJson.image_url.startsWith("/") ? "" : "/"}${pJson.image_url}`
          : null;

        const files = (pJson.files || []).map((f) => ({
          ...f,
          url: f.url
            ? f.url.startsWith("http")
              ? f.url
              : `${SERVER_URL_NORMALIZED}${f.url.startsWith("/") ? "" : "/"}${f.url}`
            : f.url,
          image_url: f.image_url
            ? f.image_url.startsWith("http")
              ? f.image_url
              : `${SERVER_URL_NORMALIZED}${f.image_url.startsWith("/") ? "" : "/"}${f.image_url}`
            : null,
        }));

        return {
          ...pJson,
          image_url: imageUrl,
          files,
          is_visible: isVisible,
          sequence,
          displaySettings: undefined,
        };
      })
      .filter((p) => p.is_visible !== false)
      .sort((a, b) => a.sequence - b.sequence);

    // Fire-and-forget: one ProductView row per visible product on every profile load.
    // Does NOT block the response — errors are silently ignored.
    if (products.length > 0) {
      const cleanIp = visitorIp?.startsWith("::ffff:") ? visitorIp.slice(7) : (visitorIp || null);

      // Resolve country once via ipapi.co, then stamp all product views with it.
      (async () => {
        let buyerCountry = null;
        if (cleanIp) {
          try {
            const geo = await axios.get(`https://ipapi.co/${cleanIp}/json/`, { timeout: 3000 });
            buyerCountry = geo.data?.country_code || null;
          } catch {
            // country stays null — non-blocking
          }
        }

        await Promise.all(
          products.map((p) =>
            ProductView.create({
              product_id:      p.id,
              user_profile_id: userProfile.id,
              seller_user_id:  p.user_id,
              buyer_country:   buyerCountry,
              buyer_ip:        cleanIp ? cleanIp.substring(0, 45) : null,
            })
          )
        );
      })().catch(() => {}); // never let view tracking errors bubble up
    }
  }

  // Check whether the seller has Stripe Connect set up (for showing Buy Now button)
  const connectAccount = await StripeConnectAccount.findOne({
    where: { user_id: userId },
    attributes: ["charges_enabled"],
  });
  const seller_has_payment_setup = connectAccount?.charges_enabled === true;

  // 10. URL Normalization
  const profileJson = profileData.toJSON();
  const profileWithServer = {
    ...profileJson,
    profile_image: profileJson.profile_image
      ? `${SERVER_URL_NORMALIZED}${profileJson.profile_image.startsWith("/") ? "" : "/"}${profileJson.profile_image}`
      : profileJson.profile_image,
    banner: profileJson.banner
      ? `${SERVER_URL_NORMALIZED}${profileJson.banner.startsWith("/") ? "" : "/"}${profileJson.banner}`
      : profileJson.banner,
    logo: profileJson.logo
      ? `${SERVER_URL_NORMALIZED}${profileJson.logo.startsWith("/") ? "" : "/"}${profileJson.logo}`
      : profileJson.logo,
  };

  const customizationJson = customization ? customization.toJSON() : null;
  const customizationWithServer = customizationJson
    ? {
        ...customizationJson,
        background_image: customizationJson.background_image
          ? `${SERVER_URL_NORMALIZED}${customizationJson.background_image.startsWith("/") ? "" : "/"}${customizationJson.background_image}`
          : customizationJson.background_image,
      }
    : null;

  const mediaWithServer = media.map((m) => {
    const j = m.toJSON();
    return {
      ...j,
      media_url: j.media_url
        ? `${SERVER_URL_NORMALIZED}${j.media_url.startsWith("/") ? "" : "/"}${j.media_url}`
        : j.media_url,
    };
  });

  const customLinksWithServer = customLinks.map((cl) => {
    const j = cl.toJSON();
    return {
      ...j,
      thumbnail: j.thumbnail
        ? `${SERVER_URL_NORMALIZED}${j.thumbnail.startsWith("/") ? "" : "/"}${j.thumbnail}`
        : j.thumbnail,
      icon: j.icon
        ? `${SERVER_URL_NORMALIZED}${j.icon.startsWith("/") ? "" : "/"}${j.icon}`
        : j.icon,
    };
  });

  return {
    profileType: exactType,
    user,
    profile: profileWithServer,
    userProfile,
    customization: customizationWithServer,
    links,
    linkCustomization,
    customLinks: customLinksWithServer,
    customLinkCustomization,
    media: mediaWithServer,
    mediaCustomization,
    contact,
    contactFields,
    saveContact,
    products,
    productCustomization,
    seller_has_payment_setup,
  };
};

const PublicProfileController = {
  getPublicProfileByUsername: async (req, res, next) => {
    debugger
    const { username } = req.params;

    const { source } = req.query;
    if (!username) {
      return next(new HttpError(400, "Username is required"));
    }

    if(!source){
      return next(new HttpError(400, "Source is required"));
    }

    try {
      let profileData = null;
      let userProfile = null;
      let exactType = null;

      // 1. Search in PersonalProfile
      profileData = await PersonalProfile.findOne({ where: { username } });
      if (profileData) {
        // Find UserProfile specifically for PERSONAL type
        const userProfileMatch = await UserProfile.findOne({
          where: { profile_id: profileData.id },
          include: [{ 
            model: ProfileType,
            where: { type: 'PERSONAL' }
          }],
        });
        
        if (userProfileMatch) {
          userProfile = userProfileMatch;
          exactType = "PERSONAL";
        } else {
          profileData = null;
        }
      }

      if (!profileData) {
        // 2. Search in BusinessProfile
        profileData = await BusinessProfile.findOne({ where: { username } });
        if (profileData) {
          // Find UserProfile for BUSINESS or STORE_FRONT type
          const userProfileMatch = await UserProfile.findOne({
            where: { profile_id: profileData.id },
            include: [{ 
              model: ProfileType,
              where: { type: ['BUSINESS', 'STORE_FRONT'] }
            }],
          });

          if (userProfileMatch) {
            userProfile = userProfileMatch;
            exactType = userProfileMatch.ProfileType.type;
          } else {
            profileData = null;
          }
        }
      }

      if (!profileData || !userProfile) {
        return next();
      }


      if (userProfile) {

 const now = new Date();
  const utcDate = now.toISOString().split("T")[0]; // "2026-04-08"

  // ✅ Full UTC hour timestamp, not just the number
  const utcHourStart = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      0, 0, 0
    )
  ); // "2026-04-08T09:00:00.000Z"                      // 0-23

  const [userAnalytics, created] = await UserAnalytics.findOrCreate({
    where: {
      user_profile_id: userProfile.id,
      analytics_date: utcDate,        // ← scoped to today only
    },
    defaults: {
      user_id: userProfile.user_id,
      views_count: 1,
    },
  });

  if (!created) {
    await userAnalytics.increment("views_count");
  }


  let userAnalyticsTotal = await UserAnalyticsTotal.findOne({
    where: {
      user_profile_id: userProfile.id,
    },
  });

  if (!userAnalyticsTotal) {
    userAnalyticsTotal = await UserAnalyticsTotal.create({
      user_id: userProfile.user_id,
      user_profile_id: userProfile.id,
      total_views: 1,
    });
  }else{
    await userAnalyticsTotal.increment("total_views");
  }



   // Hourly analytics
  const [userAnalyticsHourly, hourlyCreated] = await UserAnalyticsHourly.findOrCreate({
    where: {
      user_profile_id: userProfile.id,
      analytics_hour_utc: utcHourStart, // ✅ full timestamp, not just 9
    },
    defaults: {
      user_id: userProfile.user_id,
      analytics_date: utcDate,          // ✅ derived from same "now"
      views_count: 1,
    },
  });
  if (!hourlyCreated) {
    await userAnalyticsHourly.increment("views_count");
  }



  // ✅ Country analytics
  const { country_code, country_name } = HelperMethods.getCountryFromRequest(req);

  const [countryAnalytics, countryCreated] = await UserAnalyticsCountryTotal.findOrCreate({
    where: {
      user_profile_id: userProfile.id,
      country_code,                         // one row per profile per country
    },
    defaults: {
      user_id: userProfile.user_id,
      country_name,
      total_views_count: 1,
    },
  });
  if (!countryCreated) await countryAnalytics.increment("total_views_count");







  const [userAnalyticsSource, sourceCreated] = await UserAnalyticsSource.findOrCreate({
    where: {
      user_profile_id: userProfile.id,
      analytics_hour_utc: utcHourStart, // ✅ full timestamp, not just 9
      source,
    },
    defaults: {
      user_id: userProfile.user_id,
      analytics_date: utcDate,          // ✅ derived from same "now"
      views_count: 1,
    },
  });
  if (!sourceCreated) {
    await userAnalyticsSource.increment("views_count");
  }



}




      const visitorIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || null;
      const responseData = await buildUnifiedProfileResponse(userProfile, profileData, exactType, visitorIp);
      return res.json(responseData);

    } catch (err) {
      console.error("Error in getPublicProfileByUsername:", err);
      return next(err);
    }
  },

  resolveCodeProfileType: async (req, res, next) => {
    const { code } = req.params;

    if (!code) {
      return next(new HttpError(400, "Code is required"));
    }

    try {
      const uniqueCode = await UniqueCode.findOne({ where: { code } });

      if (!uniqueCode) {
        return next(new HttpError(404, "Code not found"));
      }

      if (!uniqueCode.user_profile_id) {
        return next(new HttpError(404, "This code is not linked to any profile"));
      }

      const userProfile = await UserProfile.findByPk(uniqueCode.user_profile_id, {
        include: [{ model: ProfileType, attributes: ["type"] }],
      });

      if (!userProfile) {
        return next(new HttpError(404, "Profile not found"));
      }

      return res.status(200).json({
        success: true,
        profileType: userProfile.ProfileType?.type ?? null,
      });
    } catch (err) {
      console.error("Error in resolveCodeProfileType:", err);
      return next(err);
    }
  },

  getPublicProfileByCode: async (req, res, next) => {
    const { code } = req.params;

    if (!code) {
      return next(new HttpError(400, "Code is required"));
    }

    try {
      // 1. Find UniqueCode with ACTIVATED status
      const uniqueCodeLine = await UniqueCode.findOne({
        where: { code, status: "ACTIVATED" },
      });

      if (!uniqueCodeLine || !uniqueCodeLine.user_profile_id) {
        return next(new HttpError(404, "Code not found or not activated"));
      }

      // 2. Get UserProfile with ProfileType
      const userProfile = await UserProfile.findByPk(uniqueCodeLine.user_profile_id, {
        include: [{ model: ProfileType }],
      });

      if (!userProfile) {
        return next(new HttpError(404, "Associated profile not found"));
      }

      const exactType = userProfile.ProfileType.type;
      let profileData = null;

      // 3. Fetch specific profile data
      if (exactType === "PERSONAL") {
        profileData = await PersonalProfile.findByPk(userProfile.profile_id);
      } else if (exactType === "BUSINESS" || exactType === "STORE_FRONT") {
        profileData = await BusinessProfile.findByPk(userProfile.profile_id);
      }

      if (!profileData) {
        return next(new HttpError(404, "Profile data not found"));
      }


        if (userProfile) {

 const now = new Date();
  const utcDate = now.toISOString().split("T")[0]; // "2026-04-08"

  // ✅ Full UTC hour timestamp, not just the number
  const utcHourStart = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      0, 0, 0
    )
  ); // "2026-04-08T09:00:00.000Z"                      // 0-23

  const [userAnalytics, created] = await UserAnalytics.findOrCreate({
    where: {
      user_profile_id: userProfile.id,
      analytics_date: utcDate,        // ← scoped to today only
    },
    defaults: {
      user_id: userProfile.user_id,
      views_count: 1,
    },
  });

  if (!created) {
    await userAnalytics.increment("views_count");
  }


  let userAnalyticsTotal = await UserAnalyticsTotal.findOne({
    where: {
      user_profile_id: userProfile.id,
    },
  });

  if (!userAnalyticsTotal) {
    userAnalyticsTotal = await UserAnalyticsTotal.create({
      user_id: userProfile.user_id,
      user_profile_id: userProfile.id,
      total_views: 1,
    });
  }else{
    await userAnalyticsTotal.increment("total_views");
  }



   // Hourly analytics
  const [userAnalyticsHourly, hourlyCreated] = await UserAnalyticsHourly.findOrCreate({
    where: {
      user_profile_id: userProfile.id,
      analytics_hour_utc: utcHourStart, // ✅ full timestamp, not just 9
    },
    defaults: {
      user_id: userProfile.user_id,
      analytics_date: utcDate,          // ✅ derived from same "now"
      views_count: 1,
    },
  });
  if (!hourlyCreated) {
    await userAnalyticsHourly.increment("views_count");
  }



  // ✅ Country analytics
  const { country_code, country_name } = HelperMethods.getCountryFromRequest(req);

  const [countryAnalytics, countryCreated] = await UserAnalyticsCountryTotal.findOrCreate({
    where: {
      user_profile_id: userProfile.id,
      country_code,                         // one row per profile per country
    },
    defaults: {
      user_id: userProfile.user_id,
      country_name,
      total_views_count: 1,
    },
  });
  if (!countryCreated) await countryAnalytics.increment("total_views_count");

}
      // 4. Build response using helper
      const visitorIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || null;
      const responseData = await buildUnifiedProfileResponse(userProfile, profileData, exactType, visitorIp);
      return res.json(responseData);

    } catch (err) {
      console.error("Error in getPublicProfileByCode:", err);
      return next(err);
    }
  },

  getPublicRescueProfile: async (req, res, next) => {
    const { type, username } = req.params; // type = "pet" | "sos"

    if (!type || !["pet", "sos"].includes(type.toLowerCase())) {
      return next(new HttpError(400, "type must be 'pet' or 'sos'"));
    }
    if (!username) {
      return next(new HttpError(400, "username or code is required"));
    }

    let profileType = type.toLowerCase() === "pet" ? "PET" : "SOS";

    try {
      let user = null;
      let userProfile = null;

      // 1a) Try to find user by username first
      user = await User.findOne({
        where: { username },
        attributes: { exclude: ["password"] },
      });

      if (user) {
        // Username matched — find ProfileType and UserProfile normally
        const rescueType = await ProfileType.findOne({ where: { type: profileType } });
        if (!rescueType) {
          return next(new HttpError(404, "Profile not found"));
        }
        userProfile = await UserProfile.findOne({
          where: { user_id: user.id, profile_type_id: rescueType.id },
        });
        if (!userProfile) {
          return next(new HttpError(404, "Profile not found"));
        }
      } else {
        // 1b) username didn't match — try it as a unique code
        const uniqueCode = await UniqueCode.findOne({ where: { code: username } });
        if (!uniqueCode) {
          return next(new HttpError(404, "Profile not found"));
        }
        if (!uniqueCode.user_profile_id) {
          return next(new HttpError(404, "This code is not linked to any profile"));
        }

        userProfile = await UserProfile.findOne({
          where: { id: uniqueCode.user_profile_id },
          include: [{ model: ProfileType, attributes: ["id", "type", "name"] }],
        });
        if (!userProfile) {
          return next(new HttpError(404, "Profile not found"));
        }

        // Override profileType from the actual linked profile
        profileType = userProfile.ProfileType?.type;
        if (!["PET", "SOS"].includes(profileType)) {
          return next(new HttpError(400, "Linked profile is not a rescue (pet/sos) profile"));
        }

        user = await User.findOne({
          where: { id: userProfile.user_id },
          attributes: { exclude: ["password"] },
        });
        if (!user) {
          return next(new HttpError(404, "Profile not found"));
        }
      }

      if (profileType === "SOS") {
        // ── SOS ──────────────────────────────────────────────────────────────
        const sosProfile = await SosProfile.findByPk(userProfile.profile_id);
        if (!sosProfile) {
          return next(new HttpError(404, "Profile not found"));
        }

        const sosProfileCustomization =
          await SosProfileCustomization.findOne({ where: { user_profile_id: userProfile.id } }) || null;

        const sosContactsCustomization =
          await SosContactsCustomization.findOne({ where: { user_profile_id: userProfile.id } }) || null;

        const sosMedicalCustomization =
          await SosMedicalCustomization.findOne({ where: { user_profile_id: userProfile.id } }) || null;

        const [emergencyContacts, doctorsContacts, addresses, medicalDetails, medicalInsurances] =
          await Promise.all([
            SosEmergencyContact.findAll({
              where: { user_profile_id: userProfile.id },
              order: [["sequence", "ASC"], ["id", "ASC"]],
            }),
            SosDoctorsContact.findAll({
              where: { user_profile_id: userProfile.id },
              order: [["sequence", "ASC"], ["id", "ASC"]],
            }),
            SosAddress.findAll({
              where: { user_profile_id: userProfile.id },
              order: [["sequence", "ASC"], ["id", "ASC"]],
            }),
            SosMedicalDetail.findAll({
              where: { user_profile_id: userProfile.id },
              order: [["sequence", "ASC"], ["id", "ASC"]],
            }),
            SosMedicalInsurance.findAll({
              where: { user_profile_id: userProfile.id },
              order: [["created_at", "ASC"]],
            }),
          ]);

        const profileJson = sosProfile.toJSON();
        const cjson = sosProfileCustomization ? sosProfileCustomization.toJSON() : null;
        const customizationWithServer = cjson
          ? {
              ...cjson,
              background_image: cjson.background_image
                ? `${SERVER_URL_NORMALIZED}${cjson.background_image.startsWith("/") ? "" : "/"}${cjson.background_image}`
                : null,
            }
          : null;

        return res.json({
          user,
          profile: {
            ...profileJson,
            profile_image: profileJson.profile_image
              ? `${SERVER_URL_NORMALIZED}${profileJson.profile_image.startsWith("/") ? "" : "/"}${profileJson.profile_image}`
              : null,
          },
          userProfile,
          customization: customizationWithServer,
          sosContactsCustomization,
          emergencyContacts,
          doctorsContacts,
          addresses,
          sosMedicalCustomization,
          medicalDetails,
          medicalInsurances,
        });

      } else {
        // ── PET ──────────────────────────────────────────────────────────────
        const petProfile = await PetProfile.findByPk(userProfile.profile_id);
        if (!petProfile) {
          return next(new HttpError(404, "Profile not found"));
        }

        const petProfileCustomization =
          await PetProfileCustomization.findOne({ where: { user_profile_id: userProfile.id } }) || null;

        const petContactsCustomization =
          await PetContactsCustomization.findOne({ where: { user_profile_id: userProfile.id } }) || null;

        const petMedicalCustomization =
          await PetMedicalCustomization.findOne({ where: { user_profile_id: userProfile.id } }) || null;

        const petIdentification =
          await PetIdentification.findOne({ where: { user_profile_id: userProfile.id } }) || null;

        const [emergencyContacts, doctorsContacts, addresses, medicalDetails, medicalInsurances] =
          await Promise.all([
            PetEmergencyContact.findAll({
              where: { user_profile_id: userProfile.id },
              order: [["sequence", "ASC"], ["id", "ASC"]],
            }),
            PetDoctorsContact.findAll({
              where: { user_profile_id: userProfile.id },
              order: [["sequence", "ASC"], ["id", "ASC"]],
            }),
            PetAddress.findAll({
              where: { user_profile_id: userProfile.id },
              order: [["sequence", "ASC"], ["id", "ASC"]],
            }),
            PetMedicalDetail.findAll({
              where: { user_profile_id: userProfile.id },
              order: [["sequence", "ASC"], ["id", "ASC"]],
            }),
            PetMedicalInsurance.findAll({
              where: { user_profile_id: userProfile.id },
              order: [["created_at", "DESC"]],
            }),
          ]);

        const profileJson = petProfile.toJSON();
        const cjson = petProfileCustomization ? petProfileCustomization.toJSON() : null;
        const customizationWithServer = cjson
          ? {
              ...cjson,
              background_image: cjson.background_image
                ? `${SERVER_URL_NORMALIZED}${cjson.background_image.startsWith("/") ? "" : "/"}${cjson.background_image}`
                : null,
            }
          : null;

        return res.json({
          user,
          profile: {
            ...profileJson,
            profile_image: profileJson.profile_image
              ? `${SERVER_URL_NORMALIZED}${profileJson.profile_image.startsWith("/") ? "" : "/"}${profileJson.profile_image}`
              : null,
          },
          userProfile,
          customization: customizationWithServer,
          petContactsCustomization,
          emergencyContacts,
          doctorsContacts,
          addresses,
          petMedicalCustomization,
          medicalDetails,
          medicalInsurances,
          petIdentification,
        });
      }

    } catch (err) {
      console.error("Error in getPublicRescueProfile:", err);
      return next(err);
    }
  },

  submitContactForm: async (req, res, next) => {
    const { profile_id, submitted_data } = req.body;

    if (!profile_id) {
      return next(new HttpError(400, "profile_id is required"));
    }

    if (!submitted_data || typeof submitted_data !== "object" || Object.keys(submitted_data).length === 0) {
      return next(new HttpError(400, "submitted_data is required and must be a non-empty object"));
    }

    try {
      // 1. Save the submission
      await ProfileContactSubmission.create({
        profile_id,
        submitted_data,
        is_enabled: true,
      });

      // 2. Fetch success message from ProfileContact config
      const contactConfig = await ProfileContact.findOne({
        where: { profile_id },
      });

      const successMessage = contactConfig?.success_message || "Form submitted successfully!";

      return res.status(201).json({
        STATUS: "SUCCESS",
        MESSAGE: successMessage,
      });
    } catch (err) {
      console.error("Error in submitContactForm:", err);
      return next(err);
    }
  },

  profileClickCount: async (req, res, next) => {
    debugger
    const { userprofileId } = req.params;
    const {customLinkId,platformLinkId} = req.query

    if (!userprofileId) {
      return next(new HttpError(400, "Username is required"));
    }

    try {
      let profileData = null;
      let userProfile = await UserProfile.findByPk(userprofileId);

      if(!userProfile){
        return res.status(403).json({
          status:false,
          message:'User profile missing or corrupt'
        })
      }


             if (userProfile) {

  const now = new Date();
  const utcDate = now.toISOString().split("T")[0]; // "2026-04-08"

  // ✅ Full UTC hour timestamp, not just the number
  const utcHourStart = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      0, 0, 0
    )
  ); // "2026-04-08T09:00:00.000Z"                      // 0-23

  const [userAnalytics, created] = await UserAnalytics.findOrCreate({
    where: {
      user_profile_id: userProfile.id,
      analytics_date: utcDate,        // ← scoped to today only
    },
    defaults: {
      user_id: userProfile.user_id,
      clicks_count: 1,
      interactions_count:1,
    },
  });

  if (!created) {
    await userAnalytics.increment(["clicks_count", "interactions_count"]);
  }


  let userAnalyticsTotal = await UserAnalyticsTotal.findOne({
    where: {
      user_profile_id: userProfile.id,
    },
  });

  if (!userAnalyticsTotal) {
    userAnalyticsTotal = await UserAnalyticsTotal.create({
      user_id: userProfile.user_id,
      user_profile_id: userProfile.id,
      total_clicks: 1,
      total_interactions:1,
    });
  }else{
    await userAnalyticsTotal.increment(["total_clicks", "total_interactions"]);
  }



   // Hourly analytics
  const [userAnalyticsHourly, hourlyCreated] = await UserAnalyticsHourly.findOrCreate({
    where: {
      user_profile_id: userProfile.id,
      analytics_hour_utc: utcHourStart, // ✅ full timestamp, not just 9
    },
    defaults: {
      user_id: userProfile.user_id,
      analytics_date: utcDate,          // ✅ derived from same "now"
      clicks_count: 1,
      interactions_count:1,
    },
  });
  if (!hourlyCreated) {
    await userAnalyticsHourly.increment(["clicks_count", "interactions_count"]);
  }


  if(platformLinkId){

    const platformLink = await ProfileLink.findOne({ where: { id: platformLinkId, user_profile_id: userProfile.id } });

    if(!platformLink){
      return res.status(403).json({
        status:false,
        message:'Platform link missing or corrupt'
      })
    }

    const [platformLinkAnalytics, platformLinkCreated] = await PlatformLinkAnalytics.findOrCreate({
    where: {
      user_profile_id: userProfile.id,
      profile_link_id: platformLinkId,
      analytics_date: utcDate,        // ← scoped to today only
    },
    defaults: {
      user_id: userProfile.user_id,
      clicks_count: 1,
      
    },
  });


   if (!platformLinkCreated) {
    await platformLinkAnalytics.increment("clicks_count");
  }


  }


   if(customLinkId){

    const customLink = await ProfileCustomLink.findOne({ where: { id: customLinkId, user_profile_id: userProfile.id } });

    if(!customLink){
      return res.status(403).json({
        status:false,
        message:'Platform link missing or corrupt'
      })
    }

    const [platformLinkAnalytics, platformLinkCreated] = await CustomLinkAnalytics.findOrCreate({
    where: {
      user_profile_id: userProfile.id,
      custom_link_id: customLinkId,
      analytics_date: utcDate,        // ← scoped to today only
    },
    defaults: {
      user_id: userProfile.user_id,
      clicks_count: 1,
      
    },
  });


   if (!platformLinkCreated) {
    await platformLinkAnalytics.increment("clicks_count");
  }


  }

  // // ✅ Country analytics
  // const { country_code, country_name } = HelperMethods.getCountryFromRequest(req);

  // const [countryAnalytics, countryCreated] = await UserAnalyticsCountryTotal.findOrCreate({
  //   where: {
  //     user_profile_id: userProfile.id,
  //     country_code,                         // one row per profile per country
  //   },
  //   defaults: {
  //     user_id: userProfile.user_id,
  //     country_name,
  //     total_clicks_count: 1,
  //   },
  // });///////
  // if (!countryCreated) await countryAnalytics.increment("total_clicks_count");
}

    return res.status(200).json({
      status:true,
      message:'Click counted'
    })

    } catch (err) {
      console.error("Error in profileClickCount:", err);
      return next(err);
    }
  },
};

export default PublicProfileController;
