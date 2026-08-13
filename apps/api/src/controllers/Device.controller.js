import { Op } from "sequelize";
import joiValidation from "../utils/joiValidation.js";
import CustomErrorHandler from "../middlewares/errors/customErrorHandler.js";
import HttpError from "../middlewares/errors/HttpError.js";
import { UniqueCode, UserProfile, ProfileType, User, Team, TeamMember, Otp, PersonalProfile, BusinessProfile, PetProfile, SosProfile } from "../models/Association.js";
import DeviceService from "../constants/devices.js";
import { SERVER_URL_NORMALIZED } from "../config/index.js";

class DeviceController {
  static activateDevice = async (req, res, next) => {
    try {
      const { error } = joiValidation.activateDeviceValidation(req.body);

      if (error) {
        return next(error);
      }

      const { code, user_profile_id } = req.body;

      // 1. Find the NFC code
      const nfc = await UniqueCode.findOne({ where: { code } });

      if (!nfc) {
        return next(new HttpError(404, "Product code is invalid"));
      }

      // 2. Security Check: Already Mapped
      if (nfc.user_profile_id || nfc.user_id) {
        return next(new HttpError(409, "This product has been already activated with another profile."));
      }

      // 3. Security Check: Deactivated status
      if (nfc.status === "DEACTIVATED") {
        return next(new HttpError(403, "This product is deactivated and cannot be used"));
      }

      // 4. Find Profile and derive userId from it
      const profile = await UserProfile.findOne({
        where: { id: user_profile_id },
        include: [
          {
            model: ProfileType,
            attributes: ["type"],
          },
        ],
      });

      if (!profile) {
        return next(new HttpError(404, "Profile not found"));
      }

      const userId = profile.user_id;

      // 5. Type Compatibility Check
      const devices = DeviceService.getDevices();
      const deviceConfig = devices.find((d) => d.id === nfc.device_type);

      if (!deviceConfig) {
        return next(new HttpError(500, "Device configuration error"));
      }

      const profileTypeName = profile.ProfileType?.type;

      if (profileTypeName !== deviceConfig.profile_type) {
        return next(
          new HttpError(
            400,
            `Incompatible profile type. This product requires a ${deviceConfig.profile_type} profile.`
          )
        );
      }

      // 6. Activation
      nfc.user_id = userId;
      nfc.user_profile_id = user_profile_id;
      nfc.status = "ACTIVATED";
      nfc.activation_date = new Date();
      nfc.updated_by = userId;

      await nfc.save();

      // STATUS UPDATE: Mark activation code as COMPLETED
      try {
        await Otp.update(
          { status: "COMPLETED", is_used: true },
          {
            where: {
              user_id: userId,
              otp_type: "ACTIVATION_CODE",
              status: "SCANNED",
              is_used: false,
            },
          }
        );
      } catch (otpError) {
        console.error("Failed to update OTP status after activation:", otpError);
      }

      return res.status(200).json({
        success: true,
        message: "Product activated successfully",
        data: {
          code: nfc.code,
          device_name: nfc.device_name,
          profile_type: profileTypeName,
        },
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static unlinkDevice = async (req, res, next) => {
    try {
      const { error } = joiValidation.unlinkDeviceValidation(req.body);
      if (error) {
        return next(error);
      }

      const { code } = req.body;
      const userId = req.userId;

      // 1. Find the NFC code
      const nfc = await UniqueCode.findOne({ where: { code, user_id: userId } });

      if (!nfc) {
        return next(new HttpError(404, "Product code not found or not linked to your account"));
      }

      // 2. State Transition
      nfc.user_id = null;
      nfc.user_profile_id = null;
      nfc.status = "UNASSIGNED";
      nfc.activation_date = null;
      nfc.updated_by = userId;

      await nfc.save();

      return res.status(200).json({
        success: true,
        message: "Product unlinked successfully",
        data: {
          code: nfc.code,
        },
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static getUserDevices = async (req, res, next) => {
    try {
      const userId = req.userId;
      const context = req.query.context || "facile";
      const isRescue = context === "rescue";

      // Build a set of device_type IDs allowed for this context, based on DeviceService config
      const allDeviceConfigs = DeviceService.getDevices();
      const rescueProfileTypes = new Set(["PET", "SOS"]);
      const allowedDeviceTypes = allDeviceConfigs
        .filter((d) => isRescue ? rescueProfileTypes.has(d.profile_type) : !rescueProfileTypes.has(d.profile_type))
        .map((d) => d.id);

      const { view, search, member_id } = req.query;

      // 1. Get the authenticated user info
      const user = await User.findByPk(userId);
      if (!user) {
        return next(new HttpError(404, "User not found"));
      }

      let targetUserIds = [userId];

      // 2. Handle Team View
      if (view === "team" && user.is_team_owner) {
        const team = await Team.findOne({ where: { user_id: userId } });
        if (!team) {
          return next(new HttpError(404, "Team not found"));
        }

        // Get all accepted team members
        const members = await TeamMember.findAll({
          where: {
            team_id: team.id,
            invitation_status: "ACCEPTED",
            user_id: { [Op.ne]: null },
          },
          attributes: ["user_id"],
        });

        targetUserIds = [userId, ...members.map((m) => m.user_id)];

        if (member_id) {
          const mid = parseInt(member_id);
          if (targetUserIds.includes(mid)) {
            targetUserIds = [mid];
          } else {
            return res.status(200).json({ success: true, data: [] });
          }
        }
        if (search) {
          const matchingUsers = await User.findAll({
            where: {
              id: targetUserIds,
              full_name: { [Op.like]: `%${search}%` },
            },
            attributes: ["id"],
          });
          targetUserIds = matchingUsers.map((u) => u.id);
        }
      }

      const devices = await UniqueCode.findAll({
        where: {
          user_id: targetUserIds,
          device_type: { [Op.in]: allowedDeviceTypes },
        },
        include: [
          {
            model: UserProfile,
            as: "activatedProfile",
            include: [
              {
                model: ProfileType,
                attributes: ["type", "name"],
              },
            ],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "full_name", "avatar_url", "email"],
          },
        ],
      });

      const deviceConfigs = DeviceService.getDevices();

      const formattedDevices = devices.map((d) => {
        const config = deviceConfigs.find((conf) => conf.id === d.device_type);
        return {
          id: d.id,
          code: d.code,
          device_type: d.device_type,
          device_name: d.device_name || config?.title || "Facile Device",
          image: config?.image || "default_device.jpg",
          status: d.status,
          one_share_active: d.one_share_active,
          one_share_url: d.one_share_url,
          user: {
            id: d.user?.id,
            full_name: d.user?.full_name,
            avatar: d.user?.avatar_url
              ? d.user.avatar_url.startsWith("http")
                ? d.user.avatar_url
                : `${SERVER_URL_NORMALIZED}${d.user.avatar_url}`
              : null,
            email: d.user?.email,
          },
          profile: d.activatedProfile
            ? {
              id: d.activatedProfile.id,
              profile_type: d.activatedProfile.ProfileType?.type,
              profile_name: d.activatedProfile.ProfileType?.name,
            }
            : null,
        };
      });

      return res.status(200).json({
        success: true,
        data: formattedDevices,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static setupOneShare = async (req, res, next) => {
    try {
      const { error } = joiValidation.setupOneShareValidation(req.body);
      if (error) {
        return next(error);
      }

      const { code, one_share_active, one_share_url } = req.body;
      const userId = req.userId;

      const nfc = await UniqueCode.findOne({
        where: { code, user_id: userId },
      });

      if (!nfc) {
        return next(new HttpError(404, "Product code not found or not linked to your account"));
      }

      nfc.one_share_active = one_share_active;
      nfc.one_share_url = one_share_active ? one_share_url : null;
      nfc.updated_by = userId;

      await nfc.save();

      return res.status(200).json({
        success: true,
        message: one_share_active ? "One Share enabled successfully" : "One Share disabled successfully",
        data: {
          code: nfc.code,
          one_share_active: nfc.one_share_active,
          one_share_url: nfc.one_share_url,
        },
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static generateActivationCode = async (req, res, next) => {
    try {
      const userId = req.userId;

      // Generate 7-character alphanumeric code
      const code = Math.random().toString(36).substring(2, 9).toUpperCase();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Invalidate previous active codes for this user
      await Otp.update(
        { is_used: true },
        {
          where: {
            user_id: userId,
            otp_type: "ACTIVATION_CODE",
            is_used: false,
          },
        }
      );

      await Otp.create({
        user_id: userId,
        otp: code,
        otp_type: "ACTIVATION_CODE",
        expires_at: expiresAt,
      });

      return res.status(200).json({
        success: true,
        code: code,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static getProfilesByCode = async (req, res, next) => {
    try {
      const { code } = req.params;

      if (!code) {
        return next(new HttpError(400, "Activation code is required"));
      }

      // 1. Find and validate the code
      const otpRecord = await Otp.findOne({
        where: {
          otp: code,
          otp_type: "ACTIVATION_CODE",
          is_used: false,
        },
      });

      if (!otpRecord) {
        return next(new HttpError(404, "Invalid or expired activation code"));
      }

      // 2. Check expiration
      if (new Date() > new Date(otpRecord.expires_at)) {
        return next(new HttpError(403, "Activation code has expired"));
      }

      // 3. Update status to SCANNED if it was PENDING
      if (otpRecord.status === "PENDING") {
        otpRecord.status = "SCANNED";
        await otpRecord.save();
      }

      // 4. Fetch user and determine target users
      const user = await User.findByPk(otpRecord.user_id, {
        attributes: ["id", "full_name", "is_team_owner"],
      });

      if (!user) {
        return next(new HttpError(404, "User associated with this code not found"));
      }

      let targetUserIds = [user.id];

      // 5. If Team Owner, include member IDs
      if (user.is_team_owner) {
        const team = await Team.findOne({ where: { user_id: user.id } });
        if (team) {
          const members = await TeamMember.findAll({
            where: {
              team_id: team.id,
              invitation_status: "ACCEPTED",
              user_id: { [Op.ne]: null },
            },
            attributes: ["user_id"],
          });
          targetUserIds = [...targetUserIds, ...members.map((m) => m.user_id)];
        }
      }

      // 6. Fetch profiles for all target users
      const profiles = await UserProfile.findAll({
        where: { user_id: targetUserIds },
        include: [
          {
            model: ProfileType,
            attributes: ["id", "type", "name"],
          },
          {
            model: User,
            attributes: ["id", "full_name", "email", "avatar_url"],
          },
        ],
        order: [["id", "DESC"]],
      });

      // Fetch actual profile images for each UserProfile
      const profileImageMap = new Map();
      const typeGroups = { PERSONAL: [], BUSINESS: [], STORE_FRONT: [], PET: [], SOS: [] };
      for (const p of profiles) {
        const t = p.ProfileType?.type;
        if (t && typeGroups[t]) typeGroups[t].push(p.profile_id);
      }

      // STORE_FRONT has no profile_image column — only fetch for types that have it
      const modelMap = {
        PERSONAL: PersonalProfile,
        BUSINESS: BusinessProfile,
        PET: PetProfile,
        SOS: SosProfile,
      };

      await Promise.all(
        Object.entries(modelMap).map(async ([type, model]) => {
          const ids = typeGroups[type];
          if (!ids || !ids.length) return;
          const rows = await model.findAll({
            where: { id: ids },
            attributes: ["id", "profile_image"],
          });
          for (const row of rows) {
            const raw = row.profile_image;
            profileImageMap.set(`${type}_${row.id}`, raw
              ? raw.startsWith("http")
                ? raw
                : `${SERVER_URL_NORMALIZED}${raw.startsWith("/") ? "" : "/"}${raw}`
              : null
            );
          }
        })
      );

      const formattedProfiles = profiles.map((p) => ({
        id: p.id,
        profile_name: p.ProfileType?.name,
        profile_type: p.ProfileType?.type,
        profile_image: profileImageMap.get(`${p.ProfileType?.type}_${p.profile_id}`) ?? null,
        user: {
          id: p.User?.id,
          full_name: p.User?.full_name,
          email: p.User?.email,
          avatar: p.User?.avatar_url
            ? p.User.avatar_url.startsWith("http")
              ? p.User.avatar_url
              : `${SERVER_URL_NORMALIZED}${p.User.avatar_url}`
            : null,
        },
        created_at: p.createdAt,
      }));

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          full_name: user.full_name,
        },
        profiles: formattedProfiles,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static checkCodeStatus = async (req, res, next) => {
    try {
      const { code } = req.params;
      const otpRecord = await Otp.findOne({
        where: {
          otp: code,
          otp_type: "ACTIVATION_CODE",
        },
      });

      if (!otpRecord) {
        return next(new HttpError(404, "Activation code not found"));
      }

      let currentStatus = otpRecord.status;

      // Check for expiration dynamically
      if (!otpRecord.is_used && new Date() > new Date(otpRecord.expires_at)) {
        currentStatus = "EXPIRED";
      }

      return res.status(200).json({
        success: true,
        status: currentStatus,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };
}

export default DeviceController;
