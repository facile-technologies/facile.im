import { Op } from "sequelize";
import joiValidation from "../utils/joiValidation.js";
import CustomErrorHandler from "../middlewares/errors/customErrorHandler.js";
import HttpError from "../middlewares/errors/HttpError.js";
import { UniqueCode, UserProfile, ProfileType, User, Team, TeamMember, Otp, PersonalProfile, BusinessProfile, PetProfile, SosProfile } from "../models/Association.js";
import DeviceService from "../constants/devices.js";
import { SERVER_URL_NORMALIZED } from "../config/index.js";

class DeviceController {
  // Shared validation + bind used by BOTH activation entry points:
  //  - activateDevice (anonymous, owner proven by an ACTIVATION_CODE Otp)
  //  - claimDevice    (authenticated self-serve, owner = the logged-in user)
  // `ownerUserId` is the identity the chosen profile is authorized against;
  // `performedBy` is recorded in updated_by. Throws HttpError on any failure so
  // callers' existing try/catch -> next(error) handles it uniformly.
  static _bindCodeToProfile = async ({ code, user_profile_id, ownerUserId, performedBy }) => {
    // 1. Find the NFC code
    const nfc = await UniqueCode.findOne({ where: { code } });
    if (!nfc) {
      throw new HttpError(404, "Product code is invalid");
    }

    // 2. Already mapped
    if (nfc.user_profile_id || nfc.user_id) {
      throw new HttpError(409, "This product has been already activated with another profile.");
    }

    // 3. Deactivated
    if (nfc.status === "DEACTIVATED") {
      throw new HttpError(403, "This product is deactivated and cannot be used");
    }

    // 4. Find profile
    const profile = await UserProfile.findOne({
      where: { id: user_profile_id },
      include: [{ model: ProfileType, attributes: ["type"] }],
    });
    if (!profile) {
      throw new HttpError(404, "Profile not found");
    }

    // 4b. SECURITY (Row 9 / IDOR): the chosen profile must be one the owner is
    // entitled to activate — the owner themselves, plus (if a team owner) their
    // accepted team members. Authorize against that set, never a raw body value.
    const owner = await User.findByPk(ownerUserId, { attributes: ["id", "is_team_owner"] });
    let allowedUserIds = [ownerUserId];
    if (owner?.is_team_owner) {
      const team = await Team.findOne({ where: { user_id: ownerUserId } });
      if (team) {
        const members = await TeamMember.findAll({
          where: {
            team_id: team.id,
            invitation_status: "ACCEPTED",
            user_id: { [Op.ne]: null },
          },
          attributes: ["user_id"],
        });
        allowedUserIds = [...allowedUserIds, ...members.map((m) => m.user_id)];
      }
    }
    if (!allowedUserIds.includes(profile.user_id)) {
      throw new HttpError(403, "This profile is not available to activate");
    }

    // 5. Type compatibility
    const devices = DeviceService.getDevices();
    const deviceConfig = devices.find((d) => d.id === nfc.device_type);
    if (!deviceConfig) {
      throw new HttpError(500, "Device configuration error");
    }
    const profileTypeName = profile.ProfileType?.type;
    if (profileTypeName !== deviceConfig.profile_type) {
      throw new HttpError(
        400,
        `Incompatible profile type. This product requires a ${deviceConfig.profile_type} profile.`
      );
    }

    // 6. Bind the card to the profile's ACTUAL owner (for a team owner activating
    // a member's profile, that's the member). `updated_by` records who did it.
    nfc.user_id = profile.user_id;
    nfc.user_profile_id = user_profile_id;
    nfc.status = "ACTIVATED";
    nfc.activation_date = new Date();
    nfc.updated_by = performedBy;
    await nfc.save();

    return { nfc, profileTypeName };
  };

  static activateDevice = async (req, res, next) => {
    try {
      const { error } = joiValidation.activateDeviceValidation(req.body);

      if (error) {
        return next(error);
      }

      const { code, user_profile_id, activation_code } = req.body;

      // 0. SECURITY (Row 9 / IDOR): the owner MUST be derived from the
      // activation code, never from the posted profile. The activation flow is
      // deliberately anonymous (the phone need not be logged in), so possession
      // of a valid, unused, non-expired ACTIVATION_CODE Otp is what proves the
      // caller is acting on behalf of that owner. Same lookup shape as
      // getProfilesByCode.
      const otpRecord = await Otp.findOne({
        where: {
          otp: activation_code,
          otp_type: "ACTIVATION_CODE",
          is_used: false,
        },
      });

      if (!otpRecord) {
        return next(new HttpError(403, "Invalid or already used activation code"));
      }

      if (otpRecord.status === "COMPLETED") {
        return next(new HttpError(403, "This activation code has already been used"));
      }

      if (new Date() > new Date(otpRecord.expires_at)) {
        return next(new HttpError(403, "Activation code has expired"));
      }

      // Owner identity travels in the activation code, NOT in the request body.
      const userId = otpRecord.user_id;

      // Steps 1–6 (find code, security checks, ownership, type-compat, bind) are
      // shared with the authenticated claim flow. Owner = the code owner.
      const { nfc, profileTypeName } = await DeviceController._bindCodeToProfile({
        code,
        user_profile_id,
        ownerUserId: userId,
        performedBy: userId,
      });

      // STATUS UPDATE: Mark the specific activation code used for this bind as
      // COMPLETED so it can't be replayed and so the desktop poller advances.
      try {
        otpRecord.status = "COMPLETED";
        otpRecord.is_used = true;
        await otpRecord.save();
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
            // Row 16: minimize disclosure on this public endpoint. The picker
            // only renders a display name + avatar, so we do NOT select email
            // or any other owner PII.
            attributes: ["id", "full_name", "avatar_url"],
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

      // Row 16: minimize disclosure on this public endpoint. Only reveal the
      // live status of a still-relevant (non-expired) activation OTP. Any
      // expired / historic / superseded code collapses to "EXPIRED", so the
      // endpoint can't be used to mine the real state (PENDING/SCANNED/
      // COMPLETED) of arbitrary old codes via enumeration. The legit desktop
      // poller only reads a freshly generated code within its 15-min window,
      // so it still observes PENDING -> SCANNED -> COMPLETED normally.
      const isExpired = new Date() > new Date(otpRecord.expires_at);
      const currentStatus = isExpired ? "EXPIRED" : otpRecord.status;

      return res.status(200).json({
        success: true,
        status: currentStatus,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  // PUBLIC. Resolve a scanned card code so the self-serve setup page can branch:
  // ACTIVATED -> send the visitor to the live profile; anything else -> onboarding.
  // Uses `code` (the trusted DB key); the URL slug is cosmetic and never consulted.
  static scanCode = async (req, res, next) => {
    try {
      const { code } = req.params;
      if (!code) {
        return next(new HttpError(400, "Code is required"));
      }

      const nfc = await UniqueCode.findOne({ where: { code } });
      if (!nfc) {
        return next(new HttpError(404, "Product code not found"));
      }

      const deviceConfig = DeviceService.getDevices().find((d) => d.id === nfc.device_type);
      const profileType = deviceConfig?.profile_type ?? null;
      const activated = nfc.status === "ACTIVATED" && !!nfc.user_profile_id;

      return res.status(200).json({
        success: true,
        activated,
        status: nfc.status,
        device_type: nfc.device_type,
        device_name: nfc.device_name || deviceConfig?.title || "Facile Device",
        profile_type: profileType,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  // AUTHENTICATED self-serve bind. The logged-in user (JWT -> req.userId) links a
  // scanned card to one of their own profiles. Owner is the token, so no OTP is
  // needed — this is the tail of the scan-to-onboard flow. Reuses the same
  // validation as activateDevice via the shared _bindCodeToProfile helper.
  static claimDevice = async (req, res, next) => {
    try {
      const { error } = joiValidation.claimDeviceValidation(req.body);
      if (error) {
        return next(error);
      }

      const { code, user_profile_id } = req.body;
      const userId = req.userId;

      const { nfc, profileTypeName } = await DeviceController._bindCodeToProfile({
        code,
        user_profile_id,
        ownerUserId: userId,
        performedBy: userId,
      });

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
}

export default DeviceController;
