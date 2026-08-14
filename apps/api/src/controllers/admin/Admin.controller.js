import joiValidation from "../../utils/joiValidation.js";
import generateJwtTokens from "../../utils/generateJwtTokens.js";
import { issueRefreshToken, setRefreshCookie } from "../../utils/refreshTokens.js";
import CustomErrorHandler from "../../middlewares/errors/customErrorHandler.js";
import HttpError from "../../middlewares/errors/HttpError.js";
import UserModel from "../../models/User.model.js"
import bcrypt from "bcrypt";
import DeviceService from "../../constants/devices.js";
import HelperMethods from "../../utils/helper.js";
import UniqueCode from "../../models/UniqueCode.model.js";
import PlanModel from "../../models/Plan.model.js";
import PersonalProfileModel from "../../models/PersonalProfile.model.js";
import UserProfileModel from "../../models/UserProfile.model.js";
import ProfileTypeModel from "../../models/ProfileType.model.js";
import PlatformLinkModel from "../../models/PlatformLink.model.js";
import TeamModel from "../../models/Team.model.js";
import TeamMemberModel from "../../models/TeamMember.model.js";

import { Op, fn, col, literal } from "sequelize";
import { sequelize } from "../../database/connectDB.js";

import { SERVER_URL, SERVER_URL_NORMALIZED } from "../../config/index.js";

class AdminController {

  static login = async (req, res, next) => {
    try {
      const { error } = joiValidation.logInBodyValidation(req.body);

      if (error) {
        return next(error);
      }

      const { email, password } = req.body;

      const user = await UserModel.findOne({ where: { email } });

      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      if (user.role !== "ADMIN") {
        return next(new HttpError(403, "Access denied. Admins only."));
      }

      // compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // token
      const accessToken = await generateJwtTokens(user);

      // Mint + persist a refresh token (new family) and set the httpOnly cookie.
      // Admin shares the same /v1/user/refresh + /v1/user/logout endpoints.
      const { rawToken: refreshToken } = await issueRefreshToken({
        userId: user.id,
      });
      setRefreshCookie(res, refreshToken);

      const userPlain = user.toJSON();

      // Map avatar_url to a usable profile_pic URL
      let profile_pic;
      if (userPlain.avatar_url) {
        profile_pic = `${SERVER_URL ? SERVER_URL : ""
          }/public/profile_pic/${userPlain.avatar_url}`;
      } else {
        profile_pic =
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
      }

      const full_name =
        `${userPlain.first_name || ""} ${userPlain.last_name || ""}`.trim() ||
        "";

      const userData = {
        _id: userPlain.id,
        email: userPlain.email,
        full_name,
        username: userPlain.username,
        profile_pic,
      };

      res.status(200).json({
        status: true,
        message: "User logged in successfully.",
        data: {
          user: userData,
          access_token: accessToken,
        },
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static getDevices = async (req, res) => {
    const devices = DeviceService.getDevices();

    return res.status(200).json({
      status: true,
      message: "Devices fetched successfully",
      data: devices,
    });
  };

  static generateCodes = async (req, res, next) => {
    try {
      const { device_type, quantity, brand } = req.body;

      if (!device_type || !quantity) {
        return next(new HttpError(400, "device_type and quantity are required"));
      }

      if (!Number.isInteger(quantity) || quantity <= 0 || quantity > 1000) {
        return next(new HttpError(400, "Quantity must be between 1 and 1000"));
      }

      const devices = DeviceService.getDevices();
      const device = devices.find(d => d.id === device_type);

      if (!device) {
        return next(new HttpError(400, "Invalid device type"));
      }

      const createdCodes = [];
      const MAX_RETRIES_PER_CODE = 10;

      // Cosmetic descriptor base for the printed URL, e.g. "facile-sos-band-black".
      // Color is already baked into device.title for SKU variants ("SOS Band - Black").
      const slugBase = HelperMethods.slugify(`${brand || "facile"} ${device.title}`);

      while (createdCodes.length < quantity) {
        let created = false;
        let retries = 0;

        while (!created) {
          if (retries >= MAX_RETRIES_PER_CODE) {
            throw new Error("Failed to generate unique NFC codes");
          }

          retries++;
          const code = HelperMethods.generateNfcCode(10);
          // Zero-padded per-batch serial: facile-sos-band-black-0001
          const serial = String(createdCodes.length + 1).padStart(4, "0");
          const slug = `${slugBase}-${serial}`;

          try {
            await UniqueCode.create({
              code,
              device_type,
              device_name: device.title,
              brand: brand || null,
              status: "PRODUCED",
              created_by: req.user.id,
            });

            createdCodes.push({ code, slug });
            created = true;
          } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
              continue; // retry silently
            }
            throw error;
          }
        }
      }

      const csvUrl = HelperMethods.exportNfcCsv({
        codes: createdCodes,
        device,
        status: "PRODUCED",
      });

      return res.status(201).json({
        status: true,
        message: "NFC codes generated and exported successfully",
        data: {
          device_type: device.id,
          profile_type: device.profile_type,
          quantity: createdCodes.length,
          csv_url: csvUrl,
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  static updateNfc = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { action, username } = req.body;

      if (!action) {
        return next(new HttpError(400, "Action is required"));
      }

      const nfc = await UniqueCode.findByPk(id);

      if (!nfc) {
        return next(new HttpError(404, "NFC code not found"));
      }

      let resolvedUserId = null;

      if (["MAP", "REASSIGN"].includes(action)) {
        if (!username) {
          return next(new HttpError(400, "username is required"));
        }

        const user = await UserModel.findOne({
          where: { username },
          attributes: ["id"],
        });

        if (!user) {
          return next(new HttpError(404, "User not found"));
        }

        resolvedUserId = user.id;
      }

      switch (action) {
        case "MAP":
          nfc.user_id = resolvedUserId;
          nfc.status = "ASSIGNED";
          break;

        case "REASSIGN":
          nfc.user_id = resolvedUserId;
          nfc.status = "ASSIGNED";
          break;

        case "UNMAP":
          nfc.user_id = null;
          nfc.status = "UNASSIGNED";
          break;
        case "PRODUCED":
          nfc.user_id = null;
          nfc.status = "PRODUCED";
          break;

        case "ASSIGNED":
          nfc.status = "ASSIGNED";
          break;

        case "DEACTIVATE":
          nfc.status = "DEACTIVATED";
          break;

        default:
          return next(new HttpError(400, "Invalid action"));
      }

      nfc.updated_by = req.user.id;
      await nfc.save();

      return res.status(200).json({
        status: true,
        message: "NFC updated successfully",
        data: {
          id: nfc.id,
          code: nfc.code,
          status: nfc.status,
          user_id: nfc.user_id,
        },
      });
    } catch (error) {
      return next(error);
    }
  };


  static getNfcCodes = async (req, res, next) => {
    try {
      const {
        tab,
        search,
        status,
        page = 1,
        limit = 20,
      } = req.query;

      const where = {};

      switch (tab) {
        case "produced":
          where.status = "PRODUCED";
          where.user_id = null;
          break;
        case "unmapped":
          where.status = "UNASSIGNED";
          where.user_id = null;
          break;

        case "mapped":
          where.user_id = { [Op.ne]: null };
          where.status = "ASSIGNED";
          break;

        case "deactivated":
          where.status = "DEACTIVATED";
          break;

        default:
          // apply status filter ONLY if tab is not provided
          if (status === "active") {
            where.status = "ACTIVATED";
          } else if (status === "inactive") {
            where.status = { [Op.ne]: "ACTIVATED" };
          }
          break;
      }

      if (search) {
        where[Op.or] = [
          { code: { [Op.like]: `%${search}%` } },
          { device_name: { [Op.like]: `%${search}%` } },
          { "$user.username$": { [Op.like]: `%${search}%` } },
          { "$user.email$": { [Op.like]: `%${search}%` } },
        ];
      }

      // 🔹 Pagination
      const safePage = Math.max(1, Number(page));
      const safeLimit = Math.min(100, Math.max(1, Number(limit)));
      const offset = (safePage - 1) * safeLimit;

      const { rows, count } = await UniqueCode.findAndCountAll({
        where,
        distinct: true,
        include: [
          {
            model: UserModel,
            as: "user",
            required: false,
            attributes: ["id", "username", "email"],
          },
        ],
        order: [["id", "DESC"]],
        limit: safeLimit,
        offset,
        raw: false,
        subQuery: false,
      });

      // Convert to plain JSON to avoid circular references
      const plainRows = rows.map(row => {
        const plainRow = row.toJSON();
        return {
          id: plainRow.id,
          code: plainRow.code,
          device_type: plainRow.device_type,
          device_name: plainRow.device_name,
          brand: plainRow.brand,
          status: plainRow.status,
          activation_date: plainRow.activation_date,
          user_id: plainRow.user_id,
          user: plainRow.user ? {
            id: plainRow.user.id,
            username: plainRow.user.username,
            email: plainRow.user.email,
          } : null,
          created_at: plainRow.createdAt,
          updated_at: plainRow.updatedAt,
        };
      });

      return res.status(200).json({
        status: true,
        message: "NFC codes fetched successfully",
        data: {
          list: plainRows,
          pagination: {
            total: count,
            page: safePage,
            limit: safeLimit,
            total_pages: Math.ceil(count / safeLimit),
          },
        },
      });
    } catch (error) {
      return next(error);
    }
  };

  static getUsers = async (req, res, next) => {
    try {
      const { page = 1, limit = 20, search } = req.query;

      const where = {
        role: { [Op.ne]: "ADMIN" },
      };

      if (search) {
        where[Op.or] = [
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
        ];
      }

      const safePage = Math.max(1, Number(page));
      const safeLimit = Math.min(100, Math.max(1, Number(limit)));
      const offset = (safePage - 1) * safeLimit;

      // 1️⃣ Get total
      const total = await UserModel.count({ where });

      // 2️⃣ Fetch users only
      const users = await UserModel.findAll({
        where,
        include: [
          {
            model: PlanModel,
            attributes: ["id", "title", "price", "duration"],
            required: false,
          },
          {
            model: PersonalProfileModel,
            attributes: ["profile_image"],
            required: false,
          },
        ],
        attributes: [
          "id",
          "username",
          "email",
          "phone_no",
          "first_name",
          "last_name",
          "role",
          "created_at",
        ],
        order: [["id", "DESC"]],
        limit: safeLimit,
        offset,
      });

      const userIds = users.map(u => u.id);

      // 3️⃣ Device count
      const deviceCounts = await UniqueCode.findAll({
        attributes: [
          "user_id",
          [fn("COUNT", col("id")), "count"],
        ],
        where: {
          user_id: userIds,
          status: "ASSIGNED",
        },
        group: ["user_id"],
      });

      const deviceCountMap = {};
      deviceCounts.forEach(d => {
        deviceCountMap[d.user_id] = Number(d.dataValues.count);
      });

      // 4️⃣ Devices list
      const devices = await UniqueCode.findAll({
        where: {
          user_id: userIds,
          status: "ASSIGNED",
        },
        attributes: ["id", "code", "device_name", "user_id"],
      });

      const deviceMap = {};
      devices.forEach(device => {
        if (!deviceMap[device.user_id]) {
          deviceMap[device.user_id] = [];
        }

        deviceMap[device.user_id].push({
          id: device.id,
          code: device.code,
          device_name: device.device_name,
        });
      });

      // 5️⃣ Profile counts
      const profileCounts = await UserProfileModel.findAll({
        attributes: [
          "user_id",
          [fn("SUM", literal("ProfileType.type = 'PERSONAL'")), "personal"],
          [fn("SUM", literal("ProfileType.type = 'BUSINESS'")), "business"],
          [fn("SUM", literal("ProfileType.type = 'PET'")), "pet"],
          [fn("SUM", literal("ProfileType.type = 'SOS'")), "sos"],
          [fn("SUM", literal("ProfileType.type = 'STORE_FRONT'")), "store_front"],
        ],
        include: [
          {
            model: ProfileTypeModel,
            attributes: [],
            required: true,
          },
        ],
        where: {
          user_id: userIds,
        },
        group: ["user_id"],
      });


      const profileMap = {};
      profileCounts.forEach(p => {
        profileMap[p.user_id] = {
          personal: Number(p.dataValues.personal) || 0,
          business: Number(p.dataValues.business) || 0,
          pet: Number(p.dataValues.pet) || 0,
          sos: Number(p.dataValues.sos) || 0,
          store_front: Number(p.dataValues.store_front) || 0,
        };
      });

      // 6️⃣ Final merge
      const finalUsers = users.map(user => {
        const u = user.toJSON();

        const personalProfile =
          u.PersonalProfiles?.length > 0
            ? u.PersonalProfiles[0]
            : null;

        const profileImage = personalProfile?.profile_image
          ? `${SERVER_URL_NORMALIZED}${personalProfile.profile_image.startsWith("/") ? "" : "/"
          }${personalProfile.profile_image}`
          : null;

        const profiles = profileMap[u.id] || {};

        return {
          id: u.id,
          username: u.username,
          email: u.email,
          phone_no: u.phone_no,
          full_name: `${u.first_name || ""} ${u.last_name || ""}`.trim(),
          role: u.role,
          created_at: u.created_at,
          profile_image: profileImage,

          mapped_device_count: deviceCountMap[u.id] || 0,
          devices: deviceMap[u.id] || [],

          personal_profile_count: profiles.personal || 0,
          business_profile_count: profiles.business || 0,
          pet_profile_count: profiles.pet || 0,
          sos_profile_count: profiles.sos || 0,
          store_front_profile_count: profiles.store_front || 0,

          plan: u.Plan
            ? {
              id: u.Plan.id,
              title: u.Plan.title,
              price: u.Plan.price,
              duration: u.Plan.duration,
            }
            : null,
        };
      });

      return res.status(200).json({
        status: true,
        message: "Users fetched successfully",
        data: {
          list: finalUsers,
          pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            total_pages: Math.ceil(total / safeLimit),
          },
        },
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };



  static createPlan = async (req, res, next) => {
    try {
      const { title, features, description, price, duration } = req.body;

      if (!title || !features || !description || !price || !duration) {
        return next(new HttpError(400, "All fields are required"));
      }

      if (!Array.isArray(features)) {
        return next(new HttpError(400, "Features must be an array"));
      }

      const plan = await PlanModel.create({
        title,
        features,
        description,
        price,
        duration,
      });

      return res.status(201).json({
        status: true,
        message: "Plan created successfully",
        data: plan,
      });
    } catch (error) {
      return next(error);
    }
  };

  static getPlans = async (req, res, next) => {
    try {
      const plans = await PlanModel.findAll({
        order: [["id", "ASC"]],
      });

      return res.status(200).json({
        status: true,
        message: "Plans fetched successfully",
        data: plans,
      });
    } catch (error) {
      return next(error);
    }
  };

  static updatePlan = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { title, features, description, price, duration } = req.body;

      const plan = await PlanModel.findByPk(id);

      if (!plan) {
        return next(new HttpError(404, "Plan not found"));
      }

      if (features && !Array.isArray(features)) {
        return next(new HttpError(400, "Features must be an array"));
      }

      plan.title = title ?? plan.title;
      plan.features = features ?? plan.features;
      plan.description = description ?? plan.description;
      plan.price = price ?? plan.price;
      plan.duration = duration ?? plan.duration;

      await plan.save();

      return res.status(200).json({
        status: true,
        message: "Plan updated successfully",
        data: plan,
      });
    } catch (error) {
      return next(error);
    }
  };

  static deletePlan = async (req, res, next) => {
    try {
      const { id } = req.params;

      const plan = await PlanModel.findByPk(id);

      if (!plan) {
        return next(new HttpError(404, "Plan not found"));
      }

      const usersUsingPlan = await UserModel.count({
        where: { plan_id: id },
      });

      if (usersUsingPlan > 0) {
        return next(
          new HttpError(
            400,
            "Cannot delete plan. Users are currently subscribed to this plan."
          )
        );
      }

      await plan.destroy();

      return res.status(200).json({
        status: true,
        message: "Plan deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  };


  static createPlatform = async (req, res, next) => {
    try {
      const {
        name,
        type,
        start_link,
        default_icon,
        black_icon,
        stroked_icon,
        colored_icon,
        white_icon,
      } = req.body;

      if (!name || !type || !start_link) {
        return next(new HttpError(400, "name, type and start_link are required"));
      }

      const platform = await PlatformLinkModel.create({
        name,
        type,
        start_link,
        default_icon,
        black_icon,
        stroked_icon,
        colored_icon,
        white_icon,
      });

      return res.status(201).json({
        status: true,
        message: "Platform created successfully",
        data: platform,
      });
    } catch (error) {
      return next(error);
    }
  };


  static getPlatforms = async (req, res, next) => {
    try {
      const { page = 1, limit = 20, search } = req.query;

      const safePage = Math.max(1, Number(page));
      const safeLimit = Math.min(100, Math.max(1, Number(limit)));
      const offset = (safePage - 1) * safeLimit;

      const where = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { type: { [Op.like]: `%${search}%` } },
        ];
      }

      const { rows, count } = await PlatformLinkModel.findAndCountAll({
        where,
        order: [["id", "DESC"]],
        limit: safeLimit,
        offset,
      });

      return res.status(200).json({
        status: true,
        message: "Platforms fetched successfully",
        data: {
          list: rows,
          pagination: {
            total: count,
            page: safePage,
            limit: safeLimit,
            total_pages: Math.ceil(count / safeLimit),
          },
        },
      });
    } catch (error) {
      return next(error);
    }
  };


  static getPlatformById = async (req, res, next) => {
    try {
      const { id } = req.params;

      const platform = await PlatformLinkModel.findByPk(id);

      if (!platform) {
        return next(new HttpError(404, "Platform not found"));
      }

      return res.status(200).json({
        status: true,
        message: "Platform fetched successfully",
        data: platform,
      });
    } catch (error) {
      return next(error);
    }
  };


  static updatePlatform = async (req, res, next) => {
    try {
      const { id } = req.params;

      const platform = await PlatformLinkModel.findByPk(id);

      if (!platform) {
        return next(new HttpError(404, "Platform not found"));
      }

      await platform.update(req.body);

      return res.status(200).json({
        status: true,
        message: "Platform updated successfully",
        data: platform,
      });
    } catch (error) {
      return next(error);
    }
  };

  static deletePlatform = async (req, res, next) => {
    try {
      const { id } = req.params;

      const platform = await PlatformLinkModel.findByPk(id);

      if (!platform) {
        return next(new HttpError(404, "Platform not found"));
      }

      await platform.destroy();

      return res.status(200).json({
        status: true,
        message: "Platform deleted successfully",
      });
    } catch (error) {
      return next(error);
    }
  };


  static getDashboardStats = async (req, res, next) => {
    try {
      const { range = "6months" } = req.query;
      const now = new Date();

      // =====================================================
      // 1️⃣ BASIC TOTAL STATS
      // =====================================================

      const totalCustomers = await UserModel.count({
        where: { role: { [Op.ne]: "ADMIN" } },
      });

      const totalNfcChips = await UniqueCode.count();

      const chipsMapped = await UniqueCode.count({
        where: { status: "ASSIGNED" },
      });

      const inactiveChips = await UniqueCode.count({
        where: { status: "DEACTIVATED" },
      });

      // =====================================================
      // 2️⃣ TREND CALCULATION (Last 30 days vs previous 30)
      // =====================================================

      const currentStart = new Date();
      currentStart.setDate(currentStart.getDate() - 30);

      const previousStart = new Date();
      previousStart.setDate(previousStart.getDate() - 60);

      const currentUsers = await UserModel.count({
        where: {
          role: { [Op.ne]: "ADMIN" },
          created_at: { [Op.gte]: currentStart },
        },
      });

      const previousUsers = await UserModel.count({
        where: {
          role: { [Op.ne]: "ADMIN" },
          created_at: {
            [Op.between]: [previousStart, currentStart],
          },
        },
      });

      const calculateTrend = (current, previous) => {
        if (previous === 0) {
          return { trend: "up", trend_value: 100 };
        }

        const diff = ((current - previous) / previous) * 100;

        return {
          trend: diff >= 0 ? "up" : "down",
          trend_value: Math.abs(Number(diff.toFixed(1))),
        };
      };

      const userTrend = calculateTrend(currentUsers, previousUsers);

      // =====================================================
      // 3️⃣ GROWTH METRICS (Dynamic Range)
      // =====================================================

      let startDate;
      let groupFormat;
      let labels = [];

      if (range === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        groupFormat = "%Y-%m-%d";

        const days = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        ).getDate();

        for (let i = 1; i <= days; i++) {
          labels.push(
            `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`
          );
        }
      }

      else if (range === "year") {
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);
        groupFormat = "%Y-%m";

        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          labels.push(
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
          );
        }
      }

      else {
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        groupFormat = "%Y-%m";

        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          labels.push(
            `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
          );
        }
      }

      const usersGrowth = await UserModel.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("created_at"), groupFormat), "period"],
          [fn("COUNT", col("id")), "count"],
        ],
        where: {
          role: { [Op.ne]: "ADMIN" },
          created_at: { [Op.gte]: startDate },
        },
        group: ["period"],
        raw: true,
      });

      const devicesGrowth = await UniqueCode.findAll({
        attributes: [
          [fn("DATE_FORMAT", col("created_at"), groupFormat), "period"],
          [fn("COUNT", col("id")), "count"],
        ],
        where: {
          created_at: { [Op.gte]: startDate },
        },
        group: ["period"],
        raw: true,
      });

      const growthMetrics = labels.map(label => {
        const user = usersGrowth.find(u => u.period === label);
        const device = devicesGrowth.find(d => d.period === label);

        return {
          name: range === "month"
            ? label.split("-")[2]
            : label.split("-")[1],
          users: user ? Number(user.count) : 0,
          devices: device ? Number(device.count) : 0,
        };
      });

      // =====================================================
      // 4️⃣ PROFILE DISTRIBUTION
      // =====================================================

      const profileDistribution = await UserProfileModel.findAll({
        attributes: [
          [col("ProfileType.type"), "name"],
          [fn("COUNT", col("UserProfile.id")), "value"],
        ],
        include: [
          {
            model: ProfileTypeModel,
            attributes: [],
          },
        ],
        group: ["ProfileType.type"],
        raw: true,
      });

      const colorMap = {
        PERSONAL: "#6366f1",
        BUSINESS: "#ec4899",
        STORE_FRONT: "#f59e0b",
        SOS: "#ef4444",
        PET: "#10b981",
      };

      const formattedProfiles = profileDistribution.map(p => ({
        name: p.name,
        value: Number(p.value),
        color: colorMap[p.name] || "#999",
      }));

      // =====================================================
      // 5️⃣ FINAL RESPONSE
      // =====================================================

      return res.status(200).json({
        status: "success",
        data: {
          stats: {
            total_customers: {
              value: totalCustomers,
              ...userTrend,
            },
            total_nfc_chips: {
              value: totalNfcChips,
              ...userTrend,
            },
            chips_mapped: {
              value: chipsMapped,
              ...userTrend,
            },
            inactive_chips: {
              value: inactiveChips,
              ...userTrend,
            },
          },
          growth_metrics: growthMetrics,
          profile_distribution: formattedProfiles,
          recent_transactions: [
            {
              id: "TXN-FC-1892",
              user_name: "User_12",
              subscription_plan: "Enterprise Pro",
              amount: 49.99,
              status: "completed",
              created_at: new Date().toISOString(),
            },
          ],
        },
      });

    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  static getTeams = async (req, res, next) => {
    try {
      const { page = 1, limit = 20, search } = req.query;

      const safePage = Math.max(1, Number(page));
      const safeLimit = Math.min(100, Math.max(1, Number(limit)));
      const offset = (safePage - 1) * safeLimit;

      const where = {};
      if (search) {
        where[Op.or] = [
          { team_name: { [Op.like]: `%${search}%` } },
          { "$user.full_name$": { [Op.like]: `%${search}%` } },
        ];
      }

      const { rows: teams, count: total } = await TeamModel.findAndCountAll({
        where,
        include: [
          {
            model: UserModel,
            as: "user",
            attributes: ["id", "full_name", "email", "avatar_url", "created_at"],
          },
          {
            model: TeamMemberModel,
            as: "members",
            include: [
              {
                model: UserModel,
                as: "user",
                attributes: ["id", "avatar_url"],
              },
            ],
          },
        ],
        order: [["id", "DESC"]],
        limit: safeLimit,
        offset,
        distinct: true,
      });

      // =====================================================
      // 1️⃣ BULK ANALYTICS FETCHING
      // =====================================================
      const allUserIds = new Set();
      teams.forEach((t) => {
        if (t.user_id) allUserIds.add(t.user_id);
        t.members?.forEach((m) => {
          if (m.user_id) allUserIds.add(m.user_id);
        });
      });

      const userIdsArr = Array.from(allUserIds);
      const analytics = {
        deviceCounts: {},
        profileCounts: {},
      };

      if (userIdsArr.length > 0) {
        // Fetch Device Counts
        const dCounts = await UniqueCode.findAll({
          attributes: ["user_id", [fn("COUNT", col("id")), "count"]],
          where: { user_id: userIdsArr, status: "ASSIGNED" },
          group: ["user_id"],
        });
        dCounts.forEach((d) => (analytics.deviceCounts[d.user_id] = Number(d.dataValues.count)));

        // Fetch Profile Distribution
        const pCounts = await UserProfileModel.findAll({
          attributes: [
            "user_id",
            [fn("SUM", literal("ProfileType.type = 'PERSONAL'")), "personal"],
            [fn("SUM", literal("ProfileType.type = 'BUSINESS'")), "business"],
            [fn("SUM", literal("ProfileType.type = 'PET'")), "pet"],
            [fn("SUM", literal("ProfileType.type = 'SOS'")), "sos"],
            [fn("SUM", literal("ProfileType.type = 'STORE_FRONT'")), "store_front"],
          ],
          include: [{ model: ProfileTypeModel, attributes: [], required: true }],
          where: { user_id: userIdsArr },
          group: ["user_id"],
        });

        pCounts.forEach((p) => {
          analytics.profileCounts[p.user_id] = {
            personal: Number(p.dataValues.personal) || 0,
            business: Number(p.dataValues.business) || 0,
            pet: Number(p.dataValues.pet) || 0,
            sos: Number(p.dataValues.sos) || 0,
            store_front: Number(p.dataValues.store_front) || 0,
            total: (Number(p.dataValues.personal) || 0) + (Number(p.dataValues.business) || 0) + (Number(p.dataValues.pet) || 0) + (Number(p.dataValues.sos) || 0) + (Number(p.dataValues.store_front) || 0),
          };
        });
      }

      // =====================================================
      // 2️⃣ FORMATTING
      // =====================================================
      const formattedTeams = teams.map((team) => {
        const t = team.toJSON();

        const formatUserAnalytics = (uid) => ({
          mapped_device_count: analytics.deviceCounts[uid] || 0,
          profile_counts: analytics.profileCounts[uid] || {
            personal: 0, business: 0, pet: 0, sos: 0, store_front: 0, total: 0
          },
        });

        return {
          id: t.id,
          team_name: t.team_name,
          team_description: t.team_description,
          total_members: t.members?.length || 0,
          created_at: t.user.created_at,
          owner: t.user ? {
            id: t.user.id,
            full_name: t.user.full_name,
            email: t.user.email,
            avatar: t.user.avatar_url ? `${SERVER_URL_NORMALIZED}/${t.user.avatar_url.replace(/^\//, "")}` : null,
            ...formatUserAnalytics(t.user.id),
          } : null,
          members: t.members?.map((m) => ({
            id: m.id,
            user_id: m.user_id,
            full_name: m.full_name,
            email: m.email,
            status: m.invitation_status,
            avatar: m.user?.avatar_url ? `${SERVER_URL_NORMALIZED}/${m.user.avatar_url.replace(/^\//, "")}` : null,
            ...(m.user_id ? formatUserAnalytics(m.user_id) : {
              mapped_device_count: 0,
              profile_counts: { personal: 0, business: 0, pet: 0, sos: 0, store_front: 0, total: 0 }
            }),
          })) || [],
        };
      });

      return res.status(200).json({
        success: true,
        message: "Teams fetched successfully",
        data: {
          list: formattedTeams,
          pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            total_pages: Math.ceil(total / safeLimit),
          },
        },
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };
}

export default AdminController;


