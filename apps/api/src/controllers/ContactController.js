// src/controllers/ContactController.js

import ProfileContactSubmission from "../models/ProfileContactSubmission.model.js";
import UserProfile from "../models/UserProfile.model.js";
import ProfileType from "../models/ProfileType.model.js";
import Team from "../models/Team.model.js";
import TeamMember from "../models/TeamMember.model.js";
import User from "../models/User.model.js";
import HttpError from "../middlewares/errors/HttpError.js";
import { Op } from "sequelize";

const ContactController = {
  getContacts: async (req, res, next) => {
    try {
      const { context, profile_id } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const userId = req.user?.id;

      if (!userId) {
        return next(new HttpError(401, "Unauthorized"));
      }

      const whereProfile = {};

      if (context === "facile") {
        whereProfile.user_id = userId;
      } else if (context === "facile-teams") {
        const team = await Team.findOne({ where: { user_id: userId } });
        if (!team) {
          return next(new HttpError(404, "You do not own a team."));
        }

        whereProfile.team_id = team.id;

        const { member_id } = req.query;
        if (member_id) {
          const teamMember = await TeamMember.findOne({
            where: { id: member_id, team_id: team.id }
          });
          
          if (!teamMember) {
            return next(new HttpError(404, "Team member not found."));
          }

          let targetUserId = teamMember.user_id;
          if (!targetUserId && teamMember.email) {
            const userByEmail = await User.findOne({ where: { email: teamMember.email } });
            if (userByEmail) {
              targetUserId = userByEmail.id;
            }
          }

          if (!targetUserId) {
             return res.status(200).json({
               status: "success",
               data: [],
               pagination: { total: 0, page, limit, totalPages: 0 }
             });
          }
          whereProfile.user_id = targetUserId;
        }
      } else {
        return next(new HttpError(400, "Invalid context. Expected 'facile' or 'facile-teams'"));
      }
      
      // 2. If profile_id is provided, filter for that specific profile
      // Note: Since profile_id is ambiguous without type, we filter user's own profiles by this ID first.
      if (profile_id) {
        whereProfile.profile_id = profile_id;
      }

      const userProfiles = await UserProfile.findAll({
        where: whereProfile,
        include: [{ model: ProfileType }],
      });

      if (userProfiles.length === 0) {
        return res.status(200).json({
          status: "success",
          data: [],
        });
      }

      // 3. Get all profile_ids for these user profiles
      const profileIds = userProfiles.map(up => up.profile_id);

      // 4. Find all submissions for these profile IDs with pagination
      const { count, rows: submissions } = await ProfileContactSubmission.findAndCountAll({
        where: {
          profile_id: { [Op.in]: profileIds }
        },
        limit,
        offset,
        order: [["id", "DESC"]] // Using id for descending as timestamps=false in model
      });

      // 5. Build enriched response
      const enrichedData = submissions.map(sub => {
        // Find the corresponding UserProfile by profile_id
        const up = userProfiles.find(p => p.profile_id === sub.profile_id);
        return {
          ...sub.toJSON(),
          profile_type: up?.ProfileType?.name || up?.profile_type_name || "Unknown"
        };
      });

      return res.status(200).json({
        status: "success",
        data: enrichedData,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        }
      });

    } catch (err) {
      console.error("Error in getContacts:", err);
      return next(err);
    }
  },
};

export default ContactController;
