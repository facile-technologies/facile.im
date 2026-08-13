import { Op } from "sequelize";
import { FRONTEND_URL, SERVER_URL_NORMALIZED } from "../../config/index.js";
import TeamModel from "../../models/Team.model.js";
import TeamMemberModel from "../../models/TeamMember.model.js";
import UserModel from "../../models/User.model.js";
import UserAnalyticsTotalModel from "../../models/UserAnalyticsTotal.model.js";
import EmailMethods from "../../utils/email.js";
import JoiValidation from "../../utils/joiValidation.js";
import { sequelize } from "../../database/connectDB.js";
import HttpError from "../../middlewares/errors/HttpError.js";
import ProfileType from "../../models/ProfileType.model.js";
import UserProfile from "../../models/UserProfile.model.js";
import BusinessProfile from "../../models/BusinessProfile.model.js";
import ProfileCustomization from "../../models/ProfileCustomization.model.js";
import ProfileLink from "../../models/ProfileLink.model.js";
import BusinessProfileLinkCustomization from "../../models/BusinessProfileLinkCustomization.model.js";
import ProfileCustomLink from "../../models/ProfileCustomLink.model.js";
import BusinessCustomLinkCustomization from "../../models/BusinessCustomLinkCustomization.model.js";
import ProfileMedia from "../../models/ProfileMedia.model.js";
import ProfileMediaCustomization from "../../models/ProfileMediaCustomization.model.js";
import ProfileContact from "../../models/ProfileContact.model.js";
import ProfileContactField from "../../models/ProfileContactField.model.js";
import ProfileSaveContact from "../../models/ProfileSaveContact.model.js";
import PlatformLink from "../../models/PlatformLink.model.js";
import PersonalProfile from "../../models/PersonalProfile.model.js";
import PersonalProfileLinkCustomization from "../../models/PersonalProfileLinkCustomization.model.js";
import PersonalCustomLinkCustomization from "../../models/PersonalCustomLinkCustomization.model.js";
import TemplateModel from "../../models/Template.model.js";

const TeamController = {
  createTeam: async (req, res, next) => {
    try {
        debugger
      const userId = req.user?.id;
      if (!userId) {
        return next(new HttpError(401, "Unauthorized"));
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Required fields are missing.",
        });
      }

      // validation
      const { error } = JoiValidation.createTeamValidation(req.body);

      if (error) {
        return next(error);
      }

      const { team_name, team_description } = req.body;

      // 2️⃣ Check if user already has a team
      const existingTeam = await TeamModel.findOne({
        where: { user_id: userId },
      });

      if (existingTeam) {
        return res.status(409).json({
          success: false,
          message: "User already has a team",
        });
      }

      // 3️⃣ Create team
      const team = await TeamModel.create({
        user_id: userId,
        team_name,
        team_description,
      });


    let user = await UserModel.findByPk(userId);

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found",
  });
}

await user.update({ is_team_owner: true });

    
      return res.status(201).json({
        success: true,
        message: "Team created successfully",
        data: team,
      });
    } catch (error) {
      console.log("Error creating team:", error);
      return next(error);
    }
  },



  getUserTeam: async (req, res, next) => {
  try {
    debugger
    const userId = req.user?.id;

   

    if (!userId ) {
      return next(new HttpError(401, "Unauthorized"));
    }

    


    // find team of this user
    const team = await TeamModel.findOne({
      where: { user_id: userId },
    });

    if (!team) {
      return next(new HttpError(404, "Team does not exists for this user"));
    }

    

    return res.status(201).json({
      success: true,
      message: "User team fetched successfully",
      data: team,
    });
  } catch (error) {
    console.log("Error fetching user team:", error);
    return next(error);
  }
},

addTeamMembers: async (req, res, next) => {
  try {
    debugger
    const userId = req.user?.id;

    const userEmail = req.user?.email?.toLowerCase(); // 👈 get logged-in user email

    if (!userId || !userEmail) {
      return next(new HttpError(401, "Unauthorized"));
    }


    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Required fields are missing.",
        });
      }
   
    // Joi validation
    const { error } = JoiValidation.addMembersValidation(req.body);
    if (error) {
      return next(error);
    }


    

    const { members } = req.body;

    // find team of this user
    const team = await TeamModel.findOne({
      where: { user_id: userId },
    });

    if (!team) {
      return next(new HttpError(404, "Team not found"));
    }

    const emails = members.map((m) => m.email.toLowerCase());


    // 🚫 Prevent adding yourself
    if (emails.includes(userEmail)) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself as a team member",
      });
    }

    // 🔍 check already existing team members
    const existingMembers = await TeamMemberModel.findAll({
      where: {
        email: emails,
        team_id: team.id,
      },
    });

    if (existingMembers.length > 0) {
      const existingEmail = existingMembers[0].email;
      return res.status(409).json({
        success: false,
        message: `This email is already a team member: ${existingEmail}`,
      });
    }


    // 🔍 check already existing team members
    const existingAnotherTeamMembers = await TeamMemberModel.findAll({
      where: {
        email: emails,
      },
    });

    if (existingAnotherTeamMembers.length > 0) {
      const existingEmail = existingMembers[0].email;
      return res.status(409).json({
        success: false,
        message: `This email ${existingEmail} is being used by a team member of another team `,
      });
    }


    // create team members
    const createdMembers = await TeamMemberModel.bulkCreate(
      members.map((m) => ({
        team_id: team.id,
        user_id: null, // if invited user not registered yet
        full_name: m.full_name,
        email: m.email.toLowerCase(),
        status: "INVITED",
      })),
      { returning: true }
    );

    // 🔍 find which emails already exist in user table
    const platformUsers = await UserModel.findAll({
      where: {
        email: emails,
      },
    });

    const platformUserEmails = platformUsers.map((u) =>
      u.email.toLowerCase()
    );

    // 📧 send invitation emails
    for (const member of createdMembers) {
      let inviteLink;

      if (platformUserEmails.includes(member.email)) {
        // already platform user → login link
        inviteLink = `${FRONTEND_URL}/login?invite=true&member_id=${member.id}`;
      } else {
        // new user → signup with member id
        inviteLink = `${FRONTEND_URL}/signup?member_id=${member.id}`;
      }

      EmailMethods.sendEmail(
        member.email,
        "Team Invitation",
        inviteLink,
        member.full_name
      );
    }

    return res.status(201).json({
      success: true,
      message: "Team members added and invitations sent",
      data: createdMembers,
    });
  } catch (error) {
    console.log("Error adding team members:", error);
    return next(error);
  }
},


getTeamMemberById: async (req, res, next) => {
  try {
    debugger
    // const userId = req.user?.id;

    // if (!userId) {
    //   return next(new HttpError(401, "Unauthorized"));
    // }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Team member id is required",
      });
    }

    

    // 🔍 find team member by id AND team_id (security check)
    // const member = await TeamMemberModel.findByPk(id, attributes: ["id", "full_name", "email"]), // 👈 selected fields);

    const member = await TeamMemberModel.findByPk(id, {
  attributes: ["id", "full_name", "email","team_id","invitation_status"], // 👈 selected fields
});

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }


    // 🔍 find team of this user
    

    if (member.invitation_status !== "INVITED") {
      return next(new HttpError(404, "Team member not invited"));
    }


    // 🔍 find team of this user
    const team = await TeamModel.findByPk(member.team_id);

    if (!team) {
      return next(new HttpError(404, "Team not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Team member fetched successfully",
      data: member,
    });

  } catch (error) {
    console.log("Error fetching team member:", error);
    return next(error);
  }
},



deleteTeamMember: async (req, res, next) => {
  try {
    debugger
    const userId = req.user?.id;

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Team member id is required",
      });
    }

    

    // 🔍 find team member by id AND team_id (security check)
    // const member = await TeamMemberModel.findByPk(id, attributes: ["id", "full_name", "email"]), // 👈 selected fields);

    const member = await TeamMemberModel.findByPk(id, {
  attributes: ["id", "full_name", "email","team_id","invitation_status"], // 👈 selected fields
});

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
    }


    // 🔍 find team of this user
    

    // if (member.invitation_status !== "INVITED") {
    //   return next(new HttpError(404, "Team member not invited"));
    // }


    // 🔍 find team of this user
    const team = await TeamModel.findByPk(member.team_id);

    if (!team) {
      return next(new HttpError(404, "Team not found"));
    }



     if (member.team_id === team.id) {
      // Delete the team member
      await member.destroy(); // or TeamMemberModel.destroy({ where: { id: member.id } })
      
      return res.status(200).json({
        success: true,
        message: "Team member deleted successfully",
        data: member,
      });
    } else {
      // If team_ids don't match, just return the member without deleting
      return res.status(403).json({
        success: false,
        message: "You are not the owner of this team member",
        data: member,
      });
    }
    

   

  } catch (error) {
    console.log("Error fetching delete team member:", error);
    return next(error);
  }
},

getTeamMembers: async (req, res, next) => {
  try {
    debugger
    const userId = req.user?.id;
    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    // pagination & search query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    // 1️⃣ find team by user id
    const team = await TeamModel.findOne({
      where: { user_id: userId },
    });

    if (!team) {
      return next(new HttpError(404, "Team not found"));
    }

    // 2️⃣ build search condition
    const whereCondition = {
      team_id: team.id,
    };

    if (search) {
      whereCondition[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    // 3️⃣ get team members with pagination
    // const { rows: members, count: total } =
    //   await TeamMemberModel.findAndCountAll({ 
    //     where: whereCondition,
    //     limit,
    //     offset,
    //     order: [["createdAt", "DESC"]],
    //   });


     // 3️⃣ get team members + analytics (LEFT JOIN)
    // const { rows: members, count: total } =
    //   await TeamMemberModel.findAndCountAll({
    //     where: whereCondition,
    //     limit,
    //     offset,
    //     order: [["createdAt", "DESC"]],
    //     include: [
    //       {
    //         model: UserAnalyticsTotalModel,
    //         as: "analytics",              // alias (explained below)
    //         required: false,              // 👈 LEFT JOIN
    //         attributes: [
    //           "total_views",
    //           "total_clicks",
    //         ],
    //         on: {
    //           user_profile_id: {
    //             [Op.eq]: sequelize.col(
    //               "TeamMemberModel.user_profile_id"
    //             ),
    //           },
    //         },
    //       },
    //     ],
    //   });


//     const { rows: members, count: total } =
//   await TeamMemberModel.findAndCountAll({
//     where: whereCondition,
//     limit,
//     offset,
//     order: [["createdAt", "DESC"]],
//     attributes: {
//       include: [
//         [
//           sequelize.literal(`(
//             SELECT total_views
//             FROM user_analytics_totals ua
//             WHERE ua.user_profile_id = TeamMemberModel.user_profile_id
//             LIMIT 1
//           )`),
//           "total_views",
//         ],
//         [
//           sequelize.literal(`(
//             SELECT total_clicks
//             FROM user_analytics_totals ua
//             WHERE ua.user_profile_id = TeamMemberModel.user_profile_id
//             LIMIT 1
//           )`),
//           "total_clicks",
//         ],
//       ],
//     },
//   });

const { rows: members, count: total } =
  await TeamMemberModel.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT total_views
            FROM user_analytics_totals ua
            WHERE ua.user_profile_id = TeamMember.user_profile_id
            LIMIT 1
          )`),
          "total_views",
        ],
        [
          sequelize.literal(`(
            SELECT total_clicks
            FROM user_analytics_totals ua
            WHERE ua.user_profile_id = TeamMember.user_profile_id
            LIMIT 1
          )`),
          "total_clicks",
        ],
      ],
    },
  });

    return res.status(200).json({
      success: true,
      message: "Team members fetched successfully",
      data: members,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });


   
  } catch (error) {
    console.log("Error fetching team members:", error);
    return next(error);
  }
},


 acceptInvitation: async (req, res, next) => {
    try {
        debugger
      const userId = req.user?.id;
      if (!userId) {
        return next(new HttpError(401, "Unauthorized"));
      }

      let teamMemberId = req.params.id;
     
       let teamMember = await TeamMemberModel.findByPk(teamMemberId);

    if (!teamMember) {
        return res.status(404).json({
        success: false,
        message: "Team member not found",
      });
  }
  if (teamMember.invitation_status === "ACCEPTED") {
    return res.status(400).json({
      success: false,
      message: "Invitation already accepted",
    });
  }
     

      // 2️⃣ Check if user already has a team
      const team = await TeamModel.findByPk(teamMember.team_id );

      if (!team) {
        return res.status(409).json({
          success: false,
          message: "Team does not exist",
        });
      }

      


   

  




// getMyBusinessProfile
 try {
    const user = await UserModel.findByPk(userId);
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
      where: { user_id: userId, profile_type_id: businessType.id },
    });

    let businessProfile;
    let customization;

    if (!userProfile) {
      const fallbackBusinessName =
        user.business_name || user.full_name || user.username || "My Business";

      businessProfile = await BusinessProfile.create({
        user_id: userId,
        business_name: fallbackBusinessName,
        username: user.username || null,
        bio: "",
        banner: null,
        profile_image: null,
        logo: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: businessType.id,
        profile_id: businessProfile.id,
        profile_type_name: "Business Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });

      customization = await ProfileCustomization.create({
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
    } else {
      businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);

      if (!businessProfile) {
        return next(
          new HttpError(500, "Corrupted profile: missing BusinessProfile")
        );
      }

      customization = await ProfileCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      });

      if (!customization) {
        customization = await ProfileCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: businessProfile.id,
          about_text_color:"#ffff",
          font_family: "inter",
          font_size: 16,
          background_color: "#000000",
          background_image: null,
          background_blur: 0,
          layout: "DEFAULT",
        });
      }
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
        background_color:  "#1C1D2d",
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
        button_bg_color:"#4f2e86",
        button_text_color:"#ffff",
        success_message:"",
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
    //  return res.json({
    //   user,
    //   profile: profileWithServer,
    //   userProfile,
    //   customization: customizationWithServer,

    //   links,
    //   linkCustomization,

    //   customLinks: customLinksWithServer,
    //   customLinkCustomization,

    //     media: mediaWithServer,
    //     mediaCustomization,
    //   contact,
    //   contactFields,

    //   saveContact,
    // });

    await teamMember.update({ invitation_status: "ACCEPTED",user_profile_id:userProfile.id });




      
      if(!teamMember.user_id){
        teamMember.user_id = userId;
        await teamMember.save();
      }
    return res.status(201).json({
        success: true,
        message: "Team invitation accepted successfully",
        data: teamMember,
      });
   
  } catch (err) {
    console.error("Error accepting team invitation while creating Business Profile:", err);
    return next(err);
  }
     
      
    } catch (error) {
      console.log("Error accepting team invitation:", error);
      return next(error);
    }
  },

  getMemberProfiles: async (req, res, next) => {
    try {
      const { memberId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      if (!memberId) {
        return next(new HttpError(400, "memberId is required"));
      }

      // 1. Find the team member
      const teamMember = await TeamMemberModel.findByPk(memberId);
      if (!teamMember) {
        return next(new HttpError(404, "Team member not found"));
      }

      // 2. Resolve user_id: either from teamMember record or by email lookup
      let targetUserId = teamMember.user_id;
      
      if (!targetUserId && teamMember.email) {
        const user = await UserModel.findOne({
          where: { email: teamMember.email.toLowerCase() }
        });
        if (user) {
          targetUserId = user.id;
        }
      }

      if (!targetUserId) {
        return res.status(200).json({
          status: "success",
          data: [],
        });
      }

      // 3. Find all UserProfiles for this team member's user_id with pagination
      const { count, rows: userProfiles } = await UserProfile.findAndCountAll({
        where: { user_id: targetUserId },
        include: [{ model: ProfileType }],
        limit,
        offset,
      });

      // 4. Format the data as requested
      const data = userProfiles.map((up) => ({
        id: up.id,
        name: up.ProfileType?.name || up.ProfileType?.type || "Unknown",
      }));

      return res.status(200).json({
        status: "success",
        data,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        }
      });
    } catch (error) {
      console.log("Error fetching member profiles:", error);
      return next(error);
    }
  },
};

export default TeamController;
