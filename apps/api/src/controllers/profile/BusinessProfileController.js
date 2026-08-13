// src/controllers/profile/BusinessProfileController.js

import User from "../../models/User.model.js";
import ProfileType from "../../models/ProfileType.model.js";
import BusinessProfile from "../../models/BusinessProfile.model.js";
import PersonalProfile from "../../models/PersonalProfile.model.js";
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
import { SERVER_URL_NORMALIZED } from "../../config/index.js";

// Business-specific customizations (create these similar to Personal* ones)
import BusinessProfileLinkCustomization from "../../models/BusinessProfileLinkCustomization.model.js";
import BusinessCustomLinkCustomization from "../../models/BusinessCustomLinkCustomization.model.js";

import HttpError from "../../middlewares/errors/HttpError.js";
import HelperMethods from "../../utils/helper.js";
import TemplateModel from "../../models/Template.model.js";
import TeamModel from "../../models/Team.model.js";
import UserAnalyticsTotal from "../../models/UserAnalyticsTotal.model.js";
import UserAnalytics from "../../models/UserAnalytics.model.js";
import { Op } from "sequelize";
import { sequelize } from "../../database/connectDB.js";
import UserAnalyticsCountryTotal from "../../models/UserAnalyticsCountryTotal.model.js";
import PlatformLinkAnalytics from "../../models/PlatformLinkAnalytics.model.js";
import UserAnalyticsSource from "../../models/UserAnalyticsSource.model.js";
import ProfileContactSubmission from "../../models/ProfileContactSubmission.model.js";
import UserAnalyticsHourly from "../../models/UserAnalyticsHourly.model.js";


const BusinessProfileController = {
  /**
   * GET /v1/profile/business/me
   * - Ensures BUSINESS ProfileType exists
   * - Ensures UserProfile + BusinessProfile + ProfileCustomization
   * - Ensures links/customLinks + their customizations
   * - Ensures contact + fields
   * - Ensures save-contact button styling
   * - Returns all of the above
   */
  getMyBusinessProfile: async (req, res, next) => {
    const userId = req.user?.id;

    const { userProfileId } = req.params;
    if (!userId) {
      return next(new HttpError(401, "Unauthorized: user not found"));
    }

    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      //
      // 1. Ensure ProfileType BUSINESS exists
      //
      let businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });

      if (!businessType) {
        businessType = await ProfileType.create({
          type: "BUSINESS",
          category: "NETWORK",
          name: "Business",
          description: "Business profile",
        });
      }

      //
      // 2. Find or create userProfile + businessProfile + profile customization
      //
      let userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });

      if (!userProfile) {
        return HttpError(404, "Business profile not found.")
      }

      // let businessProfile;
      // let customization;

      // if (!userProfile) {
      //   const fallbackBusinessName =
      //     user.business_name || user.full_name || user.username || "My Business";

      //   businessProfile = await BusinessProfile.create({
      //     user_id: userId,
      //     business_name: fallbackBusinessName,
      //     username: user.username || null,
      //     bio: "",
      //     banner: null,
      //     profile_image: null,
      //     logo: null,
      //   });

      //   userProfile = await UserProfile.create({
      //     user_id: userId,
      //     profile_type_id: businessType.id,
      //     profile_id: businessProfile.id,
      //     profile_type_name: "Business Profile",
      //     role: "OWNER",
      //     is_primary: false,
      //     is_active: true,
      //   });

      //   customization = await ProfileCustomization.create({
      //     user_profile_id: userProfile.id,
      //     profile_id: businessProfile.id,
      //     about_text_color: "#ffffff",
      //     font_family: "inter",
      //     font_size: 16,
      //     background_color: "#000000",
      //     background_image: null,
      //     background_blur: 0,
      //     layout: "DEFAULT",
      //   });
      // } else {
      //   businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);

      //   if (!businessProfile) {
      //     return next(
      //       new HttpError(500, "Corrupted profile: missing BusinessProfile")
      //     );
      //   }

      //   customization = await ProfileCustomization.findOne({
      //     where: { user_profile_id: userProfile.id },
      //   });

      //   if (!customization) {
      //     customization = await ProfileCustomization.create({
      //       user_profile_id: userProfile.id,
      //       profile_id: businessProfile.id,
      //       about_text_color:"#ffff",
      //       font_family: "inter",
      //       font_size: 16,
      //       background_color: "#000000",
      //       background_image: null,
      //       background_blur: 0,
      //       layout: "DEFAULT",
      //     });
      //   }
      // }



      let businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);

      if (!businessProfile) {
        return next(
          new HttpError(500, "Corrupted profile: missing BusinessProfile")
        );
      }

      let customization = await ProfileCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      });

      if (!customization) {
        customization = await ProfileCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          about_text_color: "#ffff",
          font_family: "inter",
          font_size: 16,
          background_color: "#000000",
          background_image: null,
          background_blur: 0,
          layout: "DEFAULT",
        });
      }

      //
      // 3. PLATFORM LINKS + THEIR CUSTOMIZATION
      //
      const links = await ProfileLink.findAll({
        where: { user_profile_id: userProfile.id },
        include: [{ model: PlatformLink }],
        order: [["sequence", "ASC"]],
      });

      let linkCustomization = await BusinessProfileLinkCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
        },
      });

      if (!linkCustomization) {
        linkCustomization = await BusinessProfileLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          icon_styled: "DEFAULT",
          layout: "ICONS",
          background_color: "#1C1D2d",
          title_color: "#ffff",
          link_color: "#ffff",
        });
      }

      //
      // 4. CUSTOM LINKS + THEIR CUSTOMIZATION
      //
      const customLinks = await ProfileCustomLink.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      let customLinkCustomization = await BusinessCustomLinkCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
        },
      });

      if (!customLinkCustomization) {
        customLinkCustomization = await BusinessCustomLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          layout: "ICONS",
          background_color: "#1C1D2d",
          title_color: "#ffff",
        });
      }



      const media = await ProfileMedia.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      let mediaCustomization = await ProfileMediaCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
        },
      });

      if (!mediaCustomization) {
        mediaCustomization = await ProfileMediaCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          layout: "CAROUSAL",
        });
      }

      //
      // 5. CONTACT CONFIG + FIELDS (auto-create defaults if missing)
      //
      let contact = await ProfileContact.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
        },
      });

      if (!contact) {
        contact = await ProfileContact.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          title: "",
          description: "",
          layout: "COMPACT",
          is_enabled: true,
          button_text: "Contact",
          button_corner_radius: 10,
          button_bg_color: "#4f2e86",
          button_text_color: "#ffff",
          success_message: "",
        });

        await ProfileContactField.create({
          profile_contacts_id: contact.id,
          field_type: "EMAIL",
          label: "Email",
          placeholder: "Enter your email",
          is_enabled: true,
          sort_order: 1,
        });

        await ProfileContactField.create({
          profile_contacts_id: contact.id,
          field_type: "PHONE_NUMBER",
          label: "Phone Number",
          placeholder: "Enter your phone number",
          is_enabled: false,
          sort_order: 2,
        });
      }

      const contactFields = await ProfileContactField.findAll({
        where: { profile_contacts_id: contact.id },
        order: [["sort_order", "ASC"]],
      });

      //
      // 6. SAVE-CONTACT BUTTON STYLING
      //
      let saveContact = await ProfileSaveContact.findOne({
        where: { profile_id: businessProfile.id },
      });

      if (!saveContact) {
        saveContact = await ProfileSaveContact.create({
          profile_id: businessProfile.id,
          button_text: "Save Contact",
          button_corner_radius: 10,
          button_bg_color: "#4f2e86",
          button_text_color: "#ffff",
        });
      }

      // ✅ Add SERVER URLS inline (no helper)
      const profileJson = businessProfile.toJSON();
      const customizationJson = customization.toJSON();

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

      const customizationWithServer = {
        ...customizationJson,
        background_image: customizationJson.background_image
          ? `${SERVER_URL_NORMALIZED}${customizationJson.background_image.startsWith("/") ? "" : "/"}${customizationJson.background_image}`
          : customizationJson.background_image,
      };



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

      //
      // 7. FINAL RESPONSE WITH EVERYTHING
      //
      return res.json({
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
      });
    } catch (err) {
      console.error("Error in getMyBusinessProfile:", err);
      return next(err);
    }
  },



  createNewBusinessProfile: async (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError(401, "Unauthorized: user not found"));
    }

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      //
      // 1. Ensure ProfileType BUSINESS exists
      //
      let businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });

      if (!businessType) {
        businessType = await ProfileType.create({
          type: "BUSINESS",
          category: "NETWORK",
          name: "Business",
          description: "Business profile",
        });
      }





      //
      // 2. ALWAYS CREATE userProfile + businessProfile + profile customization
      //

      const fallbackBusinessName =
        user.business_name || user.full_name || user.username || "My Business";

      // Create new BusinessProfile every time
      const businessProfile = await BusinessProfile.create({
        user_id: userId,
        business_name: fallbackBusinessName,
        username: user.username || null,
        bio: "",
        banner: null,
        profile_image: null,
        logo: null,
      });

      // Create new UserProfile every time
      const userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: businessType.id,
        profile_id: businessProfile.id,
        profile_type_name: "Business Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });

      // Create new customization every time
      const customization = await ProfileCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: businessProfile.id,
        about_text_color: "#ffffff",
        font_family: "inter",
        font_size: 16,
        background_color: "#000000",
        background_image: null,
        background_blur: 0,
        layout: "DEFAULT",
      });

      //
      // 3. PLATFORM LINKS + THEIR CUSTOMIZATION
      //
      const links = await ProfileLink.findAll({
        where: { user_profile_id: userProfile.id },
        include: [{ model: PlatformLink }],
        order: [["sequence", "ASC"]],
      });

      let linkCustomization = await BusinessProfileLinkCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
        },
      });

      if (!linkCustomization) {
        linkCustomization = await BusinessProfileLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          icon_styled: "DEFAULT",
          layout: "ICONS",
          background_color: "#1C1D2d",
          title_color: "#ffff",
          link_color: "#ffff",
        });
      }

      //
      // 4. CUSTOM LINKS + THEIR CUSTOMIZATION
      //
      const customLinks = await ProfileCustomLink.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      let customLinkCustomization = await BusinessCustomLinkCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
        },
      });

      if (!customLinkCustomization) {
        customLinkCustomization = await BusinessCustomLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          layout: "ICONS",
          background_color: "#1C1D2d",
          title_color: "#ffff",
        });
      }



      const media = await ProfileMedia.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      let mediaCustomization = await ProfileMediaCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
        },
      });

      if (!mediaCustomization) {
        mediaCustomization = await ProfileMediaCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          layout: "CAROUSAL",
        });
      }

      //
      // 5. CONTACT CONFIG + FIELDS (auto-create defaults if missing)
      //
      let contact = await ProfileContact.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
        },
      });

      if (!contact) {
        contact = await ProfileContact.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          title: "",
          description: "",
          layout: "COMPACT",
          is_enabled: true,
          button_text: "Contact",
          button_corner_radius: 10,
          button_bg_color: "#4f2e86",
          button_text_color: "#ffff",
          success_message: "",
        });

        await ProfileContactField.create({
          profile_contacts_id: contact.id,
          field_type: "EMAIL",
          label: "Email",
          placeholder: "Enter your email",
          is_enabled: true,
          sort_order: 1,
        });

        await ProfileContactField.create({
          profile_contacts_id: contact.id,
          field_type: "PHONE_NUMBER",
          label: "Phone Number",
          placeholder: "Enter your phone number",
          is_enabled: false,
          sort_order: 2,
        });
      }

      const contactFields = await ProfileContactField.findAll({
        where: { profile_contacts_id: contact.id },
        order: [["sort_order", "ASC"]],
      });

      //
      // 6. SAVE-CONTACT BUTTON STYLING
      //
      let saveContact = await ProfileSaveContact.findOne({
        where: { profile_id: businessProfile.id },
      });

      if (!saveContact) {
        saveContact = await ProfileSaveContact.create({
          profile_id: businessProfile.id,
          button_text: "Save Contact",
          button_corner_radius: 10,
          button_bg_color: "#4f2e86",
          button_text_color: "#ffff",
        });
      }

        let userAnalyticsTotal= await UserAnalyticsTotal.create({
                  user_id: userProfile.user_id,
                  user_profile_id: userProfile.id,
                 
                  
                });

      // ✅ Add SERVER URLS inline (no helper)
      const profileJson = businessProfile.toJSON();
      const customizationJson = customization.toJSON();

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

      const customizationWithServer = {
        ...customizationJson,
        background_image: customizationJson.background_image
          ? `${SERVER_URL_NORMALIZED}${customizationJson.background_image.startsWith("/") ? "" : "/"}${customizationJson.background_image}`
          : customizationJson.background_image,
      };



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

      //
      // 7. FINAL RESPONSE WITH EVERYTHING
      //
      return res.json({
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
      });
    } catch (err) {
      console.error("Error in getMyBusinessProfile:", err);
      return next(err);
    }
  },

  updateMyBusinessProfile: async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;
    try {
      // 1. Find BUSINESS profile type
      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });


      if (!businessType) {
        return next(new HttpError(404, "Business profile type not found"));
      }



      // ✅ UPDATED SEARCH (now using userProfileId)
      const userProfile = await UserProfile.findOne({
        where: {
          id: userProfileId,
          user_id: userId,
          profile_type_id: businessType.id,
        },
      });


      if (!userProfile) {
        return next(
          new HttpError(
            404,
            "Business profile not found."
          )
        );
      }

      // 2. Find BusinessProfile + customization
      const businessProfile = await BusinessProfile.findByPk(
        userProfile.profile_id
      );
      const customization = await ProfileCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      });

      if (!businessProfile || !customization) {
        return next(
          new HttpError(400, "Business profile or customization missing")
        );
      }

      const {
        business_name,
        username,
        bio,
        about_text_color,
        font_size,
        font_family,
        background_color,
        background_blur,

        remove_profile_image,
        remove_logo,
        remove_banner,
        remove_background_image,
      } = req.body;

      const shouldRemoveProfile = remove_profile_image === "true";
      const shouldRemoveLogo = remove_logo === "true";
      const shouldRemoveBanner = remove_banner === "true";
      const shouldRemoveBackground = remove_background_image === "true";

      // 3. Update main business fields
      if (typeof business_name === "string") {
        businessProfile.business_name = business_name;
      }

      if (typeof username === "string" && username !== businessProfile.username) {
        // 1. Global Uniqueness Check (Personal + Business)
        const inPersonal = await PersonalProfile.findOne({ where: { username } });
        const inBusiness = await BusinessProfile.findOne({ where: { username } });

        if (inPersonal || inBusiness) {
          return next(new HttpError(400, "Username is already taken globally."));
        }

        const now = new Date();
        const lastUpdate = businessProfile.last_username_update
          ? new Date(businessProfile.last_username_update)
          : null;

        if (lastUpdate) {
          const diffInMs = now - lastUpdate;
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

          if (diffInDays < 30) {
            const daysRemaining = Math.ceil(30 - diffInDays);
            return next(
              new HttpError(
                403,
                `Username can only be updated once every 30 days. You can change it again in ${daysRemaining} day(s).`
              )
            );
          }
        }
        businessProfile.username = username;
        businessProfile.last_username_update = now;
      }

      if (typeof bio === "string") {
        businessProfile.bio = bio;
      }

      // 4. Update customization
      if (about_text_color !== undefined)
        customization.about_text_color = about_text_color;
      if (font_family !== undefined)
        customization.font_family = font_family;
      if (font_size !== undefined)
        customization.font_size = parseInt(font_size, 10);
      if (background_color !== undefined)
        customization.background_color = background_color;
      if (background_blur !== undefined)
        customization.background_blur = parseInt(background_blur, 10);

      // 5. Handle files
      const profilePicFile = req.files?.profilePicture?.[0];
      const logoFile = req.files?.logo?.[0];
      const bannerFile = req.files?.banner?.[0];
      const backgroundImageFile = req.files?.backgroundImage?.[0];

      if (shouldRemoveProfile) {
        businessProfile.profile_image = null;
      } else if (profilePicFile) {
        businessProfile.profile_image = `/uploads/profile/${profilePicFile.filename}`;
      }

      if (shouldRemoveLogo) {
        businessProfile.logo = null;
      } else if (logoFile) {
        businessProfile.logo = `/uploads/logo/${logoFile.filename}`;
      }

      if (shouldRemoveBanner) {
        businessProfile.banner = null;
      } else if (bannerFile) {
        businessProfile.banner = `/uploads/banner/${bannerFile.filename}`;
      }
      if (shouldRemoveBackground) {
        customization.background_image = null;
      } else if (backgroundImageFile) {
        customization.background_image = `/uploads/background/${backgroundImageFile.filename}`;
      }

      // 6. Save
      await businessProfile.save();
      await customization.save();

      return res.json({
        success: true,
        message: "Business profile updated successfully",
        profile: {
          ...businessProfile.toJSON(),
          profile_image: HelperMethods.withBaseUrl(businessProfile.profile_image),
          logo: HelperMethods.withBaseUrl(businessProfile.logo),
          banner: HelperMethods.withBaseUrl(businessProfile.banner),
        },
        customization: {
          ...customization.toJSON(),
          background_image: HelperMethods.withBaseUrl(customization.background_image),
        },
      });

    } catch (err) {
      console.error("Error in updateMyBusinessProfile:", err);
      return next(err);
    }
  },

  getMyBusinessProfileCustomization: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "getMyBusinessProfileCustomization called by userId:",
      userId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    try {
      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });

      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { user_id: userId, profile_type_id: businessType.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(
            400,
            "Business profile not found. Visit /v1/profile/business/me first."
          )
        );
      }

      const customization = await ProfileCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      });

      if (!customization) {
        return next(
          new HttpError(400, "Business profile customization missing")
        );
      }

      return res.json({ customization });
    } catch (err) {
      console.error(
        "Error in getMyBusinessProfileCustomization:",
        err
      );
      return next(err);
    }
  },

  createMyBusinessProfileLink: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("createMyBusinessProfileLink called by userId:", userId);

    if (!userId) {
      console.warn("Unauthorized: no userId in request");
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;
    const { platform_name, username, title } = req.body;
    console.log("Request body (business link):", req.body);

    if (!platform_name || typeof platform_name !== "string") {
      console.warn("Validation failed: platform_name missing or invalid");
      return next(new HttpError(400, "platform_name required"));
    }

    if (!username || typeof username !== "string") {
      console.warn("Validation failed: username missing or invalid");
      return next(new HttpError(400, "username required"));
    }

    try {
      const user = await User.findByPk(userId);
      console.log("User fetched:", user?.id);

      if (!user) {
        console.error("User not found for id:", userId);
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      console.log("Business profile type fetched:", businessType?.id);

      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      console.log("UserProfile fetched:", userProfile?.id);

      if (!userProfile) {
        console.warn("Business profile not found for userId:", userId);
        return next(new HttpError(400, "Business profile not found"));
      }

      const businessProfile = await BusinessProfile.findByPk(
        userProfile.profile_id
      );
      console.log("BusinessProfile fetched:", businessProfile?.id);

      if (!businessProfile) {
        console.warn(
          "Business profile missing for userProfileId:",
          userProfile.id
        );
        return next(new HttpError(400, "Business profile missing"));
      }

      const platform = await PlatformLink.findOne({
        where: { name: platform_name },
      });
      console.log("Platform fetched by name:", platform?.id);

      if (!platform) {
        console.warn("Invalid platform_name:", platform_name);
        return next(new HttpError(400, "Invalid platform_name"));
      }

      const maxSeq = await ProfileLink.max("sequence", {
        where: { user_profile_id: userProfile.id },
      });

      const nextSequence =
        typeof maxSeq === "number" && !Number.isNaN(maxSeq) ? maxSeq + 1 : 1;

      console.log("Next sequence number for business link:", nextSequence);

      const base = (platform.start_link || "").replace(/\/$/, "");
      const cleanUsername = username.replace(/^@/, "");
      const url =
        base && cleanUsername
          ? `${base}/${cleanUsername}`
          : platform.start_link || "";

      const finalTitle = title || platform.name || cleanUsername;

      const createdLink = await ProfileLink.create({
        platform_link_id: platform.id,
        user_profile_id: userProfile.id,
        profile_id: businessProfile.id,
        user_id: userId,
        title: finalTitle,
        username: cleanUsername,
        url,
        is_visible: true,
        sequence: nextSequence,
      });

      console.log("Business ProfileLink created with ID:", createdLink.id);

      let linkCustomization =
        await BusinessProfileLinkCustomization.findOne({
          where: {
            user_profile_id: userProfile.id,
            profile_id: businessProfile.id,
            user_id: userId,
          },
        });

      if (!linkCustomization) {
        console.log(
          "No BusinessProfileLinkCustomization found, creating defaults..."
        );

        linkCustomization = await BusinessProfileLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          icon_styled: "DEFAULT",
          layout: "ICONS",
          background_color: "#ffffff",
          title_color: "#000000",
          link_color: "#0000ee",
        });

        console.log(
          "BusinessProfileLinkCustomization created with ID:",
          linkCustomization.id
        );
      }

      const createdWithPlatform = await ProfileLink.findByPk(createdLink.id, {
        include: [{ model: PlatformLink }],
      });

      return res.status(201).json({
        message: "Business link created successfully",
        link: createdWithPlatform,
        linkCustomization,
      });
    } catch (err) {
      console.error("Error in createMyBusinessProfileLink:", err);
      return next(err);
    }
  },

  getMyBusinessProfileLinks: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("getMyBusinessProfileLinks called by userId:", userId);

    if (!userId) {
      console.warn("Unauthorized: no userId in request");
      return next(new HttpError(401, "Unauthorized"));
    }


    const { userProfileId } = req.params;
    try {
      const user = await User.findByPk(userId);
      console.log("User fetched:", user?.id);

      if (!user) {
        console.error("User not found for id:", userId);
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      console.log("Business profile type fetched:", businessType?.id);

      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      console.log("UserProfile fetched:", userProfile?.id);

      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const businessProfile = await BusinessProfile.findByPk(
        userProfile.profile_id
      );
      console.log("BusinessProfile fetched:", businessProfile?.id);

      if (!businessProfile) {
        return next(
          new HttpError(400, "Business profile missing")
        );
      }

      const links = await ProfileLink.findAll({
        where: { user_profile_id: userProfile.id },
        include: [{ model: PlatformLink, required: false }],
        order: [["sequence", "ASC"]],
      });
      console.log(
        "Business ProfileLinks fetched for userProfile:",
        userProfile.id,
        "count:",
        links.length
      );

      let linkCustomization =
        await BusinessProfileLinkCustomization.findOne({
          where: {
            user_profile_id: userProfile.id,
            profile_id: businessProfile.id,
            user_id: userId,
          },
        });

      if (!linkCustomization) {
        console.log(
          "No BusinessProfileLinkCustomization found, creating defaults..."
        );

        linkCustomization = await BusinessProfileLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          icon_styled: "DEFAULT",
          layout: "ICONS",
          background_color: "#ffffff",
          title_color: "#000000",
          link_color: "#0000ee",
        });
      }

      let templateLinks =[]
      if(userProfile.template_id){

        const team = await TeamModel.findByPk(userProfile.team_id);
                                
                                    if (!team) {
                                      return next(new HttpError(404, "Team not found"));
                                    }

                              let template = await TemplateModel.findByPk(userProfile.template_id);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }



                               let templateUserProfile = await UserProfile.findOne({
                                                                where:{ template_id: template.id, is_template_profile: true,team_id: team.id }
                                                              });
                              
                              
                                                              
                                                              if(!templateUserProfile){
                                                                return res.status(404).json({
                                                                  success:false,
                                                                  message:"Template user profile not found for the team"
                                                                });
                                                              }
                                                              


                                                              templateLinks = await ProfileLink.findAll({
        where: { user_profile_id: templateUserProfile.id },
        include: [{ model: PlatformLink, required: false }],
        order: [["sequence", "ASC"]],
      });

      }

      return res.json({
        message: "Business links fetched successfully",
        links,
        templateLinks,
        linkCustomization,
      });
    } catch (err) {
      console.error("Error in getMyBusinessProfileLinks:", err);
      return next(err);
    }
  },

  updateMyBusinessProfileLinksSequence: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyBusinessProfileLinksSequence called by userId:",
      userId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { links } = req.body;

    const { userProfileId } = req.params;
    if (!Array.isArray(links) || links.length === 0) {
      return next(
        new HttpError(
          400,
          "links must be a non-empty array of { id, is_visible } objects"
        )
      );
    }

    for (const item of links) {
      if (typeof item.id !== "number") {
        return next(
          new HttpError(400, "Each link entry must include a numeric id")
        );
      }
      if (typeof item.is_visible !== "boolean") {
        return next(
          new HttpError(
            400,
            "Each link entry must include a boolean is_visible field"
          )
        );
      }
    }

    const ordered_ids = links.map((l) => l.id);

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });

      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const existingLinks = await ProfileLink.findAll({
        where: { user_profile_id: userProfile.id },
      });

      const existingIds = existingLinks.map((l) => l.id);

      const missingInRequest = existingIds.filter(
        (id) => !ordered_ids.includes(id)
      );
      const unknownIds = ordered_ids.filter(
        (id) => !existingIds.includes(id)
      );

      if (missingInRequest.length > 0 || unknownIds.length > 0) {
        const errObj = new HttpError(
          400,
          "links array must contain exactly all business link IDs for this profile"
        );
        errObj.missing_ids = missingInRequest;
        errObj.unknown_ids = unknownIds;
        return next(errObj);
      }

      const linkMap = new Map(existingLinks.map((l) => [l.id, l]));

      const updates = [];

      links.forEach((item, index) => {
        const link = linkMap.get(item.id);
        if (link) {
          const newSeq = index + 1;

          const mustUpdate =
            link.sequence !== newSeq || link.is_visible !== item.is_visible;

          if (mustUpdate) {
            link.sequence = newSeq;
            link.is_visible = item.is_visible;
            updates.push(link.save());
          }
        }
      });

      await Promise.all(updates);

      const updatedLinks = await ProfileLink.findAll({
        where: { user_profile_id: userProfile.id },
        include: [{ model: PlatformLink, required: false }],
        order: [["sequence", "ASC"]],
      });

      return res.json({
        message: "Business links updated successfully (order + visibility)",
        links: updatedLinks,
      });
    } catch (err) {
      console.error(
        "Error in updateMyBusinessProfileLinksSequence:",
        err
      );
      return next(err);
    }
  },

  editMyBusinessProfileLink: async (req, res, next) => {
    const userId = req.user?.id;



    const { userProfileId, linkId } = req.params;

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    // if (!Number.isInteger(linkId)) {
    //   return next(new HttpError(400, "Invalid business link id"));
    // }

    const { platform_name, platform_link_id, username, title } = req.body;
    console.log("Edit business link body:", req.body);

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const link = await ProfileLink.findOne({
        where: {
          id: linkId,
          user_profile_id: userProfile.id,
        },
      });

      if (!link) {
        console.warn(
          "Business link not found or does not belong to userProfile:",
          { linkId, userProfileId: userProfile.id }
        );
        return next(new HttpError(404, "Link not found"));
      }

      let platform = null;

      if (platform_link_id) {
        platform = await PlatformLink.findByPk(platform_link_id);
        console.log("Platform fetched by ID (edit business):", platform?.id);
        if (!platform) {
          return next(new HttpError(400, "Invalid platform_link_id"));
        }
        link.platform_link_id = platform.id;
      } else if (platform_name) {
        platform = await PlatformLink.findOne({
          where: { name: platform_name },
        });
        console.log(
          "Platform fetched by name (edit business):",
          platform?.id
        );
        if (!platform) {
          return next(new HttpError(400, "Invalid platform_name"));
        }
        link.platform_link_id = platform.id;
      } else {
        platform = await PlatformLink.findByPk(link.platform_link_id);
        console.log(
          "Platform fetched from existing business link:",
          platform?.id
        );
        if (!platform) {
          return next(
            new HttpError(
              400,
              "Platform for this business link no longer exists"
            )
          );
        }
      }

      if (typeof username === "string" && username.trim() !== "") {
        link.username = username;
      }

      const cleanUsername = link.username.replace(/^@/, "");
      const base = (platform.start_link || "").replace(/\/$/, "");
      link.url =
        base && cleanUsername
          ? `${base}/${cleanUsername}`
          : platform.start_link || "";

      if (typeof title === "string" && title.trim() !== "") {
        link.title = title;
      }

      await link.save();
      console.log("Business ProfileLink updated with id:", link.id);

      const updatedWithPlatform = await ProfileLink.findByPk(link.id, {
        include: [{ model: PlatformLink, required: false }],
      });

      return res.json({
        message: "Business link updated successfully",
        link: updatedWithPlatform,
      });
    } catch (err) {
      console.error("Error in editMyBusinessProfileLink:", err);
      return next(err);
    }
  },

  deleteMyBusinessProfileLink: async (req, res, next) => {
    const userId = req.user?.id;
    const { userProfileId, linkId } = req.params;
    console.log(
      "deleteMyBusinessProfileLink called by userId:",
      userId,
      "for linkId:",
      linkId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    // if (!Number.isInteger(linkId)) {
    //   return next(new HttpError(400, "Invalid business link id"));
    // }

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const link = await ProfileLink.findOne({
        where: {
          id: linkId,
          user_profile_id: userProfile.id,
        },
      });

      if (!link) {
        console.warn(
          "Business link not found or does not belong to userProfile:",
          { linkId, userProfileId: userProfile.id }
        );
        return next(new HttpError(404, "Link not found"));
      }

      console.log("Deleting Business ProfileLink with id:", link.id);
      await link.destroy();

      const remainingLinks = await ProfileLink.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      const updates = [];
      remainingLinks.forEach((l, index) => {
        const newSeq = index + 1;
        if (l.sequence !== newSeq) {
          console.log(
            `Re-sequencing business link ${l.id} from ${l.sequence} to ${newSeq}`
          );
          l.sequence = newSeq;
          updates.push(l.save());
        }
      });

      await Promise.all(updates);

      const updatedLinks = await ProfileLink.findAll({
        where: { user_profile_id: userProfile.id },
        include: [{ model: PlatformLink, required: false }],
        order: [["sequence", "ASC"]],
      });

      return res.json({
        message: "Business link deleted successfully",
        links: updatedLinks,
      });
    } catch (err) {
      console.error("Error in deleteMyBusinessProfileLink:", err);
      return next(err);
    }
  },

  updateMyBusinessProfileLinkCustomization: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyBusinessProfileLinkCustomization called by userId:",
      userId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;

    const { layout, icon_styled, background_color, title_color, link_color } =
      req.body || {};

    const allowedLayouts = ["ICONS", "CAROUSAL", "CARDS"];

    if (layout && !allowedLayouts.includes(layout)) {
      return next(
        new HttpError(
          400,
          "Invalid layout. Must be one of ICONS, CAROUSAL, CARDS"
        )
      );
    }

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });

      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const businessProfile = await BusinessProfile.findByPk(
        userProfile.profile_id
      );

      if (!businessProfile) {
        return next(
          new HttpError(400, "Business profile missing for this user")
        );
      }

      let linkCustomization =
        await BusinessProfileLinkCustomization.findOne({
          where: {
            user_profile_id: userProfile.id,
            profile_id: businessProfile.id,
            user_id: userId,
          },
        });

      if (!linkCustomization) {
        console.log(
          "No BusinessProfileLinkCustomization found; creating default..."
        );
        linkCustomization = await BusinessProfileLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          icon_styled: "DEFAULT",
          layout: "ICONS",
          background_color: "#ffffff",
          title_color: "#000000",
          link_color: "#0000ee",
        });
      }

      const targetLayout = layout || linkCustomization.layout || "ICONS";

      if (typeof icon_styled === "string") {
        linkCustomization.icon_styled = icon_styled;
      }

      if (targetLayout === "ICONS") {
        linkCustomization.layout = "ICONS";
        console.log("Applying ICONS layout (business links).");
      }

      if (targetLayout === "CAROUSAL") {
        linkCustomization.layout = "CAROUSAL";

        if (typeof title_color === "string") {
          linkCustomization.title_color = title_color;
        }

        console.log("Applying CAROUSAL layout (title_color only).");
      }

      if (targetLayout === "CARDS") {
        linkCustomization.layout = "CARDS";

        if (typeof background_color === "string") {
          linkCustomization.background_color = background_color;
        }
        if (typeof title_color === "string") {
          linkCustomization.title_color = title_color;
        }
        if (typeof link_color === "string") {
          linkCustomization.link_color = link_color;
        }

        console.log("Applying CARDS layout (full customization).");
      }

      await linkCustomization.save();

      return res.json({
        message: "Business profile link customization updated",
        customization: linkCustomization,
      });
    } catch (err) {
      console.error(
        "Error in updateMyBusinessProfileLinkCustomization:",
        err
      );
      return next(err);
    }
  },

  getSupportedPlatformLinks: async (req, res, next) => {
    try {
      const platforms = await PlatformLink.findAll({
        attributes: [
          "id",
          "name",
          "type",
          "start_link",
          "default_icon",
          "black_icon",
          "stroked_icon",
          "colored_icon",
          "white_icon",
        ],
        order: [["name", "ASC"]],
      });

      const groupedPlatforms = platforms.reduce((acc, platform) => {
        const type = platform.type || "other";
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(platform);
        return acc;
      }, {});

      return res.json(groupedPlatforms);
    } catch (err) {
      console.error("Error in getSupportedPlatformLinks:", err);
      return next(err);
    }
  },
  ////
  createMyBusinessCustomLink: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("createMyBusinessCustomLink called by userId:", userId);

    if (!userId) {
      console.warn("Unauthorized: no userId in request");
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;

    const { title, url } = req.body || {};
    console.log("Request body (business custom link):", req.body);

    if (!title || typeof title !== "string") {
      return next(new HttpError(400, "title is required"));
    }

    if (!url || typeof url !== "string") {
      return next(new HttpError(400, "url is required"));
    }

    try {
      const user = await User.findByPk(userId);
      console.log("User fetched:", user?.id);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      console.log("Business profile type fetched:", businessType?.id);
      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      console.log("UserProfile fetched:", userProfile?.id);
      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const businessProfile = await BusinessProfile.findByPk(
        userProfile.profile_id
      );
      console.log("BusinessProfile fetched:", businessProfile?.id);
      if (!businessProfile) {
        return next(
          new HttpError(400, "Business profile missing for this user")
        );
      }

      const thumbnailFile = req.files?.thumbnail?.[0];
      const iconFile = req.files?.icon?.[0];

      const thumbnailPath = thumbnailFile
        ? `/uploads/thumbnails/${thumbnailFile.filename}`
        : null;

      const iconPath = iconFile
        ? `/uploads/icons/${iconFile.filename}`
        : null;

      const maxSeq = await ProfileCustomLink.max("sequence", {
        where: { user_profile_id: userProfile.id },
      });
      const nextSequence =
        typeof maxSeq === "number" && !Number.isNaN(maxSeq) ? maxSeq + 1 : 1;

      console.log(
        "Next sequence number for business custom link:",
        nextSequence
      );

      const createdCustomLink = await ProfileCustomLink.create({
        profile_id: businessProfile.id,
        user_profile_id: userProfile.id,
        user_id: userId,
        title,
        url,
        is_visible: true,
        sequence: nextSequence,
        thumbnail: thumbnailPath,
        icon: iconPath,
      });

      console.log(
        "Business ProfileCustomLink created with ID:",
        createdCustomLink.id
      );

      let customLinkCustomization =
        await BusinessCustomLinkCustomization.findOne({
          where: {
            user_profile_id: userProfile.id,
            profile_id: businessProfile.id,
            user_id: userId,
          },
        });

      if (!customLinkCustomization) {
        console.log(
          "No BusinessCustomLinkCustomization found, creating defaults..."
        );

        customLinkCustomization =
          await BusinessCustomLinkCustomization.create({
            user_profile_id: userProfile.id,
            profile_id: businessProfile.id,
            user_id: userId,
            layout: "CAROUSAL",
            background_color: "#ffffff",
            title_color: "#000000",
          });

        console.log(
          "BusinessCustomLinkCustomization created with ID:",
          customLinkCustomization.id
        );
      } else {
        console.log(
          "Existing BusinessCustomLinkCustomization found with ID:",
          customLinkCustomization.id
        );
      }

      return res.status(201).json({
        message: "Business custom link created successfully",
        customLink: {
          ...createdCustomLink.toJSON(),
          thumbnail: createdCustomLink.thumbnail
            ? `${SERVER_URL_NORMALIZED}${createdCustomLink.thumbnail.startsWith("/") ? "" : "/"}${createdCustomLink.thumbnail}`
            : createdCustomLink.thumbnail,
          icon: createdCustomLink.icon
            ? `${SERVER_URL_NORMALIZED}${createdCustomLink.icon.startsWith("/") ? "" : "/"}${createdCustomLink.icon}`
            : createdCustomLink.icon,
        },
        customLinkCustomization,
      });
    } catch (err) {
      console.error("Error in createMyBusinessCustomLink:", err);
      return next(err);
    }
  },

  getMyBusinessCustomLinks: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("getMyBusinessCustomLinks called by userId:", userId);

    if (!userId) {
      console.warn("Unauthorized: no userId in request");
      return next(new HttpError(401, "Unauthorized"));
    }
    const { userProfileId } = req.params;

    try {
      const user = await User.findByPk(userId);
      console.log("User fetched:", user?.id);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      console.log("Business profile type fetched:", businessType?.id);
      if (!businessType) {
        return next(new HttpError(400, "Business profile type not configured"));
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      console.log("UserProfile fetched:", userProfile?.id);
      if (!userProfile) {
        return next(new HttpError(400, "Business profile not found for this user"));
      }

      const businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);
      console.log("BusinessProfile fetched:", businessProfile?.id);
      if (!businessProfile) {
        return next(new HttpError(400, "Business profile missing for this user"));
      }

      const customLinks = await ProfileCustomLink.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });
      console.log(
        "Business ProfileCustomLinks fetched for userProfile:",
        userProfile.id,
        "count:",
        customLinks.length
      );

      // ✅ add server url in thumbnail/icon inline
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

      let customLinkCustomization = await BusinessCustomLinkCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
        },
      });

      if (!customLinkCustomization) {
        console.log(
          "No BusinessCustomLinkCustomization found in getMyBusinessCustomLinks, creating defaults..."
        );

        customLinkCustomization = await BusinessCustomLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          layout: "ICONS",
          background_color: "#ffffff",
          title_color: "#000000",
        });
      }


      let templateCustomLinksWithServer =[]
      if(userProfile.template_id){

        const team = await TeamModel.findByPk(userProfile.team_id);
                                
                                    if (!team) {
                                      return next(new HttpError(404, "Team not found"));
                                    }

                              let template = await TemplateModel.findByPk(userProfile.template_id);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }



                               let templateUserProfile = await UserProfile.findOne({
                                                                where:{ template_id: template.id, is_template_profile: true,team_id: team.id }
                                                              });
                              
                              
                                                              
                                                              if(!templateUserProfile){
                                                                return res.status(404).json({
                                                                  success:false,
                                                                  message:"Template user profile not found for the team"
                                                                });
                                                              }
                                                              


                                                             const  templateCustomLinks = await ProfileCustomLink.findAll({
        where: { user_profile_id: templateUserProfile.id },
        order: [["sequence", "ASC"]],
      });



         // ✅ add server url in thumbnail/icon inline
       templateCustomLinksWithServer = templateCustomLinks.map((cl) => {
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
      }

      return res.json({
        message: "Business custom links fetched successfully",
        customLinks: customLinksWithServer,
        templateCustomLinks:templateCustomLinksWithServer,
        customLinkCustomization,
      });
    } catch (err) {
      console.error("Error in getMyBusinessCustomLinks:", err);
      return next(err);
    }
  },


  updateMyBusinessCustomLinksSequence: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyBusinessCustomLinksSequence called by userId:",
      userId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { links } = req.body;

    const { userProfileId } = req.params;
    if (!Array.isArray(links) || links.length === 0) {
      return next(
        new HttpError(
          400,
          "links must be a non-empty array of { id, is_visible } objects"
        )
      );
    }

    for (const item of links) {
      if (typeof item.id !== "number") {
        return next(
          new HttpError(400, "Each link entry must include a numeric id")
        );
      }
      if (typeof item.is_visible !== "boolean") {
        return next(
          new HttpError(
            400,
            "Each link entry must include a boolean is_visible field"
          )
        );
      }
    }

    const ordered_ids = links.map((l) => l.id);

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const existingLinks = await ProfileCustomLink.findAll({
        where: { user_profile_id: userProfile.id },
      });

      const existingIds = existingLinks.map((l) => l.id);

      const missingInRequest = existingIds.filter(
        (id) => !ordered_ids.includes(id)
      );
      const unknownIds = ordered_ids.filter(
        (id) => !existingIds.includes(id)
      );

      if (missingInRequest.length > 0 || unknownIds.length > 0) {
        const errObj = new HttpError(
          400,
          "links array must contain exactly all custom link IDs for this business profile"
        );
        errObj.missing_ids = missingInRequest;
        errObj.unknown_ids = unknownIds;
        return next(errObj);
      }

      const linkMap = new Map(existingLinks.map((l) => [l.id, l]));
      const updates = [];

      links.forEach((item, index) => {
        const link = linkMap.get(item.id);
        if (link) {
          const newSeq = index + 1;
          const mustUpdate =
            link.sequence !== newSeq || link.is_visible !== item.is_visible;

          if (mustUpdate) {
            link.sequence = newSeq;
            link.is_visible = item.is_visible;
            updates.push(link.save());
          }
        }
      });

      await Promise.all(updates);

      const updatedLinks = await ProfileCustomLink.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      return res.json({
        message:
          "Business custom links updated successfully (order + visibility)",
        customLinks: updatedLinks,
      });
    } catch (err) {
      console.error(
        "Error in updateMyBusinessCustomLinksSequence:",
        err
      );
      return next(err);
    }
  },

  editMyBusinessCustomLink: async (req, res, next) => {
    const userId = req.user?.id;
    const { userProfileId, linkId } = req.params;
    console.log(
      "editMyBusinessCustomLink called by userId:",
      userId,
      "for linkId:",
      linkId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    // if (!Number.isInteger(linkId)) {
    //   return next(new HttpError(400, "Invalid business custom link id"));
    // }

    const { title, url } = req.body || {};
    console.log("Edit business custom link body:", req.body);

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const customLink = await ProfileCustomLink.findOne({
        where: {
          id: linkId,
          user_profile_id: userProfile.id,
        },
      });

      if (!customLink) {
        console.warn(
          "Business custom link not found or does not belong to userProfile:",
          {
            linkId,
            userProfileId: userProfile.id,
          }
        );
        return next(new HttpError(404, "Custom link not found"));
      }

      if (typeof title === "string" && title.trim() !== "") {
        customLink.title = title;
      }
      if (typeof url === "string" && url.trim() !== "") {
        customLink.url = url;
      }

      const thumbnailFile = req.files?.thumbnail?.[0];
      const iconFile = req.files?.icon?.[0];

      if (thumbnailFile) {
        customLink.thumbnail = `/uploads/thumbnails/${thumbnailFile.filename}`;
      }
      if (iconFile) {
        customLink.icon = `/uploads/icons/${iconFile.filename}`;
      }

      await customLink.save();
      console.log("Business ProfileCustomLink updated with id:", customLink.id);

      return res.json({
        message: "Business custom link updated successfully",
        customLink,
      });
    } catch (err) {
      console.error("Error in editMyBusinessCustomLink:", err);
      return next(err);
    }
  },

  deleteMyBusinessCustomLink: async (req, res, next) => {
    const userId = req.user?.id;
    const { userProfileId, linkId } = req.params;
    console.log(
      "deleteMyBusinessCustomLink called by userId:",
      userId,
      "for linkId:",
      linkId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    // if (!Number.isInteger(linkId)) {
    //   return next(new HttpError(400, "Invalid business custom link id"));
    // }

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const customLink = await ProfileCustomLink.findOne({
        where: {
          id: linkId,
          user_profile_id: userProfile.id,
        },
      });

      if (!customLink) {
        console.warn(
          "Business custom link not found or does not belong to userProfile:",
          {
            linkId,
            userProfileId: userProfile.id,
          }
        );
        return next(new HttpError(404, "Custom link not found"));
      }

      console.log(
        "Deleting Business ProfileCustomLink with id:",
        customLink.id
      );
      await customLink.destroy();

      const remainingLinks = await ProfileCustomLink.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      const updates = [];
      remainingLinks.forEach((l, index) => {
        const newSeq = index + 1;
        if (l.sequence !== newSeq) {
          console.log(
            `Re-sequencing business custom link ${l.id} from ${l.sequence} to ${newSeq}`
          );
          l.sequence = newSeq;
          updates.push(l.save());
        }
      });

      await Promise.all(updates);

      const updatedLinks = await ProfileCustomLink.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      return res.json({
        message: "Business custom link deleted successfully",
        customLinks: updatedLinks,
      });
    } catch (err) {
      console.error("Error in deleteMyBusinessCustomLink:", err);
      return next(err);
    }
  },

  updateMyBusinessCustomLinkCustomization: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyBusinessCustomLinkCustomization called by userId:",
      userId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;
    const { layout, background_color, title_color } = req.body || {};

    const allowedLayouts = ["CAROUSAL", "CARDS", "GRID", "ICONS"];

    if (layout && !allowedLayouts.includes(layout)) {
      return next(
        new HttpError(
          400,
          "Invalid layout. Must be one of CAROUSAL, CARDS, GRID, ICONS"
        )
      );
    }

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const businessProfile = await BusinessProfile.findByPk(
        userProfile.profile_id
      );
      if (!businessProfile) {
        return next(
          new HttpError(400, "Business profile missing for this user")
        );
      }

      let customLinkCustomization =
        await BusinessCustomLinkCustomization.findOne({
          where: {
            user_profile_id: userProfile.id,
            profile_id: businessProfile.id,
            user_id: userId,
          },
        });

      if (!customLinkCustomization) {
        console.log(
          "No BusinessCustomLinkCustomization found; creating default..."
        );
        customLinkCustomization =
          await BusinessCustomLinkCustomization.create({
            user_profile_id: userProfile.id,
            profile_id: businessProfile.id,
            user_id: userId,
            layout: "ICONS",
            background_color: "#ffffff",
            title_color: "#000000",
          });
      }

      const targetLayout =
        layout || customLinkCustomization.layout || "ICONS";

      if (targetLayout === "ICONS") {
        customLinkCustomization.layout = "ICONS";
        console.log(
          "Applying ICONS layout (business custom links, no extra colors)."
        );
      }

      if (targetLayout === "CAROUSAL") {
        customLinkCustomization.layout = "CAROUSAL";

        if (typeof background_color === "string") {
          customLinkCustomization.background_color = background_color;
        }
        if (typeof title_color === "string") {
          customLinkCustomization.title_color = title_color;
        }

        console.log(
          "Applying CAROUSAL layout (background_color + title_color)."
        );
      }

      if (targetLayout === "CARDS") {
        customLinkCustomization.layout = "CARDS";

        if (typeof background_color === "string") {
          customLinkCustomization.background_color = background_color;
        }
        if (typeof title_color === "string") {
          customLinkCustomization.title_color = title_color;
        }

        console.log(
          "Applying CARDS layout (background_color + title_color)."
        );
      }

      if (targetLayout === "GRID") {
        customLinkCustomization.layout = "GRID";

        if (typeof title_color === "string") {
          customLinkCustomization.title_color = title_color;
        }

        console.log("Applying GRID layout (title_color only).");
      }

      await customLinkCustomization.save();

      return res.json({
        message: "Business custom link customization updated",
        customization: customLinkCustomization,
      });
    } catch (err) {
      console.error(
        "Error in updateMyBusinessCustomLinkCustomization:",
        err
      );
      return next(err);
    }
  },

  getMyBusinessProfileContact: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("getMyBusinessProfileContact called by userId:", userId);

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;

    try {
      const user = await User.findByPk(userId);
      console.log("User fetched:", user?.id);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      console.log("Business profile type fetched:", businessType?.id);
      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      console.log("UserProfile fetched:", userProfile?.id);
      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const businessProfile = await BusinessProfile.findByPk(
        userProfile.profile_id
      );
      console.log("BusinessProfile fetched:", businessProfile?.id);
      if (!businessProfile) {
        return next(
          new HttpError(400, "Business profile missing for this user")
        );
      }

      let contact = await ProfileContact.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
        },
      });

      if (!contact) {
        console.log(
          "No Business ProfileContact found, creating default contact + fields..."
        );

        contact = await ProfileContact.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          title: "",
          description: "",
          layout: "COMPACT",
          is_enabled: true,
          button_text: "Contact",
          button_corner_radius: 10,
          button_bg_color: "#0000FF",
          button_text_color: "#0000",
          success_message: "",
        });

        await ProfileContactField.create({
          profile_contacts_id: contact.id,
          field_type: "EMAIL",
          label: "Email",
          placeholder: "Enter your email",
          is_enabled: true,
          sort_order: 1,
        });

        await ProfileContactField.create({
          profile_contacts_id: contact.id,
          field_type: "PHONE_NUMBER",
          label: "Phone Number",
          placeholder: "Enter your phone number",
          is_enabled: false,
          sort_order: 2,
        });
      }

      const fields = await ProfileContactField.findAll({
        where: { profile_contacts_id: contact.id },
        order: [["sort_order", "ASC"]],
      });

      return res.json({
        message: "Business contact info fetched successfully",
        contact,
        fields,
      });
    } catch (err) {
      console.error("Error in getMyBusinessProfileContact:", err);
      return next(err);
    }
  },

  updateMyBusinessProfileContact: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyBusinessProfileContact called by userId:",
      userId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;
    const {
      title,
      description,
      layout,
      button_text,
      button_corner_radius,
      button_bg_color,
      button_text_color,
      success_message,
      fields,
    } = req.body || {};

    const allowedLayouts = ["COMPACT", "CARD"];

    if (layout && !allowedLayouts.includes(layout)) {
      return next(
        new HttpError(
          400,
          "Invalid layout. Must be one of COMPACT, CARD"
        )
      );
    }

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });
      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found for this user")
        );
      }

      const businessProfile = await BusinessProfile.findByPk(
        userProfile.profile_id
      );
      if (!businessProfile) {
        return next(
          new HttpError(400, "Business profile missing for this user")
        );
      }

      let contact = await ProfileContact.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
        },
      });

      if (!contact) {
        console.log(
          "No Business ProfileContact found in updateMyBusinessProfileContact, creating default..."
        );
        contact = await ProfileContact.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          title: "",
          description: "",
          layout: "COMPACT",
          is_enabled: true,
          button_text: "Contact",
          button_corner_radius: 10,
          button_bg_color: null,
          button_text_color: null,
          success_message: null,
        });

        await ProfileContactField.create({
          profile_contacts_id: contact.id,
          field_type: "EMAIL",
          label: "Email",
          placeholder: "Enter your email",
          is_enabled: true,
          sort_order: 1,
        });
        await ProfileContactField.create({
          profile_contacts_id: contact.id,
          field_type: "PHONE_NUMBER",
          label: "Phone Number",
          placeholder: "Enter your phone number",
          is_enabled: false,
          sort_order: 2,
        });
      }

      const targetLayout = layout || contact.layout || "COMPACT";

      if (typeof title === "string") contact.title = title;
      if (typeof description === "string") contact.description = description;

      contact.layout = targetLayout;

      if (typeof button_text === "string") {
        contact.button_text = button_text;
      }
      if (button_corner_radius !== undefined) {
        contact.button_corner_radius = parseInt(
          button_corner_radius,
          10
        );
      }
      if (typeof button_bg_color === "string") {
        contact.button_bg_color = button_bg_color;
      }
      if (typeof button_text_color === "string") {
        contact.button_text_color = button_text_color;
      }
      if (typeof success_message === "string") {
        contact.success_message = success_message;
      }

      await contact.save();

      // ----- fields handling -----
      if (Array.isArray(fields)) {
        let normalizedFields = [...fields];

        const existingFields = await ProfileContactField.findAll({
          where: { profile_contacts_id: contact.id },
        });
        const existingMap = new Map(
          existingFields.map((f) => [f.id, f])
        );
        const seenIds = new Set();

        if (targetLayout === "COMPACT") {
          normalizedFields = normalizedFields.filter((f) =>
            ["EMAIL", "PHONE_NUMBER"].includes(f.field_type)
          );

          if (normalizedFields.length > 2) {
            normalizedFields = normalizedFields.slice(0, 2);
          }

          let enabledFound = false;
          normalizedFields = normalizedFields.map((f) => {
            const isEnabled = !!f.is_enabled;
            if (isEnabled && !enabledFound) {
              enabledFound = true;
              return { ...f, is_enabled: true };
            }
            return { ...f, is_enabled: false };
          });
        }

        // create/update
        for (let index = 0; index < normalizedFields.length; index++) {
          const f = normalizedFields[index];
          const sortOrder =
            f.sort_order !== undefined ? f.sort_order : index + 1;

          if (f.id && existingMap.has(f.id)) {
            const fieldEntity = existingMap.get(f.id);
            if (f.field_type) fieldEntity.field_type = f.field_type;
            if (typeof f.label === "string") fieldEntity.label = f.label;
            if (typeof f.placeholder === "string")
              fieldEntity.placeholder = f.placeholder;
            if (typeof f.is_enabled === "boolean")
              fieldEntity.is_enabled = f.is_enabled;
            fieldEntity.sort_order = sortOrder;

            await fieldEntity.save();
            seenIds.add(f.id);
          } else {
            if (!f.field_type || !f.label) {
              console.warn(
                "Skipping new field without field_type or label:",
                f
              );
              continue;
            }

            const createdField = await ProfileContactField.create({
              profile_contacts_id: contact.id,
              field_type: f.field_type,
              label: f.label,
              placeholder: f.placeholder || null,
              is_enabled: !!f.is_enabled,
              sort_order: sortOrder,
            });

            seenIds.add(createdField.id);
          }
        }

        // delete removed fields
        for (const field of existingFields) {
          if (!seenIds.has(field.id)) {
            await field.destroy();
          }
        }

        // ensure at most one enabled field in COMPACT
        if (targetLayout === "COMPACT") {
          const finalFields = await ProfileContactField.findAll({
            where: { profile_contacts_id: contact.id },
          });

          let enabledId = null;
          for (const field of finalFields) {
            if (
              ["EMAIL", "PHONE_NUMBER"].includes(field.field_type) &&
              field.is_enabled
            ) {
              if (enabledId === null) {
                enabledId = field.id;
              } else {
                field.is_enabled = false;
                await field.save();
              }
            }
          }
        }
      }

      const updatedFields = await ProfileContactField.findAll({
        where: { profile_contacts_id: contact.id },
        order: [["sort_order", "ASC"]],
      });

      return res.json({
        message: "Business contact info updated successfully",
        contact,
        fields: updatedFields,
      });
    } catch (err) {
      console.error("Error in updateMyBusinessProfileContact:", err);
      return next(err);
    }
  },

  toggleMyBusinessProfileContactStatus: async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;
    const { is_enabled } = req.body;

    if (is_enabled === undefined) {
      return next(new HttpError(400, "is_enabled field is required"));
    }

    try {
      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });

      if (!businessType) {
        return next(new HttpError(400, "Business profile type not configured"));
      }

      const userProfile = await UserProfile.findOne({
        where: {
          id: userProfileId,
          user_id: userId,
          profile_type_id: businessType.id,
        },
      });

      if (!userProfile) {
        return next(new HttpError(404, "Business profile not found for this user"));
      }

      const businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);
      if (!businessProfile) {
        return next(new HttpError(404, "Business profile missing for this user"));
      }

      let contact = await ProfileContact.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
        },
      });

      if (!contact) {
        // Create default contact if missing
        contact = await ProfileContact.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          title: "",
          description: "",
          layout: "COMPACT",
          is_enabled: !!is_enabled,
          button_text: "Connect",
          button_corner_radius: 10,
        });

        // Add default fields too since this is a new setup
        await ProfileContactField.create({
          profile_contacts_id: contact.id,
          field_type: "EMAIL",
          label: "Email",
          placeholder: "Enter your email",
          is_enabled: true,
          sort_order: 1,
        });
        await ProfileContactField.create({
          profile_contacts_id: contact.id,
          field_type: "PHONE_NUMBER",
          label: "Phone Number",
          placeholder: "Enter your phone number",
          is_enabled: false,
          sort_order: 2,
        });
      } else {
        contact.is_enabled = !!is_enabled;
        await contact.save();
      }

      return res.status(200).json({
        status: "success",
        message: `Contact section ${contact.is_enabled ? "enabled" : "disabled"} successfully`,
        data: {
          is_enabled: contact.is_enabled,
        },
      });
    } catch (err) {
      console.error("Error in toggleMyBusinessProfileContactStatus:", err);
      return next(err);
    }
  },

  getMyBusinessProfileSaveContact: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "getMyBusinessProfileSaveContact called by userId:",
      userId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });

      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found")
        );
      }

      const businessProfile = await BusinessProfile.findByPk(
        userProfile.profile_id
      );

      if (!businessProfile) {
        return next(
          new HttpError(400, "Business profile missing")
        );
      }

      let saveContact = await ProfileSaveContact.findOne({
        where: { profile_id: businessProfile.id },
      });

      if (!saveContact) {
        console.log(
          "Creating default Business ProfileSaveContact..."
        );

        saveContact = await ProfileSaveContact.create({
          profile_id: businessProfile.id,
          button_text: "Save Contact",
          button_corner_radius: 10,
          button_bg_color: "#fufufuf",
          button_text_color: "#0000",
        });
      }

      return res.json({
        message: "Business save contact styling fetched successfully",
        saveContact,
      });
    } catch (err) {
      console.error("Error in getMyBusinessProfileSaveContact:", err);
      return next(err);
    }
  },

  updateMyBusinessProfileSaveContact: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyBusinessProfileSaveContact called by userId:",
      userId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;

    const {
      button_text,
      button_corner_radius,
      button_bg_color,
      button_text_color,
    } = req.body || {};

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });

      if (!businessType) {
        return next(
          new HttpError(400, "Business profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(400, "Business profile not found")
        );
      }

      const businessProfile = await BusinessProfile.findByPk(
        userProfile.profile_id
      );

      let saveContact = await ProfileSaveContact.findOne({
        where: { profile_id: businessProfile.id },
      });

      if (!saveContact) {
        saveContact = await ProfileSaveContact.create({
          profile_id: businessProfile.id,
          button_text: "Save Contact",
          button_corner_radius: 10,
          button_bg_color: null,
          button_text_color: null,
        });
      }

      if (typeof button_text === "string") {
        saveContact.button_text = button_text;
      }

      if (button_corner_radius !== undefined) {
        saveContact.button_corner_radius = parseInt(
          button_corner_radius,
          10
        );
      }

      if (typeof button_bg_color === "string") {
        saveContact.button_bg_color = button_bg_color;
      }

      if (typeof button_text_color === "string") {
        saveContact.button_text_color = button_text_color;
      }

      await saveContact.save();

      return res.json({
        message: "Business save contact styling updated successfully",
        saveContact,
      });
    } catch (err) {
      console.error(
        "Error in updateMyBusinessProfileSaveContact:",
        err
      );
      return next(err);
    }
  },

  toggleMyBusinessProfileSaveContactStatus: async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;
    const { is_enabled } = req.body;

    if (is_enabled === undefined) {
      return next(new HttpError(400, "is_enabled field is required"));
    }

    try {
      const businessType = await ProfileType.findOne({
        where: { type: "BUSINESS" },
      });

      if (!businessType) {
        return next(new HttpError(400, "Business profile type not configured"));
      }

      const userProfile = await UserProfile.findOne({
        where: {
          id: userProfileId,
          user_id: userId,
          profile_type_id: businessType.id,
        },
      });

      if (!userProfile) {
        return next(new HttpError(404, "Business profile not found for this user"));
      }

      const businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);
      if (!businessProfile) {
        return next(new HttpError(404, "Business profile missing for this user"));
      }

      let saveContact = await ProfileSaveContact.findOne({
        where: { profile_id: businessProfile.id },
      });

      if (!saveContact) {
        saveContact = await ProfileSaveContact.create({
          profile_id: businessProfile.id,
          button_text: "Connect",
          button_corner_radius: 10,
          is_enabled: !!is_enabled,
        });
      } else {
        saveContact.is_enabled = !!is_enabled;
        await saveContact.save();
      }

      return res.status(200).json({
        status: "success",
        message: `Save contact button ${saveContact.is_enabled ? "enabled" : "disabled"} successfully`,
        data: {
          is_enabled: saveContact.is_enabled,
        },
      });
    } catch (err) {
      console.error("Error in toggleMyBusinessProfileSaveContactStatus:", err);
      return next(err);
    }
  },
  createMyBusinessProfileMedia: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("createMyBusinessProfileMedia called by userId:", userId);

    if (!userId) return next(new HttpError(401, "Unauthorized"));

    const { userProfileId } = req.params;
    try {
      const user = await User.findByPk(userId);
      if (!user) return next(new HttpError(404, "User not found"));

      const businessType = await ProfileType.findOne({ where: { type: "BUSINESS" } });
      if (!businessType) {
        return next(new HttpError(400, "Business profile type not configured"));
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: businessType.id },
      });
      if (!userProfile) return next(new HttpError(400, "Business profile not found"));

      const businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);
      if (!businessProfile) return next(new HttpError(400, "Business profile missing"));

      // single file upload: upload.single("media")
      const file = req.file;
      if (!file) {
        return next(new HttpError(400, "media file is required"));
      }

      // next sequence
      const maxSeq = await ProfileMedia.max("sequence", {
        where: { user_profile_id: userProfile.id },
      });

      const nextSequence =
        typeof maxSeq === "number" && !Number.isNaN(maxSeq) ? maxSeq + 1 : 1;

      const mediaUrl = `/uploads/media/${file.filename}`;

      const created = await ProfileMedia.create({
        user_profile_id: userProfile.id,
        profile_id: businessProfile.id,
        user_id: userId,
        media_url: mediaUrl,
        sequence: nextSequence,
        is_visible: true,
      });

      // ensure customization exists
      let mediaCustomization = await ProfileMediaCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
        },
      });

      if (!mediaCustomization) {
        mediaCustomization = await ProfileMediaCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          layout: "CAROUSAL",
        });
      }

      const media = await ProfileMedia.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      return res.status(201).json({
        message: "Media uploaded successfully",
        uploaded: {
          ...created.toJSON(),
          media_url: created.media_url
            ? `${SERVER_URL_NORMALIZED}${created.media_url.startsWith("/") ? "" : "/"}${created.media_url}`
            : created.media_url,
        },
        media: media.map((m) => {
          const j = m.toJSON();
          return {
            ...j,
            media_url: j.media_url
              ? `${SERVER_URL_NORMALIZED}${j.media_url.startsWith("/") ? "" : "/"}${j.media_url}`
              : j.media_url,
          };
        }),
        mediaCustomization,
      });
    } catch (err) {
      console.error("Error in createMyBusinessProfileMedia:", err);
      return next(err);
    }
  },

  updateMyBusinessProfileMediaSequenceAndLayout: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("updateMyBusinessProfileMediaSequenceAndLayout called:", userId);

    if (!userId) return next(new HttpError(401, "Unauthorized"));

    const { layout, media } = req.body || {};
    const { userProfileId: paramUserProfileId } = req.params;

    const allowedLayouts = ["CARDS", "CAROUSAL"];
    if (layout && !allowedLayouts.includes(layout)) {
      return next(new HttpError(400, "Invalid layout. Must be CARDS or CAROUSAL"));
    }

    if (!Array.isArray(media) || media.length === 0) {
      return next(new HttpError(400, "media must be a non-empty array of { id, is_visible }"));
    }

    for (const item of media) {
      if (typeof item.id !== "number") {
        return next(new HttpError(400, "Each media entry must include a numeric id"));
      }
      if (item.is_visible !== undefined && typeof item.is_visible !== "boolean") {
        return next(new HttpError(400, "is_visible must be a boolean if provided"));
      }
    }

    const orderedIds = media.map((m) => m.id);

    try {
      const user = await User.findByPk(userId);
      if (!user) return next(new HttpError(404, "User not found"));

      const businessType = await ProfileType.findOne({ where: { type: "BUSINESS" } });
      if (!businessType) {
        return next(new HttpError(400, "Business profile type not configured"));
      }

      let userProfile;
      if (paramUserProfileId) {
        userProfile = await UserProfile.findOne({
          where: { id: paramUserProfileId, user_id: userId, profile_type_id: businessType.id },
        });
      } else {
        // Try to infer profile from the first media ID provided
        if (orderedIds.length > 0) {
          const sampleMedia = await ProfileMedia.findByPk(orderedIds[0]);
          if (sampleMedia) {
            userProfile = await UserProfile.findOne({
              where: { id: sampleMedia.user_profile_id, user_id: userId, profile_type_id: businessType.id },
            });
          }
        }
        
        // Fallback to the first storefront profile if still not found
        if (!userProfile) {
          userProfile = await UserProfile.findOne({
            where: { user_id: userId, profile_type_id: businessType.id },
          });
        }
      }

      if (!userProfile) return next(new HttpError(400, "Business profile not found"));

      const businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);
      if (!businessProfile) return next(new HttpError(400, "Business profile missing"));

      const existingMedia = await ProfileMedia.findAll({
        where: { user_profile_id: userProfile.id },
      });

      const existingIds = existingMedia.map((m) => m.id);

      const missingInRequest = existingIds.filter((id) => !orderedIds.includes(id));
      const unknownIds = orderedIds.filter((id) => !existingIds.includes(id));

      if (missingInRequest.length > 0 || unknownIds.length > 0) {
        const errObj = new HttpError(
          400,
          "media array must contain exactly all media IDs for the selected business profile"
        );
        errObj.missing_ids = missingInRequest;
        errObj.unknown_ids = unknownIds;
        return next(errObj);
      }

      // sequence and visibility updates
      const mediaMap = new Map(existingMedia.map((m) => [m.id, m]));
      const updates = [];

      media.forEach((item, index) => {
        const entity = mediaMap.get(item.id);
        const newSeq = index + 1;
        let changed = false;

        if (entity) {
          if (entity.sequence !== newSeq) {
            entity.sequence = newSeq;
            changed = true;
          }
          if (typeof item.is_visible === "boolean" && entity.is_visible !== item.is_visible) {
            entity.is_visible = item.is_visible;
            changed = true;
          }
          if (changed) {
            updates.push(entity.save());
          }
        }
      });

      if (updates.length > 0) {
        await Promise.all(updates);
      }

      // layout update
      let mediaCustomization = await ProfileMediaCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
        },
      });

      if (!mediaCustomization) {
        mediaCustomization = await ProfileMediaCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          user_id: userId,
          layout: layout || "CAROUSAL",
        });
      } else if (layout && mediaCustomization.layout !== layout) {
        mediaCustomization.layout = layout;
        await mediaCustomization.save();
      }

      const allMedia = await ProfileMedia.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      return res.json({
        success: true,
        message: "Media sequence and layout updated successfully",
        media: allMedia.map((m) => {
          const j = m.toJSON();
          return {
            ...j,
            media_url: j.media_url
              ? `${SERVER_URL_NORMALIZED}${j.media_url.startsWith("/") ? "" : "/"}${j.media_url}`
              : j.media_url,
          };
        }),
        mediaCustomization,
      });
    } catch (err) {
      console.error("Error in updateMyBusinessProfileMediaSequenceAndLayout:", err);
      return next(err);
    }
  },
  deleteMyBusinessProfileMedia: async (req, res, next) => {
    const userId = req.user?.id;
    const mediaId = Number(req.params.id);

    console.log("deleteMyBusinessProfileMedia called:", { userId, mediaId });

    if (!userId) return next(new HttpError(401, "Unauthorized"));
    if (!Number.isInteger(mediaId)) return next(new HttpError(400, "Invalid media id"));

    try {
      const mediaItem = await ProfileMedia.findByPk(mediaId);
      if (!mediaItem) return next(new HttpError(404, "Media not found"));

      const businessType = await ProfileType.findOne({ where: { type: "BUSINESS" } });
      if (!businessType) {
        return next(new HttpError(400, "Business profile type not configured"));
      }

      // Verify the media belongs to a business profile of this user
      const userProfile = await UserProfile.findOne({
        where: { id: mediaItem.user_profile_id, user_id: userId, profile_type_id: businessType.id }
      });

      if (!userProfile) {
        return next(new HttpError(403, "You do not have permission to delete this media"));
      }

      await mediaItem.destroy();

      // ✅ Re-sequence remaining media for this specific user profile
      const remaining = await ProfileMedia.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      const updates = [];
      remaining.forEach((m, index) => {
        const newSeq = index + 1;
        if (m.sequence !== newSeq) {
          m.sequence = newSeq;
          updates.push(m.save());
        }
      });

      await Promise.all(updates);

      const updatedMedia = await ProfileMedia.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      return res.json({
        success: true,
        message: "Media deleted successfully",
        media: updatedMedia.map((m) => {
          const j = m.toJSON();
          return {
            ...j,
            media_url: j.media_url
              ? `${SERVER_URL_NORMALIZED}${j.media_url.startsWith("/") ? "" : "/"}${j.media_url}`
              : j.media_url,
          };
        }),
      });
    } catch (err) {
      console.error("Error in deleteMyBusinessProfileMedia:", err);
      return next(err);
    }
  },


  getBusinessProfileExistingLinks: async (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
      console.warn("Unauthorized: no userId in request");
      return next(new HttpError(401, "Unauthorized"));
    }

    try {
      const platforms = await PlatformLink.findAll({
        attributes: [
          "id",
          "name",
          "type",
          "start_link",
          "default_icon",
          "black_icon",
          "stroked_icon",
          "colored_icon",
          "white_icon",
        ],
        order: [["name", "ASC"]],
      });

      return res.json({ platforms });

    } catch (err) {
      console.error("Error in getBusinessProfileExistingLinks:", err);
      return next(err);
    }
  },




//  getUserAnalytics: async (req, res, next) => {
//   debugger
//   const userId = req.user?.id;

//   if (!userId) {
//     return next(new HttpError(401, "Unauthorized"));
//   }

//   const userProfileId = req.params.userProfileId;

//   if (!userProfileId) {
//     return next(new HttpError(422, "User profile ID is required"));
//   }

//   // "today" | "weekly" | "monthly" | "yearly"
//   const { filter = "today" } = req.query;

//   try {
//     const userprofile = await UserProfile.findByPk(userProfileId);
//     if (!userprofile) {
//       return next(new HttpError(404, "User profile not found"));
//     }

//     const now = new Date();
//     const utcToday = now.toISOString().split("T")[0];

//     // Build date range based on filter
//     let startDate;
//     if (filter === "today") {
//       startDate = utcToday;
//     } else if (filter === "weekly") {
//       const d = new Date(now);
//       d.setUTCDate(d.getUTCDate() - 7);
//       startDate = d.toISOString().split("T")[0];
//     } else if (filter === "monthly") {
//       const d = new Date(now);
//       d.setUTCMonth(d.getUTCMonth() - 1);
//       startDate = d.toISOString().split("T")[0];
//     } else if (filter === "yearly") {
//       const d = new Date(now);
//       d.setUTCFullYear(d.getUTCFullYear() - 1);
//       startDate = d.toISOString().split("T")[0];
//     }

//     // ─── Stat Cards ─────────────────────────────────────────
//     // Sum all rows in the date range from UserAnalytics
//     const analyticsRows = await UserAnalytics.findAll({
//       where: {
//         user_profile_id: userProfileId,
//         analytics_date: {
//           [Op.gte]: startDate,
//           [Op.lte]: utcToday,
//         },
//       },
//       attributes: [
//         [sequelize.fn("SUM", sequelize.col("views_count")), "total_views"],
//         [sequelize.fn("SUM", sequelize.col("clicks_count")), "total_clicks"],
//         [sequelize.fn("SUM", sequelize.col("interactions_count")), "total_interactions"],
//         [sequelize.fn("AVG", sequelize.col("engagement_rate")), "avg_engagement_rate"],
//       ],
//       raw: true,
//     });

//     const stats = analyticsRows[0];

//     const totalViews        = parseInt(stats.total_views) || 0;
//     const totalClicks       = parseInt(stats.total_clicks) || 0;
//     const totalInteractions = parseInt(stats.total_interactions) || 0;
//     const engagementRate    = parseFloat(stats.avg_engagement_rate || 0).toFixed(2);

   


//     // ─── Country Analytics ───────────────────────────────────
// const countryData = await UserAnalyticsCountryTotal.findAll({
//   where: {
//     user_profile_id: userProfileId,
//   },
//   attributes: ["country_code", "country_name", "total_views_count",],
//   order: [["total_views_count", "DESC"]], // highest views first
//   raw: true,
// });
   





// // ─── Platform Link Analytics ─────────────────────────────
// const platformLinkData = await PlatformLinkAnalytics.findAll({
//   where: {
//     user_profile_id: userProfileId,
//     analytics_date: {
//       [Op.gte]: startDate,
//       [Op.lte]: utcToday,
//     },
//   },
//   attributes: [
//     "profile_link_id",
//     [sequelize.fn("SUM", sequelize.col("PlatformLinkAnalytics.clicks_count")), "total_clicks"],
//   ],
//   include: [
//     {
//       model: ProfileLink,
//       as: "profileLink",  // ✅ camelCase to match your association
//       attributes: ["title", "username", "url"],
//     },
//   ],
//   group: [
//     "PlatformLinkAnalytics.profile_link_id",
//     "profileLink.id",    // ✅ camelCase here too
//   ],
//   order: [[sequelize.literal("total_clicks"), "DESC"]],
//   raw: false,
// });




// // ─── Traffic Source Analytics ─────────────────────────────
// const sourceData = await UserAnalyticsSource.findAll({
//   where: {
//     user_profile_id: userProfileId,
//     analytics_date: {
//       [Op.gte]: startDate,
//       [Op.lte]: utcToday,
//     },
//   },
//   attributes: [
//     "source",
//     [sequelize.fn("SUM", sequelize.col("views_count")), "total_views"],
//   ],
//   group: ["source"],
//   order: [[sequelize.literal("total_views"), "DESC"]],
//   raw: true,
// });

//  return res.status(200).json({
//       status: true,
//       filter,
//       stats: {
//         total_views: totalViews,
//         total_clicks: totalClicks,
//         total_interactions: totalInteractions,
//         engagement_rate: engagementRate,
//       },

//       countries: countryData,
//       platformLinkData,
//       traffic_sources: sourceData,
//     });
//   } catch (err) {
//     console.error("Error in getUserAnalytics:", err);
//     return next(err);
//   }
// },


getUserAnalytics: async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new HttpError(401, "Unauthorized"));
  }

  const userProfileId = req.params.userProfileId;

  if (!userProfileId) {
    return next(new HttpError(422, "User profile ID is required"));
  }

  const { filter = "today" } = req.query;

  try {
    const userprofile = await UserProfile.findByPk(userProfileId);
    if (!userprofile) {
      return next(new HttpError(404, "User profile not found"));
    }

    const now = new Date();
    const utcToday = now.toISOString().split("T")[0];

    // ─── Build Current Period Date Range ─────────────────────
    let startDate;
    if (filter === "today") {
      startDate = utcToday;
    } else if (filter === "weekly") {
      const d = new Date(now);
      d.setUTCDate(d.getUTCDate() - 7);
      startDate = d.toISOString().split("T")[0];
    } else if (filter === "monthly") {
      const d = new Date(now);
      d.setUTCMonth(d.getUTCMonth() - 1);
      startDate = d.toISOString().split("T")[0];
    } else if (filter === "yearly") {
      const d = new Date(now);
      d.setUTCFullYear(d.getUTCFullYear() - 1);
      startDate = d.toISOString().split("T")[0];
    }

    // ─── Build Previous Period Date Range ────────────────────
    let previousStart, previousEnd;

    if (filter === "today") {
      const yesterday = new Date(now);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      previousStart = yesterday.toISOString().split("T")[0];
      previousEnd = previousStart;

    } else if (filter === "weekly") {
      const lastWeekEnd = new Date(now);
      lastWeekEnd.setUTCDate(lastWeekEnd.getUTCDate() - 8); // day before current week
      const lastWeekStart = new Date(lastWeekEnd);
      lastWeekStart.setUTCDate(lastWeekStart.getUTCDate() - 6);
      previousStart = lastWeekStart.toISOString().split("T")[0];
      previousEnd = lastWeekEnd.toISOString().split("T")[0];

    } else if (filter === "monthly") {
      const lastMonthEnd = new Date(now);
      lastMonthEnd.setUTCMonth(lastMonthEnd.getUTCMonth() - 1);
      lastMonthEnd.setUTCDate(lastMonthEnd.getUTCDate() - 1);
      const lastMonthStart = new Date(lastMonthEnd);
      lastMonthStart.setUTCMonth(lastMonthStart.getUTCMonth() - 1);
      previousStart = lastMonthStart.toISOString().split("T")[0];
      previousEnd = lastMonthEnd.toISOString().split("T")[0];

    } else if (filter === "yearly") {
      const lastYearEnd = new Date(now);
      lastYearEnd.setUTCFullYear(lastYearEnd.getUTCFullYear() - 1);
      lastYearEnd.setUTCDate(lastYearEnd.getUTCDate() - 1);
      const lastYearStart = new Date(lastYearEnd);
      lastYearStart.setUTCFullYear(lastYearStart.getUTCFullYear() - 1);
      previousStart = lastYearStart.toISOString().split("T")[0];
      previousEnd = lastYearEnd.toISOString().split("T")[0];
    }

    // ─── Stat Cards ──────────────────────────────────────────
    const analyticsRows = await UserAnalytics.findAll({
      where: {
        user_profile_id: userProfileId,
        analytics_date: { [Op.gte]: startDate, [Op.lte]: utcToday },
      },
      attributes: [
        [sequelize.fn("SUM", sequelize.col("views_count")), "total_views"],
        [sequelize.fn("SUM", sequelize.col("clicks_count")), "total_clicks"],
        [sequelize.fn("SUM", sequelize.col("interactions_count")), "total_interactions"],
        [sequelize.fn("AVG", sequelize.col("engagement_rate")), "avg_engagement_rate"],
      ],
      raw: true,
    });

    const stats = analyticsRows[0];
    const totalViews        = parseInt(stats.total_views) || 0;
    const totalClicks       = parseInt(stats.total_clicks) || 0;
    const totalInteractions = parseInt(stats.total_interactions) || 0;
    const engagementRate    = parseFloat(stats.avg_engagement_rate || 0).toFixed(2);

    // ─── Country Analytics ───────────────────────────────────
    const countryData = await UserAnalyticsCountryTotal.findAll({
      where: { user_profile_id: userProfileId },
      attributes: ["country_code", "country_name", "total_views_count"],
      order: [["total_views_count", "DESC"]],
      raw: true,
    });

    // ─── Platform Link Analytics ─────────────────────────────
    const platformLinkData = await PlatformLinkAnalytics.findAll({
      where: {
        user_profile_id: userProfileId,
        analytics_date: { [Op.gte]: startDate, [Op.lte]: utcToday },
      },
      attributes: [
        "profile_link_id",
        [sequelize.fn("SUM", sequelize.col("PlatformLinkAnalytics.clicks_count")), "total_clicks"],
      ],
      include: [
        {
          model: ProfileLink,
          as: "profileLink",
          attributes: ["title", "username", "url"],
        },
      ],
      group: ["PlatformLinkAnalytics.profile_link_id", "profileLink.id"],
      order: [[sequelize.literal("total_clicks"), "DESC"]],
      raw: false,
    });

    // ─── Traffic Source Analytics ─────────────────────────────
    const sourceData = await UserAnalyticsSource.findAll({
      where: {
        user_profile_id: userProfileId,
        analytics_date: { [Op.gte]: startDate, [Op.lte]: utcToday },
      },
      attributes: [
        "source",
        [sequelize.fn("SUM", sequelize.col("views_count")), "total_views"],
      ],
      group: ["source"],
      order: [[sequelize.literal("total_views"), "DESC"]],
      raw: true,
    });

    // ─── Period Comparison ────────────────────────────────────
    const currentPeriod = await UserAnalytics.findAll({
      where: {
        user_profile_id: userProfileId,
        analytics_date: { [Op.gte]: startDate, [Op.lte]: utcToday },
      },
      attributes: ["analytics_date", "views_count", "clicks_count"],
      order: [["analytics_date", "ASC"]],
      raw: true,
    });

    const previousPeriod = await UserAnalytics.findAll({
      where: {
        user_profile_id: userProfileId,
        analytics_date: { [Op.gte]: previousStart, [Op.lte]: previousEnd },
      },
      attributes: ["analytics_date", "views_count", "clicks_count"],
      order: [["analytics_date", "ASC"]],
      raw: true,
    });



    // ─── Activity Distribution ────────────────────────────────
const totalActivity = totalViews + totalClicks;

const activityDistribution = {
  profile_views: {
    count: totalViews,
    percentage: totalActivity > 0 ? ((totalViews / totalActivity) * 100).toFixed(2) : "0.00",
  },
  link_clicks: {
    count: totalClicks,
    percentage: totalActivity > 0 ? ((totalClicks / totalActivity) * 100).toFixed(2) : "0.00",
  },
};




// ─── Latest 3 Contacts ────────────────────────────────────
const latestContacts = await ProfileContactSubmission.findAll({
  where: {
    profile_id: userprofile.profile_id,
  },
  order: [["id", "DESC"]], // latest first
  limit: 3,
  raw: true,
});

    return res.status(200).json({
      status: true,
      filter,
      stats: {
        total_views: totalViews,
        total_clicks: totalClicks,
        total_interactions: totalInteractions,
        engagement_rate: engagementRate,
      },
      
      traffic_sources: sourceData,
      period_comparison: {
        current: {
          start: startDate,
          end: utcToday,
          data: currentPeriod,
        },
        previous: {
          start: previousStart,
          end: previousEnd,
          data: previousPeriod,
        },
      },
      activity_distribution: activityDistribution,
      contacts_submission: latestContacts,
      countries: countryData,
      platform_links: platformLinkData,
    });

  } catch (err) {
    console.error("Error in getUserAnalytics:", err);
    return next(err);
  }
},


liveUserAnalytics: async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new HttpError(401, "Unauthorized"));
  }

  const userProfileId = req.params.userProfileId;

  if (!userProfileId) {
    return next(new HttpError(422, "User profile ID is required"));
  }

  // const { filter = "today" } = req.query;

  try {
    const userprofile = await UserProfile.findByPk(userProfileId);
    if (!userprofile) {
      return next(new HttpError(404, "User profile not found"));
    }

    const now = new Date();
    const utcToday = now.toISOString().split("T")[0];

    // ─── Build Current Period Date Range ─────────────────────
    let startDate;
   

    

   // ─── Hourly Breakdown (views + clicks per hour today) ────
    const hourlyRows = await UserAnalyticsHourly.findAll({
      where: {
        user_profile_id: userProfileId,
        analytics_date: utcToday,
      },
      attributes: [
        "analytics_hour_utc",
        "views_count",
        "clicks_count",
      ],
      order: [["analytics_hour_utc", "ASC"]],
      raw: true,
    });


    console.log("Hourly rows:", hourlyRows);

    // Fill all 24 hours, missing hours = 0
    const hourlyData = Array.from({ length: 24 }, (_, h) => {
      const found = hourlyRows.find(
        (r) => new Date(r.analytics_hour_utc).getUTCHours() === h
      );
      return {
        hour: `${String(h).padStart(2, "0")}:00`,        // "09:00"
        timestamp: new Date(Date.UTC(                     // frontend converts to local time
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          h
        )).toISOString(),
        views: found?.views_count || 0,
        clicks: found?.clicks_count || 0,
      };
    });

    // ─── Today's Totals ──────────────────────────────────────
    const todayTotals = hourlyData.reduce(
      (acc, row) => {
        acc.total_views += row.views;
        acc.total_clicks += row.clicks;
        return acc;
      },
      { total_views: 0, total_clicks: 0 }
    );

    // ─── Live Traffic Sources (today only) ───────────────────
    const sourceData = await UserAnalyticsSource.findAll({
      where: {
        user_profile_id: userProfileId,
        analytics_date: utcToday,
      },
      attributes: [
        "source",
        [sequelize.fn("SUM", sequelize.col("views_count")), "total_views"],
      ],
      group: ["source"],
      order: [[sequelize.literal("total_views"), "DESC"]],
      raw: true,
    });

   

    return res.status(200).json({
      status: true,
      date: utcToday,
      totals: {
        total_views: todayTotals.total_views,
        total_clicks: todayTotals.total_clicks,
      },
      hourly: hourlyData,
      live_sources: sourceData,
    });

  } catch (err) {
    console.error("Error in getUserAnalytics:", err);
    return next(err);
  }
},

};

export default BusinessProfileController;
