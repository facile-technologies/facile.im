// src/controllers/profile/PersonalProfileController.js

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
import JoiValidation from "../../utils/joiValidation.js";
import PersonalCustomLinkCustomization from "../../models/PersonalCustomLinkCustomization.model.js";
import PersonalProfileLinkCustomization from "../../models/PersonalProfileLinkCustomization.model.js";
import ProfileSaveContact from "../../models/ProfileSaveContact.model.js";
import ProfileMediaCustomization from "../../models/ProfileMediaCustomization.model.js";
import ProfileMedia from "../../models/ProfileMedia.model.js";
import { SERVER_URL_NORMALIZED } from "../../config/index.js";
import CustomErrorHandler from "../../middlewares/errors/customErrorHandler.js";
import HttpError from "../../middlewares/errors/HttpError.js";
import UserAnalyticsTotal from "../../models/UserAnalyticsTotal.model.js";

const PersonalProfileController = {
  getMyPersonalProfile: async (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError(401, "Unauthorized: user not found"));
    }

    const { userProfileId } = req.params;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      // 1. Ensure ProfileType PERSONAL exists
      let personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });

      if (!personalType) {
        personalType = await ProfileType.create({
          type: "PERSONAL",
          category: "NETWORK",
          name: "Personal",
          description: "personal profile",
        });
      }

      // 2. Find or create userProfile + personalProfile + profile customization
      let userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });

      if (!userProfile) {
        return HttpError(404, "Personal profile not found.")
      }

      // let personalProfile;
      // let customization;

      // if (!userProfile) {
      //   const [firstNameFromFull, ...rest] = (user.full_name || "").split(" ");
      //   const lastNameFromFull = rest.join(" ") || null;

      //   personalProfile = await PersonalProfile.create({
      //     user_id: userId,
      //     first_name: user.first_name || firstNameFromFull || null,
      //     last_name: user.last_name || lastNameFromFull || null,
      //     username: user.username,
      //     bio: "",
      //     banner: null,
      //     profile_image: null,
      //     logo: null,
      //   });

      //   userProfile = await UserProfile.create({
      //     user_id: userId,
      //     profile_type_id: personalType.id,
      //     profile_id: personalProfile.id,
      //     profile_type_name: "Personal Profile",
      //     role: "OWNER",
      //     is_primary: true,
      //     is_active: true,
      //   });

      //   customization = await ProfileCustomization.create({
      //     user_profile_id: userProfile.id,
      //     profile_id: personalProfile.id,
      //     about_text_color: "#ffff",
      //     font_family: "inter",
      //     font_size: 16,
      //     background_color: "#000000",
      //     background_image: null,
      //     background_blur: 0,
      //     layout: "DEFAULT",
      //   });
      // } else {
      //   personalProfile = await PersonalProfile.findByPk(userProfile.profile_id);

      //   if (!personalProfile) {
      //     return next(
      //       new HttpError(500, "Corrupted profile: missing PersonalProfile")
      //     );
      //   }

      //   customization = await ProfileCustomization.findOne({
      //     where: { user_profile_id: userProfile.id },
      //   });

      //   if (!customization) {
      //     customization = await ProfileCustomization.create({
      //       user_profile_id: userProfile.id,
      //       profile_id: personalProfile.id,
      //       about_text_color: "#ffff",
      //       font_family: "inter",
      //       font_size: 16,
      //        background_color: "#000000",
      //       background_image: null,
      //       background_blur: 0,
      //       layout: "DEFAULT",
      //     });
      //   }
      // }



      let personalProfile = await PersonalProfile.findByPk(userProfile.profile_id);

      if (!personalProfile) {
        return next(
          new HttpError(500, "Corrupted profile: missing PersonalProfile")
        );
      }

      let customization = await ProfileCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      });

      if (!customization) {
        customization = await ProfileCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
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

      let linkCustomization = await PersonalProfileLinkCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
        },
      });

      if (!linkCustomization) {
        linkCustomization = await PersonalProfileLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
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

      let customLinkCustomization = await PersonalCustomLinkCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
        },
      });

      if (!customLinkCustomization) {
        customLinkCustomization = await PersonalCustomLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
          layout: "ICONS",
          background_color: "#1C1D2d",
          title_color: "#ffff",
        });
      }

      //
      // 4.5 MEDIA + THEIR CUSTOMIZATION (auto-create if missing)
      //
      const media = await ProfileMedia.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      let mediaCustomization = await ProfileMediaCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
        },
      });

      if (!mediaCustomization) {
        mediaCustomization = await ProfileMediaCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
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
          profile_id: personalProfile.id,
        },
      });

      if (!contact) {
        contact = await ProfileContact.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          title: "",
          description: "",
          layout: "COMPACT",
          is_enabled: true,
          button_text: "Connect",
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
        where: { profile_id: personalProfile.id },
      });

      if (!saveContact) {
        saveContact = await ProfileSaveContact.create({
          profile_id: personalProfile.id,
          button_text: "Connect",
          button_corner_radius: 10,
          button_bg_color: "#4f2e86",
          button_text_color: "#ffff",
        });
      }

      // ✅ Build full URLs inline (no helper)
      const profileJson = personalProfile.toJSON();
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
      console.error("Error in getMyPersonalProfile:", err);
      return next(err);
    }
  },


  createNewPersonalProfile: async (req, res, next) => {
    const userId = req.user?.id;

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

      // 1. Ensure ProfileType PERSONAL exists
      let personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });

      if (!personalType) {
        personalType = await ProfileType.create({
          type: "PERSONAL",
          category: "NETWORK",
          name: "Personal",
          description: "personal profile",
        });
      }


      const [firstNameFromFull, ...rest] = (user.full_name || "").split(" ");
      const lastNameFromFull = rest.join(" ") || null;

      const personalProfile = await PersonalProfile.create({
        user_id: userId,
        first_name: user.first_name || firstNameFromFull || null,
        last_name: user.last_name || lastNameFromFull || null,
        username: user.username,
        bio: "",
        banner: null,
        profile_image: null,
        logo: null,
      });

      const userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: personalType.id,
        profile_id: personalProfile.id,
        profile_type_name: "Personal Profile",
        role: "OWNER",
        is_primary: true,
        is_active: true,
      });

      const customization = await ProfileCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: personalProfile.id,
        about_text_color: "#ffff",
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

      let linkCustomization = await PersonalProfileLinkCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
        },
      });

      if (!linkCustomization) {
        linkCustomization = await PersonalProfileLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
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

      let customLinkCustomization = await PersonalCustomLinkCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
        },
      });

      if (!customLinkCustomization) {
        customLinkCustomization = await PersonalCustomLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
          layout: "ICONS",
          background_color: "#1C1D2d",
          title_color: "#ffff",
        });
      }

      //
      // 4.5 MEDIA + THEIR CUSTOMIZATION (auto-create if missing)
      //
      const media = await ProfileMedia.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      let mediaCustomization = await ProfileMediaCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
        },
      });

      if (!mediaCustomization) {
        mediaCustomization = await ProfileMediaCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
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
          profile_id: personalProfile.id,
        },
      });

      if (!contact) {
        contact = await ProfileContact.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          title: "",
          description: "",
          layout: "COMPACT",
          is_enabled: true,
          button_text: "Connect",
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
        where: { profile_id: personalProfile.id },
      });

      if (!saveContact) {
        saveContact = await ProfileSaveContact.create({
          profile_id: personalProfile.id,
          button_text: "Connect",
          button_corner_radius: 10,
          button_bg_color: "#4f2e86",
          button_text_color: "#ffff",
        });
      }



     let userAnalyticsTotal= await UserAnalyticsTotal.create({
            user_id: userProfile.user_id,
            user_profile_id: userProfile.id,
           
            
          });

      // ✅ Build full URLs inline (no helper)
      const profileJson = personalProfile.toJSON();
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
      console.error("Error in getMyPersonalProfile:", err);
      return next(err);
    }
  },


  validateUsernameUnique: async (req, res, next) => {
    const userId = req.user?.id;
    const { username } = req.query;

    if (!userId) {
      return next(
        new HttpError(401, "Unauthorized: user not found in request")
      );
    }

    if (!username || typeof username !== "string") {
      return next(
        new HttpError(400, "Query parameter 'username' is required")
      );
    }

    try {
      const existingProfile = await PersonalProfile.findOne({
        where: { username },
      });

      if (!existingProfile) {
        return res.json({
          username,
          available: true,
        });
      }

      if (existingProfile.user_id === userId) {
        return res.json({
          username,
          available: true,
          note: "Username is already yours",
        });
      }

      return res.json({
        username,
        available: false,
      });
    } catch (err) {
      console.error("Error in validateUsernameUnique:", err);
      return next(err);
    }
  },

  getMyPersonalProfileCustomization: async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    try {
      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });

      const userProfile = await UserProfile.findOne({
        where: { user_id: userId, profile_type_id: personalType?.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(
            400,
            "Personal profile not found. Visit /v1/profile/personal/me first."
          )
        );
      }

      const customization = await ProfileCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      });

      if (!customization) {
        return next(
          new HttpError(400, "Customization profile missing")
        );
      }

      return res.json({ customization });
    } catch (err) {
      console.error("Error in getMyPersonalProfileCustomization:", err);
      return next(err);
    }
  },

  updateMyPersonalProfile: async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;

    const { error } = JoiValidation.updatePersonalProfileValidation(req.body);
    if (error) {
      console.log(error);
      return next(error);
    }

    try {
      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });

      const userProfile = await UserProfile.findOne({
        where: {
          id: userProfileId,
          user_id: userId,
          profile_type_id: personalType?.id,
        },
      });

      if (!userProfile) {
        return next(new HttpError(400, "Personal profile not found"));
      }

      const personalProfile = await PersonalProfile.findByPk(
        userProfile.profile_id
      );

      const customization = await ProfileCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      });

      if (!personalProfile || !customization) {
        return next(new HttpError(400, "Profile or customization missing"));
      }

      const {
        first_name,
        last_name,
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

      // Convert string flags to boolean
      const shouldRemoveProfile = remove_profile_image === "true";
      const shouldRemoveLogo = remove_logo === "true";
      const shouldRemoveBanner = remove_banner === "true";
      const shouldRemoveBackground = remove_background_image === "true";

      // -----------------------------
      // Update profile basic fields
      // -----------------------------

      personalProfile.first_name = first_name;
      personalProfile.last_name = last_name;

      if (username !== personalProfile.username) {
        const inPersonal = await PersonalProfile.findOne({ where: { username } });
        const inBusiness = await BusinessProfile.findOne({ where: { username } });

        if (inPersonal || inBusiness) {
          return next(new HttpError(400, "Username is already taken globally."));
        }

        const now = new Date();
        const lastUpdate = personalProfile.last_username_update
          ? new Date(personalProfile.last_username_update)
          : null;

        if (lastUpdate) {
          const diffInDays =
            (now - lastUpdate) / (1000 * 60 * 60 * 24);

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

        personalProfile.username = username;
        personalProfile.last_username_update = now;
      }

      personalProfile.bio = bio;

      // -----------------------------
      // Update customization
      // -----------------------------

      if (about_text_color !== undefined)
        customization.about_text_color = about_text_color;

      if (font_family !== undefined)
        customization.font_family = font_family;

      if (font_size !== undefined)
        customization.font_size = parseInt(font_size);

      if (background_color !== undefined)
        customization.background_color = background_color;

      if (background_blur !== undefined)
        customization.background_blur = parseInt(background_blur);

      // -----------------------------
      // Uploaded files
      // -----------------------------

      const profilePicFile = req.files?.profilePicture?.[0];
      const logoFile = req.files?.logo?.[0];
      const bannerFile = req.files?.banner?.[0];
      const backgroundImageFile = req.files?.backgroundImage?.[0];

      // -----------------------------
      // Profile Image
      // -----------------------------

      if (shouldRemoveProfile) {
        personalProfile.profile_image = null;
      } else if (profilePicFile) {
        personalProfile.profile_image = `/uploads/profile/${profilePicFile.filename}`;
      }

      // -----------------------------
      // Logo
      // -----------------------------

      if (shouldRemoveLogo) {
        personalProfile.logo = null;
      } else if (logoFile) {
        personalProfile.logo = `/uploads/logo/${logoFile.filename}`;
      }

      // -----------------------------
      // Banner
      // -----------------------------

      if (shouldRemoveBanner) {
        personalProfile.banner = null;
      } else if (bannerFile) {
        personalProfile.banner = `/uploads/banner/${bannerFile.filename}`;
      }

      // -----------------------------
      // Background
      // -----------------------------

      if (shouldRemoveBackground) {
        customization.background_image = null;
      } else if (backgroundImageFile) {
        customization.background_image = `/uploads/background/${backgroundImageFile.filename}`;
      }

      await personalProfile.save();
      await customization.save();

      return res.json({
        message: "Profile updated successfully",
        profile: {
          ...personalProfile.toJSON(),
          profile_image: personalProfile.profile_image
            ? `${SERVER_URL_NORMALIZED}${personalProfile.profile_image.startsWith("/") ? "" : "/"}${personalProfile.profile_image}`
            : null,

          banner: personalProfile.banner
            ? `${SERVER_URL_NORMALIZED}${personalProfile.banner.startsWith("/") ? "" : "/"}${personalProfile.banner}`
            : null,

          logo: personalProfile.logo
            ? `${SERVER_URL_NORMALIZED}${personalProfile.logo.startsWith("/") ? "" : "/"}${personalProfile.logo}`
            : null,
        },
        customization: {
          ...customization.toJSON(),
          background_image: customization.background_image
            ? `${SERVER_URL_NORMALIZED}${customization.background_image.startsWith("/") ? "" : "/"}${customization.background_image}`
            : null,
        },
      });

    } catch (err) {
      console.error("Error in updateMyPersonalProfile:", err);
      return next(err);
    }
  },

  // PERSONAL PROFILE LINK

  createMyPersonalProfileLink: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("createMyPersonalProfileLink called by userId:", userId);

    if (!userId) {
      console.warn("Unauthorized: no userId in request");
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;
    const { platform_name, username, title } = req.body;
    console.log("Request body:", req.body);

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

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      console.log("Personal profile type fetched:", personalType?.id);

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType?.id },
      });
      console.log("UserProfile fetched:", userProfile?.id);

      if (!userProfile) {
        console.warn("Personal profile not found for userId:", userId);
        return next(
          new HttpError(400, "Personal profile not found")
        );
      }

      const personalProfile = await PersonalProfile.findByPk(
        userProfile.profile_id
      );
      console.log("PersonalProfile fetched:", personalProfile?.id);

      if (!personalProfile) {
        console.warn(
          "Personal profile missing for userProfileId:",
          userProfile.id
        );
        return next(
          new HttpError(400, "Personal profile missing")
        );
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

      console.log("Next sequence number for link:", nextSequence);

      const base = (platform.start_link || "").replace(/\/$/, "");
      const cleanUsername = username.replace(/^@/, "");
      const url =
        base && cleanUsername
          ? `${base}/${cleanUsername}`
          : platform.start_link || "";

      const finalTitle = title || platform.name || cleanUsername;

      console.log("URL and title prepared:", { url, finalTitle });

      const createdLink = await ProfileLink.create({
        platform_link_id: platform.id,
        user_profile_id: userProfile.id,
        profile_id: personalProfile.id,
        user_id: userId,
        title: finalTitle,
        username: cleanUsername,
        url,
        is_visible: true,
        sequence: nextSequence,
      });

      console.log("ProfileLink created with ID:", createdLink.id);

      let linkCustomization =
        await PersonalProfileLinkCustomization.findOne({
          where: {
            user_profile_id: userProfile.id,
            profile_id: personalProfile.id,
            user_id: userId,
          },
        });

      if (!linkCustomization) {
        console.log(
          "No PersonalProfileLinkCustomization found, creating defaults..."
        );

        linkCustomization = await PersonalProfileLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
          icon_styled: "DEFAULT",
          layout: "ICONS",
          background_color: "#ffffff",
          title_color: "#000000",
          link_color: "#0000ee",
        });

        console.log(
          "PersonalProfileLinkCustomization created with ID:",
          linkCustomization.id
        );
      } else {
        console.log(
          "Existing PersonalProfileLinkCustomization found with ID:",
          linkCustomization.id
        );
      }

      const createdWithPlatform = await ProfileLink.findByPk(createdLink.id, {
        include: [{ model: PlatformLink }],
      });

      return res.status(201).json({
        message: "Link created successfully",
        link: createdWithPlatform,
        linkCustomization,
      });
    } catch (err) {
      console.error("Error in createMyPersonalProfileLink:", err);
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

  getMyPersonalProfileLinks: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("getMyPersonalProfileLinks called by userId:", userId);

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

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      console.log("Personal profile type fetched:", personalType?.id);

      if (!personalType) {
        console.warn("ProfileType PERSONAL not found");
        return next(
          new HttpError(400, "Personal profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });
      console.log("UserProfile fetched:", userProfile?.id);

      if (!userProfile) {
        console.warn("Personal userProfile not found for userId:", userId);
        return next(
          new HttpError(400, "Personal profile not found for this user")
        );
      }

      const personalProfile = await PersonalProfile.findByPk(
        userProfile.profile_id
      );
      console.log("PersonalProfile fetched:", personalProfile?.id);

      if (!personalProfile) {
        console.warn(
          "Personal profile missing for userProfileId:",
          userProfile.id
        );
        return next(
          new HttpError(400, "Personal profile missing")
        );
      }

      const links = await ProfileLink.findAll({
        where: { user_profile_id: userProfile.id },
        include: [{ model: PlatformLink, required: false }],
        order: [["sequence", "ASC"]],
      });
      console.log(
        "ProfileLinks fetched for userProfile:",
        userProfile.id,
        "count:",
        links.length
      );

      let linkCustomization =
        await PersonalProfileLinkCustomization.findOne({
          where: {
            user_profile_id: userProfile.id,
            profile_id: personalProfile.id,
            user_id: userId,
          },
        });

      if (!linkCustomization) {
        console.log(
          "No PersonalProfileLinkCustomization found in getMyPersonalProfileLinks, creating defaults..."
        );

        linkCustomization = await PersonalProfileLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
          icon_styled: "DEFAULT",
          layout: "ICONS",
          background_color: "#ffffff",
          title_color: "#000000",
          link_color: "#0000ee",
        });

        console.log(
          "PersonalProfileLinkCustomization created with ID (from getMyPersonalProfileLinks):",
          linkCustomization.id
        );
      } else {
        console.log(
          "Existing PersonalProfileLinkCustomization found (from getMyPersonalProfileLinks) with ID:",
          linkCustomization.id
        );
      }

      return res.json({
        message: "Links fetched successfully",
        links,
        linkCustomization,
      });
    } catch (err) {
      console.error("Error in getMyPersonalProfileLinks:", err);
      return next(err);
    }
  },

  updateMyPersonalProfileLinksSequence: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyPersonalProfileLinksSequence called by userId:",
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
          new HttpError(
            400,
            "Each link entry must include a numeric id"
          )
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

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });

      if (!personalType) {
        return next(
          new HttpError(400, "Personal profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found for this user")
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
          "links array must contain exactly all link IDs for this personal profile"
        );
        errObj.missing_ids = missingInRequest;
        errObj.unknown_ids = unknownIds;
        return next(errObj);
      }

      const linkMap = new Map(existingLinks.map((l) => [l.id, l]));

      let updates = [];

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
        message: "Links updated successfully (order + visibility)",
        links: updatedLinks,
      });
    } catch (err) {
      console.error(
        "Error in updateMyPersonalProfileLinksSequence:",
        err
      );
      return next(err);
    }
  },

  editMyPersonalProfileLink: async (req, res, next) => {
    const userId = req.user?.id;
    const { userProfileId } = req.params;
    const linkId = Number(req.params.linkId);
    console.log(
      "editMyPersonalProfileLink called by userId:",
      userId,
      "for linkId:",
      linkId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    // if (!Number.isInteger(linkId)) {
    //   return next(new HttpError(400, "Invalid Platform link id"));
    // }

    const { platform_name, platform_link_id, username, title } = req.body;
    console.log("Edit link body:", req.body);

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        console.error("User not found for id:", userId);
        return next(new HttpError(404, "User not found"));
      }

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      if (!personalType) {
        return next(
          new HttpError(400, "Personal profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found for this user")
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
          "Link not found or does not belong to userProfile:",
          {
            linkId,
            userProfileId: userProfile.id,
          }
        );
        return next(new HttpError(404, "Link not found"));
      }

      let platform = null;

      if (platform_link_id) {
        platform = await PlatformLink.findByPk(platform_link_id);
        console.log("Platform fetched by ID (edit):", platform?.id);
        if (!platform) {
          return next(
            new HttpError(400, "Invalid platform_link_id")
          );
        }
        link.platform_link_id = platform.id;
      } else if (platform_name) {
        platform = await PlatformLink.findOne({
          where: { name: platform_name },
        });
        console.log("Platform fetched by name (edit):", platform?.id);
        if (!platform) {
          return next(
            new HttpError(400, "Invalid platform_name")
          );
        }
        link.platform_link_id = platform.id;
      } else {
        platform = await PlatformLink.findByPk(link.platform_link_id);
        console.log("Platform fetched from existing link:", platform?.id);
        if (!platform) {
          return next(
            new HttpError(
              400,
              "Platform for this link no longer exists"
            )
          );
        }
      }

      if (typeof username === "string" && username.trim() !== "") {
        link.username = username;
      }

      const cleanUsername = link.username.replace(/^@/, "");

      const base = (platform.start_link || "").replace(/\/$/, "");
      const newUrl =
        base && cleanUsername
          ? `${base}/${cleanUsername}`
          : platform.start_link || "";
      link.url = newUrl;

      if (typeof title === "string" && title.trim() !== "") {
        link.title = title;
      }

      await link.save();
      console.log("ProfileLink updated with id:", link.id);

      const updatedWithPlatform = await ProfileLink.findByPk(link.id, {
        include: [{ model: PlatformLink, required: false }],
      });

      return res.json({
        message: "Link updated successfully",
        link: updatedWithPlatform,
      });
    } catch (err) {
      console.error("Error in editMyPersonalProfileLink:", err);
      return next(err);
    }
  },

  deleteMyPersonalProfileLink: async (req, res, next) => {
    const userId = req.user?.id;
    const { userProfileId } = req.params;
    const linkId = Number(req.params.linkId);

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const parsedLinkId = Number(linkId);

    // if (!Number.isInteger(parsedLinkId)) {
    //   return next(new HttpError(400, "Invalid Platform link id"));
    // }

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        console.error("User not found for id:", userId);
        return next(new HttpError(404, "User not found"));
      }

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      if (!personalType) {
        return next(
          new HttpError(400, "Personal profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found for this user")
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
          "Link not found or does not belong to userProfile:",
          {
            linkId,
            userProfileId: userProfile.id,
          }
        );
        return next(new HttpError(404, "Link not found"));
      }

      console.log("Deleting ProfileLink with id:", link.id);
      await link.destroy();

      const remainingLinks = await ProfileLink.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      let updates = [];
      remainingLinks.forEach((l, index) => {
        const newSeq = index + 1;
        if (l.sequence !== newSeq) {
          console.log(
            `Re-sequencing link ${l.id} from ${l.sequence} to ${newSeq}`
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
        message: "Link deleted successfully",
        links: updatedLinks,
      });
    } catch (err) {
      console.error("Error in deleteMyPersonalProfileLink:", err);
      return next(err);
    }
  },

  updateMyPersonalProfileLinkCustomization: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyPersonalProfileLinkCustomization called by userId:",
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

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });

      const personalProfile = await PersonalProfile.findByPk(
        userProfile.profile_id
      );

      let linkCustomization =
        await PersonalProfileLinkCustomization.findOne({
          where: {
            user_profile_id: userProfile.id,
            profile_id: personalProfile.id,
            user_id: userId,
          },
        });

      if (!linkCustomization) {
        console.log("No customization found; creating default...");
        linkCustomization = await PersonalProfileLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
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
        console.log("Applying ICONS layout.");
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
        message: "Personal profile link customization updated",
        customization: linkCustomization,
      });
    } catch (err) {
      console.error(
        "Error in updateMyPersonalProfileLinkCustomization:",
        err
      );
      return next(err);
    }
  },

  // PERSONAL CUSTOM LINK

  createMyPersonalCustomLink: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("createMyPersonalCustomLink called by userId:", userId);

    if (!userId) {
      console.warn("Unauthorized: no userId in request");
      return next(new HttpError(401, "Unauthorized"));
    }

    const { userProfileId } = req.params;
    const { title, url } = req.body || {};
    console.log("Request body (custom link):", req.body);

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

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      console.log("Personal profile type fetched:", personalType?.id);
      if (!personalType) {
        return next(
          new HttpError(400, "Personal profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });
      console.log("UserProfile fetched:", userProfile?.id);
      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found for this user")
        );
      }

      const personalProfile = await PersonalProfile.findByPk(
        userProfile.profile_id
      );
      console.log("PersonalProfile fetched:", personalProfile?.id);
      if (!personalProfile) {
        return next(
          new HttpError(400, "Personal profile missing for this user")
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

      console.log("Next sequence number for custom link:", nextSequence);

      const createdCustomLink = await ProfileCustomLink.create({
        profile_id: personalProfile.id,
        user_profile_id: userProfile.id,
        user_id: userId,
        title,
        url,
        is_visible: true,
        sequence: nextSequence,
        thumbnail: thumbnailPath,
        icon: iconPath,
      });

      console.log("ProfileCustomLink created with ID:", createdCustomLink.id);

      let customLinkCustomization =
        await PersonalCustomLinkCustomization.findOne({
          where: {
            user_profile_id: userProfile.id,
            profile_id: personalProfile.id,
            user_id: userId,
          },
        });

      if (!customLinkCustomization) {
        console.log(
          "No PersonalCustomLinkCustomization found, creating defaults..."
        );

        customLinkCustomization =
          await PersonalCustomLinkCustomization.create({
            user_profile_id: userProfile.id,
            profile_id: personalProfile.id,
            user_id: userId,
            layout: "CAROUSAL",
            background_color: "#ffffff",
            title_color: "#000000",
          });

        console.log(
          "PersonalCustomLinkCustomization created with ID:",
          customLinkCustomization.id
        );
      } else {
        console.log(
          "Existing PersonalCustomLinkCustomization found with ID:",
          customLinkCustomization.id
        );
      }

      return res.status(201).json({
        message: "Custom link created successfully",
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
      console.error("Error in createMyPersonalCustomLink:", err);
      return next(err);
    }
  },

  getMyPersonalCustomLinks: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("getMyPersonalCustomLinks called by userId:", userId);

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

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      console.log("Personal profile type fetched:", personalType?.id);
      if (!personalType) {
        return next(new HttpError(400, "Personal profile type not configured"));
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });
      console.log("UserProfile fetched:", userProfile?.id);
      if (!userProfile) {
        return next(new HttpError(400, "Personal profile not found for this user"));
      }

      const personalProfile = await PersonalProfile.findByPk(userProfile.profile_id);
      console.log("PersonalProfile fetched:", personalProfile?.id);
      if (!personalProfile) {
        return next(new HttpError(400, "Personal profile missing for this user"));
      }

      const customLinks = await ProfileCustomLink.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      // ✅ Add SERVER_URL in icon/thumbnail inline
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

      let customLinkCustomization = await PersonalCustomLinkCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
        },
      });

      if (!customLinkCustomization) {
        customLinkCustomization = await PersonalCustomLinkCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
          layout: "ICONS",
          background_color: "#ffffff",
          title_color: "#000000",
        });
      }

      return res.json({
        message: "Custom links fetched successfully",
        customLinks: customLinksWithServer,
        customLinkCustomization,
      });
    } catch (err) {
      console.error("Error in getMyPersonalCustomLinks:", err);
      return next(err);
    }
  },


  updateMyPersonalCustomLinksSequence: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyPersonalCustomLinksSequence called by userId:",
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
          new HttpError(
            400,
            "Each link entry must include a numeric id"
          )
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

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      if (!personalType) {
        return next(
          new HttpError(400, "Personal profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });
      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found for this user")
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
          "links array must contain exactly all custom link IDs for this personal profile"
        );
        errObj.missing_ids = missingInRequest;
        errObj.unknown_ids = unknownIds;
        return next(errObj);
      }

      const linkMap = new Map(existingLinks.map((l) => [l.id, l]));
      let updates = [];

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
        message: "Custom links updated successfully (order + visibility)",
        customLinks: updatedLinks,
      });
    } catch (err) {
      console.error(
        "Error in updateMyPersonalCustomLinksSequence:",
        err
      );
      return next(err);
    }
  },

  editMyPersonalCustomLink: async (req, res, next) => {
    const userId = req.user?.id;
    const { userProfileId } = req.params;
    const linkId = Number(req.params.linkId);
    console.log(
      "editMyPersonalCustomLink called by userId:",
      userId,
      "for linkId:",
      linkId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    // if (!Number.isInteger(linkId)) {
    //   return next(new HttpError(400, "Invalid custom link id"));
    // }

    const { title, url } = req.body || {};
    console.log("Edit custom link body:", req.body);

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      if (!personalType) {
        return next(
          new HttpError(400, "Personal profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });
      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found for this user")
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
          "Custom link not found or does not belong to userProfile:",
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
      console.log("ProfileCustomLink updated with id:", customLink.id);

      return res.json({
        message: "Custom link updated successfully",
        customLink,
      });
    } catch (err) {
      console.error("Error in editMyPersonalCustomLink:", err);
      return next(err);
    }
  },

  deleteMyPersonalCustomLink: async (req, res, next) => {
    const userId = req.user?.id;
    const { userProfileId } = req.params;
    const linkId = Number(req.params.linkId);

    console.log(
      "deleteMyPersonalCustomLink called by userId:",
      userId,
      "for linkId:",
      linkId
    );

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    // if (!Number.isInteger(linkId)) {
    //   return next(new HttpError(400, "Invalid custom link id"));
    // }

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      if (!personalType) {
        return next(
          new HttpError(400, "Personal profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });
      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found for this user")
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
          "Custom link not found or does not belong to userProfile:",
          {
            linkId,
            userProfileId: userProfile.id,
          }
        );
        return next(new HttpError(404, "Custom link not found"));
      }

      console.log("Deleting ProfileCustomLink with id:", customLink.id);
      await customLink.destroy();

      const remainingLinks = await ProfileCustomLink.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      let updates = [];
      remainingLinks.forEach((l, index) => {
        const newSeq = index + 1;
        if (l.sequence !== newSeq) {
          console.log(
            `Re-sequencing custom link ${l.id} from ${l.sequence} to ${newSeq}`
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
        message: "Custom link deleted successfully",
        customLinks: updatedLinks,
      });
    } catch (err) {
      console.error("Error in deleteMyPersonalCustomLink:", err);
      return next(err);
    }
  },

  updateMyPersonalCustomLinkCustomization: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyPersonalCustomLinkCustomization called by userId:",
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

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      if (!personalType) {
        return next(
          new HttpError(400, "Personal profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });
      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found for this user")
        );
      }

      const personalProfile = await PersonalProfile.findByPk(
        userProfile.profile_id
      );
      if (!personalProfile) {
        return next(
          new HttpError(400, "Personal profile missing for this user")
        );
      }

      let customLinkCustomization =
        await PersonalCustomLinkCustomization.findOne({
          where: {
            user_profile_id: userProfile.id,
            profile_id: personalProfile.id,
            user_id: userId,
          },
        });

      if (!customLinkCustomization) {
        console.log(
          "No PersonalCustomLinkCustomization found; creating default..."
        );
        customLinkCustomization =
          await PersonalCustomLinkCustomization.create({
            user_profile_id: userProfile.id,
            profile_id: personalProfile.id,
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
          "Applying ICONS layout (no additional customization)."
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
        message: "Personal custom link customization updated",
        customization: customLinkCustomization,
      });
    } catch (err) {
      console.error(
        "Error in updateMyPersonalCustomLinkCustomization:",
        err
      );
      return next(err);
    }
  },

  // CONTACT API

  getMyPersonalProfileContact: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "getMyPersonalProfileContact called by userId:",
      userId
    );

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

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      console.log("Personal profile type fetched:", personalType?.id);
      if (!personalType) {
        return next(
          new HttpError(400, "Personal profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });
      console.log("UserProfile fetched:", userProfile?.id);
      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found for this user")
        );
      }

      const personalProfile = await PersonalProfile.findByPk(
        userProfile.profile_id
      );
      console.log("PersonalProfile fetched:", personalProfile?.id);
      if (!personalProfile) {
        return next(
          new HttpError(400, "Personal profile missing for this user")
        );
      }

      let contact = await ProfileContact.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
        },
      });

      if (!contact) {
        console.log(
          "No ProfileContact found, creating default contact + fields..."
        );

        contact = await ProfileContact.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          title: "",
          description: "",
          layout: "COMPACT",
          is_enabled: true,
          button_text: "Connect",
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
        message: "Contact info fetched successfully",
        contact,
        fields,
      });
    } catch (err) {
      console.error("Error in getMyPersonalProfileContact:", err);
      return next(err);
    }
  },

  updateMyPersonalProfileContact: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyPersonalProfileContact called by userId:",
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

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });
      if (!personalType) {
        return next(
          new HttpError(400, "Personal profile type not configured")
        );
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });
      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found for this user")
        );
      }

      const personalProfile = await PersonalProfile.findByPk(
        userProfile.profile_id
      );
      if (!personalProfile) {
        return next(
          new HttpError(400, "Personal profile missing for this user")
        );
      }

      let contact = await ProfileContact.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
        },
      });

      if (!contact) {
        console.log(
          "No ProfileContact found in updateMyPersonalProfileContact, creating default..."
        );
        contact = await ProfileContact.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          title: "",
          description: "",
          layout: "COMPACT",
          is_enabled: true,
          button_text: "Connect",
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

        for (const field of existingFields) {
          if (!seenIds.has(field.id)) {
            await field.destroy();
          }
        }

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
        message: "Contact info updated successfully",
        contact,
        fields: updatedFields,
      });
    } catch (err) {
      console.error("Error in updateMyPersonalProfileContact:", err);
      return next(err);
    }
  },

  toggleMyPersonalProfileContactStatus: async (req, res, next) => {
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
      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });

      if (!personalType) {
        return next(new HttpError(400, "Personal profile type not configured"));
      }

      const userProfile = await UserProfile.findOne({
        where: {
          id: userProfileId,
          user_id: userId,
          profile_type_id: personalType.id,
        },
      });

      if (!userProfile) {
        return next(new HttpError(404, "Personal profile not found for this user"));
      }

      const personalProfile = await PersonalProfile.findByPk(userProfile.profile_id);
      if (!personalProfile) {
        return next(new HttpError(404, "Personal profile missing for this user"));
      }

      let contact = await ProfileContact.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
        },
      });

      if (!contact) {
        // Create default contact if missing
        contact = await ProfileContact.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
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
      console.error("Error in toggleMyPersonalProfileContactStatus:", err);
      return next(err);
    }
  },

  getMyPersonalProfileSaveContact: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "getMyPersonalProfileSaveContact called by userId:",
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

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found")
        );
      }

      const personalProfile = await PersonalProfile.findByPk(
        userProfile.profile_id
      );

      if (!personalProfile) {
        return next(
          new HttpError(400, "Personal profile missing")
        );
      }

      let saveContact = await ProfileSaveContact.findOne({
        where: { profile_id: personalProfile.id },
      });

      if (!saveContact) {
        console.log("Creating default ProfileSaveContact...");

        saveContact = await ProfileSaveContact.create({
          profile_id: personalProfile.id,
          button_text: "Connect",
          button_corner_radius: 10,
          button_bg_color: "#fufufuf",
          button_text_color: "#0000",
        });
      }

      return res.json({
        message: "Save contact styling fetched successfully",
        saveContact,
      });
    } catch (err) {
      console.error("Error in getMyPersonalProfileSaveContact:", err);
      return next(err);
    }
  },

  updateMyPersonalProfileSaveContact: async (req, res, next) => {
    const userId = req.user?.id;
    console.log(
      "updateMyPersonalProfileSaveContact called by userId:",
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
      is_enabled,
    } = req.body || {};

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });

      if (!userProfile) {
        return next(
          new HttpError(400, "Personal profile not found")
        );
      }

      const personalProfile = await PersonalProfile.findByPk(
        userProfile.profile_id
      );

      let saveContact = await ProfileSaveContact.findOne({
        where: { profile_id: personalProfile.id },
      });

      if (!saveContact) {
        saveContact = await ProfileSaveContact.create({
          profile_id: personalProfile.id,
          button_text: "Connect",
          button_corner_radius: 10,
          button_bg_color: null,
          button_text_color: null,
          is_enabled: true,
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

      if (is_enabled !== undefined) {
        saveContact.is_enabled = !!is_enabled;
      }

      await saveContact.save();

      return res.json({
        message: "Save contact styling updated successfully",
        saveContact,
      });
    } catch (err) {
      console.error("Error in updateMyPersonalProfileSaveContact:", err);
      return next(err);
    }
  },

  toggleMyPersonalProfileSaveContactStatus: async (req, res, next) => {
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
      const personalType = await ProfileType.findOne({
        where: { type: "PERSONAL" },
      });

      if (!personalType) {
        return next(new HttpError(400, "Personal profile type not configured"));
      }

      const userProfile = await UserProfile.findOne({
        where: {
          id: userProfileId,
          user_id: userId,
          profile_type_id: personalType.id,
        },
      });

      if (!userProfile) {
        return next(new HttpError(404, "Personal profile not found for this user"));
      }

      const personalProfile = await PersonalProfile.findByPk(userProfile.profile_id);
      if (!personalProfile) {
        return next(new HttpError(404, "Personal profile missing for this user"));
      }

      let saveContact = await ProfileSaveContact.findOne({
        where: { profile_id: personalProfile.id },
      });

      if (!saveContact) {
        saveContact = await ProfileSaveContact.create({
          profile_id: personalProfile.id,
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
      console.error("Error in toggleMyPersonalProfileSaveContactStatus:", err);
      return next(err);
    }
  },

  createMyPersonalProfileMedia: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("createMyPersonalProfileMedia called by userId:", userId);

    if (!userId) return next(new HttpError(401, "Unauthorized"));

    const { userProfileId } = req.params;
    try {
      const user = await User.findByPk(userId);
      if (!user) return next(new HttpError(404, "User not found"));

      const personalType = await ProfileType.findOne({ where: { type: "PERSONAL" } });
      if (!personalType) {
        return next(new HttpError(400, "Personal profile type not configured"));
      }

      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId, profile_type_id: personalType.id },
      });
      if (!userProfile) return next(new HttpError(400, "Personal profile not found"));

      const personalProfile = await PersonalProfile.findByPk(userProfile.profile_id);
      if (!personalProfile) return next(new HttpError(400, "Personal profile missing"));

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

      // adjust path to your storage
      const mediaUrl = `/uploads/media/${file.filename}`;

      const created = await ProfileMedia.create({
        user_profile_id: userProfile.id,
        profile_id: personalProfile.id,
        user_id: userId,
        media_url: mediaUrl,
        sequence: nextSequence,
        is_visible: true,
      });

      // ensure customization exists
      let mediaCustomization = await ProfileMediaCustomization.findOne({
        where: {
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
        },
      });

      if (!mediaCustomization) {
        mediaCustomization = await ProfileMediaCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
          user_id: userId,
          layout: "CAROUSAL",
        });
      }

      // Fetch all media for the user profile
      const media = await ProfileMedia.findAll({
        where: { user_profile_id: userProfile.id },
        order: [["sequence", "ASC"]],
      });

      // Full URL for media

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
      console.error("Error in createMyPersonalProfileMedia:", err);
      return next(err);
    }
  },


  updateMyPersonalProfileMediaSequenceAndLayout: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("updateMyPersonalProfileMediaSequenceAndLayout called:", userId);

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

      const personalType = await ProfileType.findOne({ where: { type: "PERSONAL" } });
      if (!personalType) {
        return next(new HttpError(400, "Personal profile type not configured"));
      }

      let userProfile;
      if (paramUserProfileId) {
        userProfile = await UserProfile.findOne({
          where: { id: paramUserProfileId, user_id: userId, profile_type_id: personalType.id },
        });
      } else {
        // Try to infer profile from the first media ID provided
        if (orderedIds.length > 0) {
          const sampleMedia = await ProfileMedia.findByPk(orderedIds[0]);
          if (sampleMedia) {
            userProfile = await UserProfile.findOne({
              where: { id: sampleMedia.user_profile_id, user_id: userId, profile_type_id: personalType.id },
            });
          }
        }
        
        // Fallback to the first personal profile if still not found
        if (!userProfile) {
          userProfile = await UserProfile.findOne({
            where: { user_id: userId, profile_type_id: personalType.id },
          });
        }
      }

      if (!userProfile) return next(new HttpError(400, "Personal profile not found"));

      const personalProfile = await PersonalProfile.findByPk(userProfile.profile_id);
      if (!personalProfile) return next(new HttpError(400, "Personal profile missing"));

      const existingMedia = await ProfileMedia.findAll({
        where: { user_profile_id: userProfile.id },
      });

      const existingIds = existingMedia.map((m) => m.id);

      const missingInRequest = existingIds.filter((id) => !orderedIds.includes(id));
      const unknownIds = orderedIds.filter((id) => !existingIds.includes(id));

      if (missingInRequest.length > 0 || unknownIds.length > 0) {
        const errObj = new HttpError(
          400,
          "media array must contain exactly all media IDs for the selected personal profile"
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
          profile_id: personalProfile.id,
          user_id: userId,
        },
      });

      if (!mediaCustomization) {
        mediaCustomization = await ProfileMediaCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: personalProfile.id,
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
      console.error("Error in updateMyPersonalProfileMediaSequenceAndLayout:", err);
      return next(err);
    }
  },
  deleteMyPersonalProfileMedia: async (req, res, next) => {
    const userId = req.user?.id;
    const mediaId = Number(req.params.id);

    console.log("deleteMyPersonalProfileMedia called:", { userId, mediaId });

    if (!userId) return next(new HttpError(401, "Unauthorized"));
    if (!Number.isInteger(mediaId)) return next(new HttpError(400, "Invalid media id"));

    try {
      const mediaItem = await ProfileMedia.findByPk(mediaId);
      if (!mediaItem) return next(new HttpError(404, "Media not found"));

      const personalType = await ProfileType.findOne({ where: { type: "PERSONAL" } });
      if (!personalType) {
        return next(new HttpError(400, "Personal profile type not configured"));
      }

      // Verify the media belongs to a personal profile of this user
      const userProfile = await UserProfile.findOne({
        where: { id: mediaItem.user_profile_id, user_id: userId, profile_type_id: personalType.id }
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
      console.error("Error in deleteMyPersonalProfileMedia:", err);
      return next(err);
    }
  },

};

export default PersonalProfileController;
