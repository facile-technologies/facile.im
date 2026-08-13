import { SERVER_URL_NORMALIZED } from "../config/index.js";
import {
  UserProfile,
  PersonalProfile,
  BusinessProfile,
  PetProfile,
  SosProfile,
  ProfileType,
  ProfileCustomization,
  ProfileMedia,
  ProfileMediaCustomization,
  ProfileLink,
  ProfileCustomLink,
  ProfileContact,
  ProfileContactField,
  ProfileContactSubmission,
  ProfileSaveContact,
  PersonalProfileLinkCustomization,
  PersonalCustomLinkCustomization,
  BusinessCustomLinkCustomization,
  BusinessProfileLinkCustomization,
  UserAnalytics,
  UserAnalyticsTotal,
  UserAnalyticsCountryDaily,
  RecentActivities,
  UniqueCode,
  QrCustomization,
  UserPlan,
  User
} from "../models/Association.js";
import Plan from "../models/Plan.model.js";
import { sequelize } from "../database/connectDB.js";
import HttpError from "../middlewares/errors/HttpError.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/index.js";

class UserController {
  /**
   * DELETE /v1/user/profile/:userProfileId
   * Deletes a user profile and all its associated data.
   */
  static deleteUserProfile = async (req, res, next) => {
    const userId = req.user?.id;
    const { userProfileId } = req.params;

    if (!userId) return next(new HttpError(401, "Unauthorized"));

    const transaction = await sequelize.transaction();

    try {
      // 1. Find the UserProfile ensuring it belongs to this user
      const userProfile = await UserProfile.findOne({
        where: { id: userProfileId, user_id: userId },
      });

      if (!userProfile) {
        await transaction.rollback();
        return next(new HttpError(404, "Profile not found or you don't have permission to delete it"));
      }

      const { profile_id, profile_type_id } = userProfile;

      // 2. Identify the profile type
      const profileType = await ProfileType.findByPk(profile_type_id);
      const typeName = profileType?.type || "";

      // 3. Delete related data associated with user_profile_id
      const commonWhere = { user_profile_id: userProfile.id };

      // We need to handle ProfileContact explicitly because it has dependent fields
      const contacts = await ProfileContact.findAll({ where: commonWhere });
      const contactIds = contacts.map(c => c.id);

      await Promise.all([
        // Delete dependent fields first
        ProfileContactField.destroy({ where: { profile_contacts_id: contactIds }, transaction }),

        // Models with user_profile_id
        ProfileCustomization.destroy({ where: commonWhere, transaction }),
        ProfileMedia.destroy({ where: commonWhere, transaction }),
        ProfileMediaCustomization.destroy({ where: commonWhere, transaction }),
        ProfileLink.destroy({ where: commonWhere, transaction }),
        ProfileCustomLink.destroy({ where: commonWhere, transaction }),
        ProfileContact.destroy({ where: commonWhere, transaction }),
        PersonalProfileLinkCustomization.destroy({ where: commonWhere, transaction }),
        PersonalCustomLinkCustomization.destroy({ where: commonWhere, transaction }),
        BusinessProfileLinkCustomization.destroy({ where: commonWhere, transaction }),
        BusinessCustomLinkCustomization.destroy({ where: commonWhere, transaction }),
        UserAnalytics.destroy({ where: commonWhere, transaction }),
        UserAnalyticsTotal.destroy({ where: commonWhere, transaction }),
        UserAnalyticsCountryDaily.destroy({ where: commonWhere, transaction }),
        RecentActivities.destroy({ where: commonWhere, transaction }),
        QrCustomization.destroy({ where: commonWhere, transaction }),

        // Polymorphic models often using profile_id (Business/Personal ID)
        ProfileContactSubmission.destroy({ where: { profile_id }, transaction }),
        ProfileSaveContact.destroy({ where: { profile_id }, transaction }),
      ]);

      // 4. Update UniqueCode (untie the device from this profile)
      await UniqueCode.update(
        { user_profile_id: null },
        { where: { user_profile_id: userProfile.id }, transaction }
      );

      // 5. Delete specific profile data (PersonalProfile, BusinessProfile, etc.)
      if (typeName === "PERSONAL") {
        await PersonalProfile.destroy({ where: { id: profile_id }, transaction });
      } else if (typeName === "BUSINESS" || typeName === "STORE_FRONT") {
        // Both often use BusinessProfile model
        await BusinessProfile.destroy({ where: { id: profile_id }, transaction });
      } else if (typeName === "PET") {
        // Handle Pet specific cleanup if models exist
        // ...
      } else if (typeName === "SOS") {
        // Handle SOS specific cleanup if models exist
        // ...
      }

      // 6. Delete the UserProfile itself
      await userProfile.destroy({ transaction });

      await transaction.commit();

      return res.status(200).json({
        success: true,
        message: "Profile and all associated data deleted successfully",
      });

    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting user profile:", error);
      return next(error);
    }
  };

  static getUserProfiles = async (req, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ status: "error", message: "Unauthorized" });
      }

      const context = req.query.context || "facile";
      const isRescue = context === "rescue";

      const userProfiles = await UserProfile.findAll({
        where: { user_id: userId },
      });

      const formattedProfiles = [];

      for (const up of userProfiles) {
        const typeName = up.profile_type_name ? up.profile_type_name.toLowerCase() : "";

        const isFacileType = typeName.includes("personal") || typeName.includes("business") || typeName.includes("storefront");
        const isRescueType = typeName.includes("pet") || typeName.includes("sos");

        // Skip if doesn't match the requested context
        if (isRescue && !isRescueType) continue;
        if (!isRescue && !isFacileType) continue;

        let profileData = null;
        let profileType = "Unknown";
        let profileName = "Unknown";

        if (typeName.includes("personal")) {
          profileData = await PersonalProfile.findByPk(up.profile_id);
          profileType = "Personal";
          if (profileData) {
            profileName = `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() || profileData.username || "Personal Profile";
          }
        } else if (typeName.includes("business")) {
          profileData = await BusinessProfile.findByPk(up.profile_id);
          profileType = "Business";
          if (profileData) {
            profileName = profileData.business_name || profileData.username || "Business Profile";
          }
        } else if (typeName.includes("storefront")) {
          profileData = await BusinessProfile.findByPk(up.profile_id);
          profileType = "Storefront";
          if (profileData) {
            profileName = profileData.business_name || profileData.username || "Storefront Profile";
          }
        } else if (typeName.includes("pet")) {
          profileData = await PetProfile.findByPk(up.profile_id);
          profileType = "Pet";
          if (profileData) {
            profileName = profileData.pet_name || "Pet Profile";
          }
        } else if (typeName.includes("sos")) {
          profileData = await SosProfile.findByPk(up.profile_id);
          profileType = "SOS";
          if (profileData) {
            profileName = `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() || "SOS Profile";
          }
        }

        if (profileData) {
          let imageUrl = null;
          if (profileData.profile_image) {
            imageUrl = profileData.profile_image.startsWith("http")
              ? profileData.profile_image
              : `${SERVER_URL_NORMALIZED}${profileData.profile_image.startsWith("/") ? "" : "/"}${profileData.profile_image}`;
          }

          formattedProfiles.push({
            id: up.id,
            type: profileType,
            name: profileName,
            image_url: imageUrl,
            profile_id: up.profile_id,
          });
        }
      }

      return res.status(200).json({
        status: "success",
        data: formattedProfiles,
      });

    } catch (error) {
      console.error("Error fetching user profiles:", error);
      return next(error);
    }
  };

  static getAllPlans = async (req, res, next) => {
    try {
      const plans = await Plan.findAll({
        order: [["price", "ASC"]],
      });

      let activePlanId = null;

      try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
          const userId = decoded.sub || decoded.id || decoded.userId || decoded.user_id;

          if (userId) {
            const activeUserPlan = await UserPlan.findOne({
              where: { user_id: userId, status: "ACTIVE" },
              order: [["createdAt", "DESC"]]
            });
            if (activeUserPlan) {
              activePlanId = activeUserPlan.plan_id;
            } else {
              const user = await User.findByPk(userId);
              if (user && user.plan_id) {
                activePlanId = user.plan_id;
              }
            }
          }
        }
      } catch (err) {
        // Ignore token errors to allow public access to plans
      }

      return res.status(200).json({
        status: "success",
        data: plans,
        current_plan_id: activePlanId
      });
    } catch (error) {
      console.error("Error fetching plans:", error);
      return next(error);
    }
  };
}

export default UserController;
