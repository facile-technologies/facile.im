import { Op } from "sequelize";
import {
  User,
  UserProfile,
  PersonalProfile,
  BusinessProfile,
  PetProfile,
  SosProfile,
  StorefrontProfile,
  UniqueCode,
  ProfileContactSubmission,
  Team,
  TeamMember,
  Plan,
  UserPlan,
  Product,
  ProductFile,
} from "../models/Association.js";
import DeviceService from "../constants/devices.js";
import { SERVER_URL_NORMALIZED } from "../config/index.js";

class DashboardController {
  static getDashboardData = async (req, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const context = req.query.context || "facile";
      const isRescue = context === "rescue";

      // Profile type name filters based on context
      const profileTypeFilter = isRescue
        ? { [Op.or]: [{ profile_type_name: { [Op.like]: "%pet%" } }, { profile_type_name: { [Op.like]: "%sos%" } }] }
        : { [Op.and]: [{ profile_type_name: { [Op.notLike]: "%pet%" } }, { profile_type_name: { [Op.notLike]: "%sos%" } }] };

      // 1. Fetch Profiles Data
      const userProfiles = await UserProfile.findAll({
        where: { user_id: userId, ...profileTypeFilter },
        limit: 10,
      });

      const totalProfilesCount = await UserProfile.count({
        where: { user_id: userId, ...profileTypeFilter },
      });

      // Get up to 3 preview avatars
      const previewAvatars = [];
      for (const up of userProfiles.slice(0, 3)) {
        let profile;
        if (up.profile_type_name.toLowerCase().includes("personal")) {
          profile = await PersonalProfile.findByPk(up.profile_id);
        } else if (up.profile_type_name.toLowerCase().includes("business")) {
          profile = await BusinessProfile.findByPk(up.profile_id);
        } else if (up.profile_type_name.toLowerCase().includes("pet")) {
          profile = await PetProfile.findByPk(up.profile_id);
        } else if (up.profile_type_name.toLowerCase().includes("sos")) {
          profile = await SosProfile.findByPk(up.profile_id);
        }

        if (profile && profile.profile_image) {
          const avatarUrl = profile.profile_image.startsWith("http")
            ? profile.profile_image
            : `${SERVER_URL_NORMALIZED}${profile.profile_image.startsWith("/") ? "" : "/"}${profile.profile_image}`;
          previewAvatars.push(avatarUrl);
        }
      }

      // 2. Fetch Devices
      const devices = await UniqueCode.findAll({
        where: { user_id: userId },
        include: [
          {
            model: UserProfile,
            as: "activatedProfile",
          },
        ],
      });

      const deviceConfigs = DeviceService.getDevices();
      const formattedDevices = devices.map((d) => {
        const config = deviceConfigs.find((conf) => conf.id === d.device_type);
        return {
          id: d.id,
          name: d.device_name || config?.title || "Facile Device",
          type: d.device_type || "unknown",
          status: d.status || "Linked",
          image_url: config?.image
            ? `${SERVER_URL_NORMALIZED}/public/devices/${config.image}`
            : null,
        };
      });

      // 3. Fetch Contacts (Shared information)
      // Logic: Find all profiles owned by user, then find submissions for those profiles
      const profileIds = userProfiles.map(up => up.profile_id); // polymorphic profile_id in submissions
      const contactSubmissions = await ProfileContactSubmission.findAll({
        where: { profile_id: { [Op.in]: profileIds } },
        limit: 10,
        order: [["id", "DESC"]]
      });

      const formattedContacts = contactSubmissions.map(cs => {
        const data = cs.submitted_data || {};
        const nameStr = data.name || data["Full Name"] || data.full_name || data.Name;
        const displayName = nameStr ? nameStr : "Someone";
        return {
          id: cs.id,
          name: displayName,
          email: data.email || data.Email || "No Email",
          status_text: `${displayName} shared his information with you`,
          avatar: data.avatar || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        };
      });

      // 4. Fetch Team Data
      let teamData = [];
      const user = await User.findByPk(userId);
      if (user && user.is_team_owner) {
        const team = await Team.findOne({ where: { user_id: userId } });
        if (team) {
          const members = await TeamMember.findAll({
            where: { team_id: team.id },
            limit: 10
          });
          teamData = members.map(m => ({
            id: m.id,
            name: m.full_name,
            email: m.email,
            status: m.invitation_status || "Active",
            avatar: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" // Default for now
          }));
        }
      }

      // 5. Products
      const rawProducts = await Product.findAll({
        where: { user_id: userId },
        include: [{ model: ProductFile, as: "files" }],
        order: [["created_at", "DESC"]],
        limit: 10,
      });

      const products = rawProducts.map((p) => {
        const pj = p.toJSON();
        pj.image_url = pj.image_url
          ? pj.image_url.startsWith("http")
            ? pj.image_url
            : `${SERVER_URL_NORMALIZED}${pj.image_url.startsWith("/") ? "" : "/"}${pj.image_url}`
          : null;
        if (pj.files) {
          pj.files = pj.files.map((f) => ({
            ...f,
            url: f.type === "FILE"
              ? f.url.startsWith("http") ? f.url : `${SERVER_URL_NORMALIZED}${f.url.startsWith("/") ? "" : "/"}${f.url}`
              : f.url,
            image_url: f.image_url
              ? f.image_url.startsWith("http") ? f.image_url : `${SERVER_URL_NORMALIZED}${f.image_url.startsWith("/") ? "" : "/"}${f.image_url}`
              : null,
          }));
        }
        return pj;
      });

      // 6. Dummy Analytics
      const dummyAnalytics = {
        chart_data: [

        ]
      };

      let userPlanData = { name: "free", features: [] };

      const activeUserPlan = await UserPlan.findOne({
        where: {
          user_id: userId,
          end_date: {
            [Op.gt]: new Date()
          }
        },
        include: [{ model: Plan, as: "plan" }],
        order: [["end_date", "DESC"]]
      });

      if (activeUserPlan && activeUserPlan.plan) {
        userPlanData = {
          name: activeUserPlan.plan.title,
          features: activeUserPlan.plan.features || [],
          status: activeUserPlan.status,
          start_date: activeUserPlan.start_date,
          end_date: activeUserPlan.end_date
        };
      } else if (user.plan_id != null) {
        const fallbackPlan = await Plan.findByPk(user.plan_id);
        if (fallbackPlan) {
          userPlanData = {
            name: fallbackPlan.title,
            features: fallbackPlan.features || []
          };
        }
      }

      return res.status(200).json({
        status: "success",
        data: {
          profiles: {
            total_count: totalProfilesCount,
            preview_avatars: previewAvatars
          },
          products: products,
          analytics: dummyAnalytics,
          devices: formattedDevices,
          contacts: formattedContacts,
          team: teamData,
          userPlan: userPlanData
        }
      });

    } catch (error) {
      console.error("Dashboard API Error:", error);
      return next(error);
    }
  };
}

export default DashboardController;
