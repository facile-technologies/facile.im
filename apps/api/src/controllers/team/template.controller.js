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
import HelperMethods from "../../utils/helper.js";
import User from "../../models/User.model.js";

const TemplateController = {
 

   



    createTemplate: async (req, res, next) => {
      debugger
      const userId = req.user?.id;
    
      if (!userId) {
        return next(new HttpError(401, "Unauthorized: user not found"));
      }
    
      try {
         const user = await UserModel.findByPk(userId, {
  attributes: { exclude: ['password'] }
});
        if (!user) {
          return next(new HttpError(404, "User not found"));
        }

         if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Required fields are missing.",
        });
      }

      // validation
      const { error } = JoiValidation.createTemplateValidation(req.body);

      if (error) {
        return next(error);
      }


          
          // 1️⃣ find team by user id
      const team = await TeamModel.findOne({
        where: { user_id: userId },
      });

        if (!team) {
          return next(new HttpError(404, "You can not create template without a team - team not found"));
        }

        const {template_name, is_template_locked,business_name,bio,about_text_color,
      font_size,
      font_family,
      background_color,
      background_blur,} = req.body;

        
    

     let template = await TemplateModel.create({
            template_name: template_name,
            is_template_locked: is_template_locked,
            user_id: userId,
            team_id:team.id,
            is_default: false,
          });
    
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
    

         //Handle files
    const profilePicFile = req.files?.profilePicture?.[0];
    const logoFile = req.files?.logo?.[0];
    const bannerFile = req.files?.banner?.[0];
    const backgroundImageFile = req.files?.backgroundImage?.[0];

   

         let businessProfile = await BusinessProfile.create({
            user_id: userId,
            business_name: business_name ? business_name : '',
            username:  null,
            bio: bio ? bio : "",
            banner: bannerFile ? `/uploads/banner/${bannerFile.filename}` :  null,
            profile_image: profilePicFile ? `/uploads/profile/${profilePicFile.filename}` : null,
            logo: logoFile ?  `/uploads/logo/${logoFile.filename}` : null,
          });



         



    let userProfile = await UserProfile.create({
            user_id: userId,
            profile_type_id: businessType.id,
            profile_id: businessProfile.id,
            profile_type_name: "Business Profile",
            role: "OWNER",
            is_primary: false,
            is_active: true,
            template_id: template.id, // associate template with user profile
            is_template_assigned:false,
            team_id:team.id,
            is_template_profile:true, // this is a template profile

          });
    
        let  customization = await ProfileCustomization.create({
            user_profile_id: userProfile.id,
            profile_id: businessProfile.id,
            about_text_color: about_text_color ? about_text_color : "#ffffff",
            font_family: font_family ? font_family : "inter",
            font_size: font_size ? font_size :16,
            background_color: background_color ? background_color : "#000000",
            background_image:backgroundImageFile ? `/uploads/background/${backgroundImageFile.filename}` : null,
            background_blur: background_blur ? background_blur :0,
            layout: "DEFAULT",
          });


               

        //
        // 2. Find or create userProfile + businessProfile + profile customization
        //
        // let userProfile = await UserProfile.findOne({
        //   where: { user_id: userId, profile_type_id: businessType.id },
        // });
    
      
    
        
    
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
        return res.json({
          status:true,
          message:"Template created successfully",
          data:{
            template,
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
          }
          
        });
      } catch (err) {
        console.error("Error in creating template:", err);
        return next(err);
      }
    },



    updateTemplate: async (req, res, next) => {
      debugger
      const userId = req.user?.id;
    
      if (!userId) {
        return next(new HttpError(401, "Unauthorized: user not found"));
      }
    
      try {
        const user = await UserModel.findByPk(userId);
        if (!user) {
          return next(new HttpError(404, "User not found"));
        }

         if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: "Required fields are missing.",
        });
      }

      // validation
      const { error } = JoiValidation.createTemplateValidation(req.body);

      if (error) {
        return next(error);
      }


      let templateId = req.params.id;
          
          // 1️⃣ find team by user id
      const team = await TeamModel.findOne({
        where: { user_id: userId },
      });

        if (!team) {
          return next(new HttpError(404, "You can not create template without a team - team not found"));
        }

        const {template_name, is_template_locked,business_name,bio,about_text_color,
      font_size,
      font_family,
      background_color,
      background_blur,is_default} = req.body;

        
    
      let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }




    
        let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
          }


        let  businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);
          
                if (!businessProfile) {
                  return next(
                    new HttpError(500, "Corrupted profile: missing BusinessProfile")
                  );
                }


                let customization = await ProfileCustomization.findOne({
                      where: { user_profile_id: userProfile.id },
                    });

                    if (!customization) {
                  return next(
                    new HttpError(500, "Corrupted profile: missing Customization")
                  );
                }
    

                // 3. Update main business fields
    if (typeof business_name === "string") {
      businessProfile.business_name = business_name;
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

    if (profilePicFile) {
      businessProfile.profile_image = `/uploads/profile/${profilePicFile.filename}`;
    }
    if (logoFile) {
      businessProfile.logo = `/uploads/logo/${logoFile.filename}`;
    }
    if (bannerFile) {
      businessProfile.banner = `/uploads/banner/${bannerFile.filename}`;
    }
    if (backgroundImageFile) {
      customization.background_image = `/uploads/background/${backgroundImageFile.filename}`;
    }

   

          if (typeof template_name === "string") {
      template.name = template_name;
    }
   
    if (is_template_locked == "true" || is_template_locked === true) {
      template.is_template_locked = true;
    }

    if (is_template_locked == "false" || is_template_locked === false) {
      template.is_template_locked = false;
    }

    if (is_default == "true" || is_default === true) {
      template.is_default = true;
    }

    if (is_default == "false" || is_default === false) {
      template.is_default = false;
    }


          



           // 6. Save
    await businessProfile.save();
    await customization.save();
    await template.save();
         



 
    
      


               

        
        //
        // 7. FINAL RESPONSE WITH EVERYTHING
        //

        
        return res.json({
          success: true,
          message: "Template updated successfully",
          profile: {
            template,
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
        console.error("Error in updating template:", err);
        return next(err);
      }
    },
    getAllTemplates: async (req, res, next) => {
      debugger
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
        { template_name: { [Op.like]: `%${search}%` } },
      ];
    }



    const { rows: templates, count: total } =
      await TemplateModel.findAndCountAll({ 
        where: whereCondition,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

    



    return res.status(200).json({
      success: true,
      message: "Templates fetched successfully",
      data: templates,
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


getTemplateById: async (req, res, next) => {
  debugger
  const userId = req.user?.id;

  if (!userId) {
    return next(new HttpError(401, "Unauthorized: user not found"));
  }

  try {
    const user = await UserModel.findByPk(userId, {
  attributes: { exclude: ['password'] }
});
    if (!user) {
      return next(new HttpError(404, "User not found"));
    }

   
      let templateId = req.params.id;

        let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
          }




           let  businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);
          
                if (!businessProfile) {
                  return next(
                    new HttpError(500, "Corrupted profile: missing BusinessProfile")
                  );
                }


                let customization = await ProfileCustomization.findOne({
                      where: { user_profile_id: userProfile.id },
                    });

                    if (!customization) {
                  return next(
                    new HttpError(500, "Corrupted profile: missing Customization")
                  );
                }

    //
    // 2. Find or create userProfile + businessProfile + profile customization
    //
    

   


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
    return res.json({
        status:true,
          
         
              template,
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
    console.error("Error in getting template details:", err);
    return next(err);
  }
},






 createTemplateProfileLink: async (req, res, next) => {
  debugger
    const userId = req.user?.id;
    console.log("createTemplateProfileLink called by userId:", userId);

    if (!userId) {
      console.warn("Unauthorized: no userId in request");
      return next(new HttpError(401, "Unauthorized"));
    }

    const { templateId } = req.params;
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
      const user = await UserModel.findByPk(userId);
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



       let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
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
        message: "Template link created successfully",
        link: createdWithPlatform,
        linkCustomization,
      });
    } catch (err) {
      console.error("Error in createTemplateProfileLink:", err);
      return next(err);
    }
  },


  getTemplateProfileLinks: async (req, res, next) => {
    debugger
      const userId = req.user?.id;
      console.log("getTemplateProfileLinks called by userId:", userId);
  
      if (!userId) {
        console.warn("Unauthorized: no userId in request");
        return next(new HttpError(401, "Unauthorized"));
      }
  
  
      const { templateId } = req.params;
      try {
        const user = await UserModel.findByPk(userId);
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



         let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
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
  
        return res.json({
          message: "Template links fetched successfully",
          links,
          linkCustomization,
        });
      } catch (err) {
        console.error("Error in getTemplateProfileLinks:", err);
        return next(err);
      }
    },



     updateTemplateProfileLinksSequence: async (req, res, next) => {
      debugger
        const userId = req.user?.id;
        console.log(
          "updateTemplateProfileLinksSequence called by userId:",
          userId
        );
    
        if (!userId) {
          return next(new HttpError(401, "Unauthorized"));
        }
    
        const { links } = req.body;
    
        const { templateId } = req.params;
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
          const user = await UserModel.findByPk(userId);
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
    


           let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
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
            message: "Template links updated successfully (order + visibility)",
            links: updatedLinks,
          });
        } catch (err) {
          console.error(
            "Error in updateTemplateProfileLinksSequence:",
            err
          );
          return next(err);
        }
      },


       editTemplateProfileLink: async (req, res, next) => {
        debugger
          const userId = req.user?.id;
      
      
      
          const { templateId, linkId } = req.params;
      
          Number(linkId)
          if (!userId) {
            return next(new HttpError(401, "Unauthorized"));
          }
      
          // if (!Number.isInteger(linkId)) {
          //   return next(new HttpError(400, "Invalid business link id"));
          // }
      
          const { platform_name, platform_link_id, username, title } = req.body;
          console.log("Edit business link body:", req.body);
      
          try {
            const user = await UserModel.findByPk(userId);
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

             let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
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


         deleteTemplateProfileLink: async (req, res, next) => {
          debugger
            const userId = req.user?.id;
            const { templateId, linkId } = req.params;
            console.log(
              "deleteTemplateProfileLink called by userId:",
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
              const user = await UserModel.findByPk(userId);
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
        


              let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
          }
             
        
              const link = await ProfileLink.findOne({
                where: {
                  id: linkId,
                  user_profile_id: userProfile.id,
                },
              });
        
              if (!link) {
                console.warn(
                  "Template link not found or does not belong to userProfile:",
                  { linkId, userProfileId: userProfile.id }
                );
                return next(new HttpError(404, "Link not found"));
              }
        
              console.log("Deleting Template ProfileLink with id:", link.id);
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
                message: "Template link deleted successfully",
                links: updatedLinks,
              });
            } catch (err) {
              console.error("Error in deleteTemplateProfileLink:", err);
              return next(err);
            }
          },

          updateTemplateProfileLinkCustomization: async (req, res, next) => {
              const userId = req.user?.id;
              console.log(
                "updateTemplateProfileLinkCustomization called by userId:",
                userId
              );
          
              if (!userId) {
                return next(new HttpError(401, "Unauthorized"));
              }
          
              const { templateId } = req.params;
          
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
                const user = await UserModel.findByPk(userId);
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
          
                let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
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
                  message: "Template profile link customization updated",
                  customization: linkCustomization,
                });
              } catch (err) {
                console.error(
                  "Error in updateTemplateProfileLinkCustomization:",
                  err
                );
                return next(err);
              }
            },

             createTemplateCustomLink: async (req, res, next) => {
              debugger
                const userId = req.user?.id;
                console.log("createTemplateCustomLink called by userId:", userId);
            
                if (!userId) {
                  console.warn("Unauthorized: no userId in request");
                  return next(new HttpError(401, "Unauthorized"));
                }
            
                const { templateId } = req.params;
            
                const { title, url } = req.body || {};
                console.log("Request body (business custom link):", req.body);
            
                if (!title || typeof title !== "string") {
                  return next(new HttpError(400, "title is required"));
                }
            
                if (!url || typeof url !== "string") {
                  return next(new HttpError(400, "url is required"));
                }
            
                try {
                  const user = await UserModel.findByPk(userId);
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
            
                  let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
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
                    message: "Template custom link created successfully",
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
                  console.error("Error in createTemplateCustomLink:", err);
                  return next(err);
                }
              },

              getMyTemplateCustomLinks: async (req, res, next) => {
                  const userId = req.user?.id;
                  console.log("getMyTemplateCustomLinks called by userId:", userId);
              
                  if (!userId) {
                    console.warn("Unauthorized: no userId in request");
                    return next(new HttpError(401, "Unauthorized"));
                  }
                  const { templateId } = req.params;
              
                  try {
                    const user = await UserModel.findByPk(userId);
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

                    let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
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
              
                    return res.json({
                      message: "Template custom links fetched successfully",
                      customLinks: customLinksWithServer,
                      customLinkCustomization,
                    });
                  } catch (err) {
                    console.error("Error in getMyTemplateCustomLinks:", err);
                    return next(err);
                  }
                },


                 updateTemplateCustomLinksSequence: async (req, res, next) => {
                  debugger
                    const userId = req.user?.id;
                    console.log(
                      "updateTemplateCustomLinksSequence called by userId:",
                      userId
                    );
                
                    if (!userId) {
                      return next(new HttpError(401, "Unauthorized"));
                    }
                
                    const { links } = req.body;
                
                    const { templateId } = req.params;
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
                      const user = await UserModel.findByPk(userId);
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


                      let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
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
                          "Template custom links updated successfully (order + visibility)",
                        customLinks: updatedLinks,
                      });
                    } catch (err) {
                      console.error(
                        "Error in updateTemplateCustomLinksSequence:",
                        err
                      );
                      return next(err);
                    }
                  },


                    editTemplateCustomLink: async (req, res, next) => {
                      debugger
                      const userId = req.user?.id;
                      const { templateId, linkId } = req.params;
                      console.log(
                        "editTemplateCustomLink called by userId:",
                        userId,
                        "for linkId:",
                        linkId
                      );
                  
                      if (!userId) {
                        return next(new HttpError(401, "Unauthorized"));
                      }
                  
                      
                  
                      const { title, url } = req.body || {};
                      console.log("Edit business custom link body:", req.body);
                  
                      try {
                        const user = await UserModel.findByPk(userId);
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

                        let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
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
                          message: "Template custom link updated successfully",
                          customLink,
                        });
                      } catch (err) {
                        console.error("Error in editTemplateCustomLink:", err);
                        return next(err);
                      }
                    },

                    deleteTemplateCustomLink: async (req, res, next) => {
                        const userId = req.user?.id;
                        const { templateId, linkId } = req.params;
                        console.log(
                          "deleteTemplateCustomLink called by userId:",
                          userId,
                          "for linkId:",
                          linkId
                        );
                    
                        if (!userId) {
                          return next(new HttpError(401, "Unauthorized"));
                        }
                    
                       
                        try {
                          const user = await UserModel.findByPk(userId);
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

                          let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
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
                            message: "Template custom link deleted successfully",
                            customLinks: updatedLinks,
                          });
                        } catch (err) {
                          console.error("Error in deleteTemplateCustomLink:", err);
                          return next(err);
                        }
                      },


                       updateTemplateCustomLinkCustomization: async (req, res, next) => {
                        debugger
                          const userId = req.user?.id;
                          console.log(
                            "updateTemplateCustomLinkCustomization called by userId:",
                            userId
                          );
                      
                          if (!userId) {
                            return next(new HttpError(401, "Unauthorized"));
                          }
                      
                          const { templateId } = req.params;
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
                            const user = await UserModel.findByPk(userId);
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
                      

                            let template = await TemplateModel.findByPk(templateId);

      if(!template){
        return res.status(404).json({
          success:false,
          message:"Template not found"
        });
      }


      let userProfile = await UserProfile.findOne({
            where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
          });
    
          if(!userProfile){
            return res.status(404).json({
              success:false,
              message:"Template user profile not found"
            });
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
                              message: "Template custom link customization updated",
                              customization: customLinkCustomization,
                            });
                          } catch (err) {
                            console.error(
                              "Error in updateTemplateCustomLinkCustomization:",
                              err
                            );
                            return next(err);
                          }
                        },

                        getTemplateProfileContact: async (req, res, next) => {
    const userId = req.user?.id;
    console.log("getTemplateProfileContact called by userId:", userId);

    if (!userId) {
      return next(new HttpError(401, "Unauthorized"));
    }

    const { templateId } = req.params;

    try {
      const user = await UserModel.findByPk(userId);
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

     

                              let template = await TemplateModel.findByPk(templateId);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }


                              let userProfile = await UserProfile.findOne({
                                    where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
                                  });
                            
                                  if(!userProfile){
                                    return res.status(404).json({
                                      success:false,
                                      message:"Template user profile not found"
                                    });
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
      console.error("Error in getTemplateProfileContact:", err);
      return next(err);
    }
  },


                           updateTemplateProfileContact: async (req, res, next) => {
                            debugger
                              const userId = req.user?.id;
                              console.log(
                                "updateTemplateProfileContact called by userId:",
                                userId
                              );
                          
                              if (!userId) {
                                return next(new HttpError(401, "Unauthorized"));
                              }
                          
                              const { templateId } = req.params;
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
                                const user = await UserModel.findByPk(userId);
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
                          

                                

                              let template = await TemplateModel.findByPk(templateId);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }


                              let userProfile = await UserProfile.findOne({
                                    where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
                                  });
                            
                                  if(!userProfile){
                                    return res.status(404).json({
                                      success:false,
                                      message:"Template user profile not found"
                                    });
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
                                  message: "Template contact info updated successfully",
                                  contact,
                                  fields: updatedFields,
                                });
                              } catch (err) {
                                console.error("Error in updateTemplateProfileContact:", err);
                                return next(err);
                              }
                            },


                            getTemplateProfileSaveContact: async (req, res, next) => {
                                const userId = req.user?.id;
                                console.log(
                                  "getTemplateProfileSaveContact called by userId:",
                                  userId
                                );
                            
                                if (!userId) {
                                  return next(new HttpError(401, "Unauthorized"));
                                }
                            
                                const { templateId } = req.params;
                            
                                try {
                                  const user = await UserModel.findByPk(userId);
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
                            
                                 

                              let template = await TemplateModel.findByPk(templateId);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }


                              let userProfile = await UserProfile.findOne({
                                    where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
                                  });
                            
                                  if(!userProfile){
                                    return res.status(404).json({
                                      success:false,
                                      message:"Template user profile not found"
                                    });
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
                                    message: "Template save contact styling fetched successfully",
                                    saveContact,
                                  });
                                } catch (err) {
                                  console.error("Error in getTemplateProfileSaveContact:", err);
                                  return next(err);
                                }
                              },


                              updateTemplateProfileSaveContact: async (req, res, next) => {
                                  const userId = req.user?.id;
                                  console.log(
                                    "updateTemplateProfileSaveContact called by userId:",
                                    userId
                                  );
                              
                                  if (!userId) {
                                    return next(new HttpError(401, "Unauthorized"));
                                  }
                              
                                    const { templateId } = req.params;
                              
                                  const {
                                    button_text,
                                    button_corner_radius,
                                    button_bg_color,
                                    button_text_color,
                                  } = req.body || {};
                              
                                  try {
                                    const user = await UserModel.findByPk(userId);
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
                              
                                   

                              let template = await TemplateModel.findByPk(templateId);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }


                              let userProfile = await UserProfile.findOne({
                                    where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
                                  });
                            
                                  if(!userProfile){
                                    return res.status(404).json({
                                      success:false,
                                      message:"Template user profile not found"
                                    });
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
                                      message: "Template save contact styling updated successfully",
                                      saveContact,
                                    });
                                  } catch (err) {
                                    console.error(
                                      "Error in updateTemplateProfileSaveContact:",
                                      err
                                    );
                                    return next(err);
                                  }
                                },


                                  toggleTemplateSaveContactStatus: async (req, res, next) => {
                                    const userId = req.user?.id;
                                    if (!userId) {
                                      return next(new HttpError(401, "Unauthorized"));
                                    }
                                
                                    const { templateId } = req.params;
                                    const { is_enabled } = req.body;
                                
                                    if (is_enabled === undefined) {
                                      return next(new HttpError(400, "is_enabled field is required"));
                                    }
                                
                                    try {
                                      const businessType = await ProfileType.findOne({
                                        where: { type: "BUSINESS" },
                                      });
                                
                                      if (!businessType) {
                                        return next(new HttpError(400, "Storefront profile type not configured"));
                                      }

                                      let template = await TemplateModel.findByPk(templateId);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }
                                
                                      const userProfile = await UserProfile.findOne({
                                        where: {
                                          user_id: userId,
                                          profile_type_id: businessType.id,
                                          template_id: template.id,
                                          is_template_profile:true
                                        },
                                      });
                                
                                      if (!userProfile) {
                                        return next(new HttpError(404, "Storefront profile not found for this user"));
                                      }
                                
                                      const businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);
                                      if (!businessProfile) {
                                        return next(new HttpError(404, "Storefront profile missing for this user"));
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
                                      console.error("Error in toggleTemplateSaveContactStatus:", err);
                                      return next(err);
                                    }
                                  },

                                  createTemplateProfileMedia: async (req, res, next) => {
                                    const userId = req.user?.id;
                                    console.log("createTemplateProfileMedia called by userId:", userId);
                                
                                    if (!userId) return next(new HttpError(401, "Unauthorized"));
                                
                                    const { templateId } = req.params;
                                    try {
                                      const user = await UserModel.findByPk(userId);
                                      if (!user) return next(new HttpError(404, "User not found"));
                                
                                      const businessType = await ProfileType.findOne({ where: { type: "BUSINESS" } });
                                      if (!businessType) {
                                        return next(new HttpError(400, "Business profile type not configured"));
                                      }
                                

                              let template = await TemplateModel.findByPk(templateId);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }


                              let userProfile = await UserProfile.findOne({
                                    where: { user_id: userId, template_id: template.id,is_template_profile:true,profile_type_id: businessType.id },
                                  });
                            
                                  if(!userProfile){
                                    return res.status(404).json({
                                      success:false,
                                      message:"Template user profile not found"
                                    });
                                  }
                              
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
                                      console.error("Error in createTemplateProfileMedia:", err);
                                      return next(err);
                                    }
                                  },


                                  updateTemplateMediaSequenceAndLayout: async (req, res, next) => {
                                      const userId = req.user?.id;
                                      console.log("updateMyStoreFrontProfileMediaSequenceAndLayout called:", userId);
                                  
                                      if (!userId) return next(new HttpError(401, "Unauthorized"));
                                  
                                      const { layout, media } = req.body || {};
                                      const { templateId } = req.params;
                                  
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
                                          return next(new HttpError(400, "Storefront profile type not configured"));
                                        }
                                  
                                        let userProfile;
                                        if (templateId) {


                                          let template = await TemplateModel.findByPk(templateId);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }
                                
                                       userProfile = await UserProfile.findOne({
                                        where: {
                                          user_id: userId,
                                          profile_type_id: businessType.id,
                                          template_id: template.id,
                                          is_template_profile:true
                                        },
                                      });
                                         

                                      if(!userProfile){
                                        return res.status(403).json({
                                          status:false,
                                          message:"user profile not found or missing"
                                        })
                                      }



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
                                  
                                        if (!userProfile) return next(new HttpError(400, "Storefront profile not found"));
                                  
                                        const businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);
                                        if (!businessProfile) return next(new HttpError(400, "Storefront profile missing"));
                                  
                                        const existingMedia = await ProfileMedia.findAll({
                                          where: { user_profile_id: userProfile.id },
                                        });
                                  
                                        const existingIds = existingMedia.map((m) => m.id);
                                  
                                        const missingInRequest = existingIds.filter((id) => !orderedIds.includes(id));
                                        const unknownIds = orderedIds.filter((id) => !existingIds.includes(id));
                                  
                                        if (missingInRequest.length > 0 || unknownIds.length > 0) {
                                          const errObj = new HttpError(
                                            400,
                                            "media array must contain exactly all media IDs for the selected storefront profile"
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
                                        console.error("Error in updateTemplateMediaSequenceAndLayout:", err);
                                        return next(err);
                                      }
                                    },


                                   deleteTemplateProfileMedia: async (req, res, next) => {
                                    debugger
                                      const userId = req.user?.id;
                                      const mediaId = Number(req.params.id);
                                  
                                      console.log("deleteTemplateProfileMedia called:", { userId, mediaId });
                                  
                                      if (!userId) return next(new HttpError(401, "Unauthorized"));
                                      if (!Number.isInteger(mediaId)) return next(new HttpError(400, "Invalid media id"));
                                  
                                      try {
                                        const user = await User.findByPk(userId);
                                        if (!user) return next(new HttpError(404, "User not found"));

                                        const mediaItem = await ProfileMedia.findByPk(mediaId);
                                              if (!mediaItem) return next(new HttpError(404, "Media not found"));
                                  
                                        const businessType = await ProfileType.findOne({ where: { type: "BUSINESS" } });
                                        if (!businessType) {
                                          return next(new HttpError(400, "Business profile type not configured"));
                                        }
                                  
                                        const userProfile = await UserProfile.findOne({
                                          where: {id: mediaItem.user_profile_id, user_id: userId, profile_type_id: businessType.id },
                                        });
                                        if (!userProfile) return next(new HttpError(400, "Business profile not found"));
                                  

                                         await mediaItem.destroy();
                                        // const businessProfile = await BusinessProfile.findByPk(userProfile.profile_id);
                                        // if (!businessProfile) return next(new HttpError(400, "Business profile missing"));
                                  
                                        // // ✅ Find the media ensuring it belongs to this user's business profile
                                        // const mediaItem = await ProfileMedia.findOne({
                                        //   where: {
                                        //     id: mediaId,
                                        //     user_profile_id: userProfile.id,
                                        //     profile_id: businessProfile.id,
                                        //     user_id: userId,
                                        //   },
                                        // });
                                  
                                        // if (!mediaItem) return next(new HttpError(404, "Media not found"));
                                  
                                        // OPTIONAL: delete physical file (local storage) - same note as personal
                                        // if (mediaItem.media_url) {
                                        //   const localPath = path.join(process.cwd(), mediaItem.media_url.replace(/^\//, ""));
                                        //   fs.unlink(localPath, (err) => {
                                        //     if (err) console.warn("Failed to delete file:", localPath, err.message);
                                        //   });
                                        // }
                                  
                                        // await mediaItem.destroy();
                                  
                                        // ✅ Re-sequence remaining media
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
                                        console.error("Error in deleteTemplateProfileMedia:", err);
                                        return next(err);
                                      }
                                    },


                                    
                            getMembers: async (req, res, next) => {
                                debugger
                                    const userId = req.user?.id;
                                    console.log("createTemplateProfileMedia called by userId:", userId);
                                
                                    if (!userId) return next(new HttpError(401, "Unauthorized"));
                                
                                    const { templateId } = req.params;
                                    try {
                                      const user = await UserModel.findByPk(userId);
                                      if (!user) return next(new HttpError(404, "User not found"));
                                
                                     
                                  // 1️⃣ find team by user id
                                    const team = await TeamModel.findOne({
                                      where: { user_id: userId },
                                    });
                                
                                    if (!team) {
                                      return next(new HttpError(404, "Team not found"));
                                    }

                              let template = await TemplateModel.findByPk(templateId);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }


                              // let teamMembers = await TeamMemberModel.findAll({
                              //   where: { team_id: team.id },
                              
                              // });


//                              let userProfiles = await UserProfile.findAll({
//   where: { 

//     template_id: templateId, is_template_profile: false
//   }
// });
                            
//                                   if(userProfiles.length == 0){
//                                     return res.status(404).json({
//                                       success:false,
//                                       message:"No members added to the team yet"
//                                     });
//                                   }




// Find all team members for a specific team with user profile data
// const teamMembers = await TeamMemberModel.findAll({
//   where: {
//     team_id: team.id  // replace with your actual team ID
//   },
//   include: [
//     {
//       model: UserProfile,
//       as: 'userProfile',  // must match the alias from association
//       required: false,    // false = LEFT JOIN, true = INNER JOIN
//       attributes: ['id', 'user_id', 'template_id', 'is_template_profile', 'profile_type_id'] // specify fields you need
//     },
    
//   ],
//   order: [['created_at', 'DESC']]  // optional: sort results
// });


const teamMembers = await TeamMemberModel.findAll({
  where: {
    team_id: team.id  // replace with your actual team ID
  },
  include: [
    {
      model: UserProfile,
      as: 'userProfile',  // must match the alias from association
      required: false,    // false = LEFT JOIN, true = INNER JOIN
      attributes: ['id', 'user_id', 'template_id', 'is_template_profile', 'profile_type_id', 'profile_id'], // include profile_id
      include: [
        {
          model: BusinessProfile,  // Import BusinessProfile model
          as: 'businessProfile',   // You need to define this association in UserProfile model
          required: false,          // false = LEFT JOIN
          attributes: ['id', 'profile_image', 'business_name', 'logo'] // specify fields you need
        }
      ]
    },
  ],
  order: [['created_at', 'DESC']]  // optional: sort results
});
                              
                                     
                                
                                       // Separate members into assigned and unassigned
    const assignedMembers = [];
    const unassignedMembers = [];

    teamMembers.forEach(member => {
      const memberData = member.toJSON ? member.toJSON() : member;
      
      // Check if user has the template assigned
      const hasTemplateAssigned = memberData.userProfile && 
                                   memberData.userProfile.template_id === parseInt(templateId);
      
      if (hasTemplateAssigned) {
        assignedMembers.push(memberData);
      } else {
        unassignedMembers.push(memberData);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Team members fetched successfully",
      data: {
        assignedMembers: assignedMembers,
        unassignedMembers: unassignedMembers,
        totalMembers: teamMembers.length,
        assignedCount: assignedMembers.length,
        unassignedCount: unassignedMembers.length,
        teamMembers
      }
    });
                                    } catch (err) {
                                      console.error("Error in createTemplateProfileMedia:", err);
                                      return next(err);
                                    }
                                  },



                                    assignTemplateToMember: async (req, res, next) => {
                              debugger
                                    const userId = req.user?.id;
                                    console.log("AssignTemplateToMember called by userId:", userId);
                                
                                    if (!userId) return next(new HttpError(401, "Unauthorized"));
                                
                                    const { templateId } = req.params;
                                    try {
                                      const user = await UserModel.findByPk(userId);
                                      if (!user) return next(new HttpError(404, "User not found"));
                                
                                     
                                  // 1️⃣ find team by user id
                                    const team = await TeamModel.findOne({
                                      where: { user_id: userId },
                                    });
                                
                                    if (!team) {
                                      return next(new HttpError(404, "Team not found"));
                                    }

                              let template = await TemplateModel.findByPk(templateId);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }


                              if(!req.body.member_id){
                                return res.status(422).json({
                                  success:false,
                                  message:"Team Member Id is required in the request body"
                                });
                              }
                              let memberId = req.body.member_id;


                              let member = await TeamMemberModel.findOne({
                                where:{id:memberId,team_id:team.id}
                              });

                              if(!member){
                                return res.status(404).json({
                                  success:false,
                                  message:"Team member not found"
                                });
                              }


                              let memberUserProfile = await UserProfile.findByPk(member.user_profile_id);

                              if(!memberUserProfile){
                                return res.status(404).json({
                                  success:false,
                                  message:"User profile for the team member not found"
                                });
                              }


                              await memberUserProfile.update({ template_id: templateId, is_template_assigned: true });


                   if(!template.is_template_locked){

                                let templateUserProfile = await UserProfile.findOne({
                                  where:{ template_id: templateId, is_template_profile: true,team_id: team.id }
                                });


                                
                                if(!templateUserProfile){
                                  return res.status(404).json({
                                    success:false,
                                    message:"Template user profile not found for the team"
                                  });
                                }



                                    let  templateBusinessProfile = await BusinessProfile.findByPk(templateUserProfile.profile_id);
          
                                    if (!templateBusinessProfile) {
                                      return next(
                                        new HttpError(500, "Corrupted profile: missing BusinessProfile")
                                      );
                                    }


                                      let  memberBusinessProfile = await BusinessProfile.findByPk(memberUserProfile.profile_id);
                              
                                    if (!memberBusinessProfile) {
                                      return next(
                                        new HttpError(500, "Corrupted profile: missing Member business profile")
                                      );
                                    }

                                    if(!memberBusinessProfile.bio){
                                      memberBusinessProfile.bio = templateBusinessProfile.bio;
                                    }

                              if(!memberBusinessProfile.business_name){
                                memberBusinessProfile.business_name = templateBusinessProfile.business_name;
                              }

                              if(templateBusinessProfile.banner){
                                memberBusinessProfile.banner = templateBusinessProfile.banner;
                              }

                              if(templateBusinessProfile.logo){
                                memberBusinessProfile.logo = templateBusinessProfile.logo;
                              }


                                await memberBusinessProfile.save();
                              


                              let templateCustomization = await ProfileCustomization.findOne({
                                    where: { user_profile_id: templateUserProfile.id },
                                  });

                                    if (!templateCustomization) {
                                  return next(
                                    new HttpError(500, "Corrupted profile: missing template Customization")
                                  );
                                }
                                                

                                      
                                let memberCustomization = await ProfileCustomization.findOne({
                                      where: { user_profile_id: memberUserProfile.id },
                                    });

                                    if (!memberCustomization) {
                                  return next(
                                    new HttpError(500, "Corrupted profile: missing member Customization")
                                  );
                                }


                                                let  customization = await memberCustomization.update({
                        
                          about_text_color: templateCustomization.about_text_color,
                          font_family: templateCustomization.font_family ,
                          font_size: templateCustomization.font_size, 
                          background_color: templateCustomization.background_color,
                          background_image:templateCustomization.font_size, 
                          background_color: templateCustomization.backgroundImageFile ?  templateCustomization.backgroundImageFile  : memberCustomization.background_image,
                          background_blur: templateCustomization.background_blur ,
                          layout: templateCustomization.layout,
                        });
                                                            
                            let templateLinkCustomization = await BusinessProfileLinkCustomization.findOne({
                            where: {
                              user_profile_id: templateUserProfile.id,
                              profile_id: templateBusinessProfile.id,
                              user_id: userId,
                            },
                          });


                          if(!templateLinkCustomization){
                            return res.status(404).json({

                              success:false,
                              message:"Template link customization not found"

                              })
                          }





                        let memberLinkCustomization = await BusinessProfileLinkCustomization.findOne({
                          where: {
                            user_profile_id: memberUserProfile.id,
                            profile_id: memberBusinessProfile.id,
                          },
                        });


                        if(!memberLinkCustomization){
                          return res.status(404).json({

                            success:false,
                            message:"Member link customization not found"

                            })
                        }
                    
                          await memberLinkCustomization.update({
                          
                            icon_styled: templateLinkCustomization.icon_styled,
                            layout: templateLinkCustomization.layout,
                            background_color:templateLinkCustomization.background_color,
                            title_color: templateLinkCustomization.title_color,
                            link_color: templateLinkCustomization.link_color,
                          });
        
    
       
    
                      let templateCustomLinkCustomization = await BusinessCustomLinkCustomization.findOne({
                        where: {
                          user_profile_id: templateUserProfile.id,
                          profile_id: templateBusinessProfile.id,
                          user_id: userId,
                        },
                      });

                      if(!templateCustomLinkCustomization){
                        return res.status(404).json({ 
                          status:false,
                          message:'Template custom link customization missing'
                        })
                      }


                      let memberCustomLinkCustomization = await BusinessCustomLinkCustomization.findOne({
                        where: {
                          user_profile_id: memberUserProfile.id,
                          profile_id: memberBusinessProfile.id,
                        },
                      });

                      if(!memberCustomLinkCustomization){
                        return res.status(404).json({ 
                          status:false,
                          message:'Member custom link customization missing'
                        })
                          }


                      
                          await memberCustomLinkCustomization.update({
                              
                              layout: templateCustomLinkCustomization.layout,
                              background_color: templateCustomLinkCustomization.background_color,
                              title_color: templateCustomLinkCustomization.title_color,
                            });
                      
              




                             let templateMediaCustomization = await ProfileMediaCustomization.findOne({
                where: {
                  user_profile_id: templateUserProfile.id,
                  profile_id: templateBusinessProfile.id,
                  user_id: userId,
                },
              });


              if(!templateMediaCustomization){
                return res.status(404).json({ 
                  status:false,
                  message:'Template media customization missing'
                })
              }



              let memberMediaCustomization = await ProfileMediaCustomization.findOne({
                where: {
                  user_profile_id: memberUserProfile.id,
                  profile_id: memberBusinessProfile.id,
                },
              });


              if(!memberMediaCustomization){
                return res.status(404).json({ 
                  status:false,
                  message:'Template media customization missing'
                })
              }
        
                await memberMediaCustomization.update({
                  
                  layout: templateMediaCustomization.layout,
                });
              
              
                                      let templateContact = await ProfileContact.findOne({
                          where: {
                            user_profile_id: templateUserProfile.id,
                            profile_id: templateBusinessProfile.id,
                          },
                        });

                        if(!templateContact){
                          return res.status(404).json({ 

                            status:false, 
                            message:"Template contact missing"
                          })
                        }



                                                let memberContact = await ProfileContact.findOne({
                          where: {
                            user_profile_id: memberUserProfile.id,
                            profile_id: memberBusinessProfile.id,
                          },
                        });

                        if(!memberContact){
                          return res.status(404).json({ 

                            status:false, 
                            message:"Member contact missing"
                          })
                        }




                       await memberContact.update({
          
            title: templateContact.title ? templateContact.title : memberContact.title,
            description: templateContact.description ? templateContact.description : memberContact.description,
            layout: templateContact.layout ? templateContact.layout : memberContact.layout,
            is_enabled: templateContact.is_enabled !== undefined ? templateContact.is_enabled : memberContact.is_enabled,
            button_text: templateContact.button_text ? templateContact.button_text : memberContact.button_text,
            button_corner_radius: templateContact.button_corner_radius !== undefined ? templateContact.button_corner_radius : memberContact.button_corner_radius,
            button_bg_color:templateContact.button_bg_color ? templateContact.button_bg_color : memberContact.button_bg_color,
            button_text_color:templateContact.button_text_color ? templateContact.button_text_color : memberContact.button_text_color,
            success_message:templateContact.success_message ? templateContact.success_message : memberContact.success_message,
          });
              
                              

           let templateSaveContact = await ProfileSaveContact.findOne({
          where: { profile_id: templateBusinessProfile.id },
        });

        if(!templateSaveContact){
          return res.status(404).json({ 
            status:false,
            message:'Template save contact missing'
          })
        }


         let memberSaveContact = await ProfileSaveContact.findOne({
          where: { profile_id: memberBusinessProfile.id },
        });

        if(!memberSaveContact){
          return res.status(404).json({ 
            status:false,
            message:'Member save contact missing'
          })
        }
    
         await memberSaveContact.update({
           
            button_text: templateSaveContact.button_text ? templateSaveContact.button_text : memberSaveContact.button_text,
            button_corner_radius: templateSaveContact.button_corner_radius !== undefined ? templateSaveContact.button_corner_radius : memberSaveContact.button_corner_radius,
            button_bg_color: templateSaveContact.button_bg_color ? templateSaveContact.button_bg_color : memberSaveContact.button_bg_color,
            button_text_color: templateSaveContact.button_text_color ? templateSaveContact.button_text_color : memberSaveContact.button_text_color,
          });
        
              
              
              
              }

                              







    return res.status(200).json({
      success: true,
      message: "Template Assigned to member successfully",
      
    });
                                    } catch (err) {
                                      console.error("Error in AssignTemplateToMember:", err);
                                      return next(err);
                                    }
                                  },





                                     unAssignTemplateFromMember: async (req, res, next) => {
                              debugger
                                    const userId = req.user?.id;
                                    console.log("unAssignTemplateFromMember called by userId:", userId);
                                
                                    if (!userId) return next(new HttpError(401, "Unauthorized"));
                                
                                    const { templateId } = req.params;
                                    try {
                                      const user = await UserModel.findByPk(userId);
                                      if (!user) return next(new HttpError(404, "User not found"));
                                
                                     
                                  // 1️⃣ find team by user id
                                    const team = await TeamModel.findOne({
                                      where: { user_id: userId },
                                    });
                                
                                    if (!team) {
                                      return next(new HttpError(404, "Team not found"));
                                    }

                              let template = await TemplateModel.findByPk(templateId);

                              if(!template){
                                return res.status(404).json({
                                  success:false,
                                  message:"Template not found"
                                });
                              }


                              if(!req.body.member_id){
                                return res.status(422).json({
                                  success:false,
                                  message:"Team Member Id is required in the request body"
                                });
                              }
                              let memberId = req.body.member_id;


                              let member = await TeamMemberModel.findOne({
                                where:{id:memberId,team_id:team.id}
                              });

                              if(!member){
                                return res.status(404).json({
                                  success:false,
                                  message:"Team member not found"
                                });
                              }


                              let memberUserProfile = await UserProfile.findByPk(member.user_profile_id);

                              if(!memberUserProfile){
                                return res.status(404).json({
                                  success:false,
                                  message:"User profile for the team member not found"
                                });
                              }


                              await memberUserProfile.update({ template_id: null, is_template_assigned: false });








    return res.status(200).json({
      success: true,
      message: "Template Unassigned to member successfully",
      
    });
                                    } catch (err) {
                                      console.error("Error in unAssignTemplateFromMember:", err);
                                      return next(err);
                                    }
                                  },


};

export default TemplateController;
