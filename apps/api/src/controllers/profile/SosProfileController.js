import User from "../../models/User.model.js";
import ProfileType from "../../models/ProfileType.model.js";
import UserProfile from "../../models/UserProfile.model.js";

import SosProfile from "../../models/SosProfile.model.js";
import SosProfileCustomization from "../../models/SosProfileCustomization.model.js";
import SosAddress from "../../models/SosAddress.model.js";
import SosContactsCustomization from "../../models/SosContactsCustomization.model.js";
import SosDoctorsContact from "../../models/SosDoctorsContact.model.js";
import SosEmergencyContact from "../../models/SosEmergencyContact.model.js";
import SosMedicalCustomization from "../../models/SosMedicalCustomization.model.js";
import SosMedicalDetail from "../../models/SosMedicalDetail.model.js";
import SosMedicalInsurance from "../../models/SosMedicalInsurance.model.js";

import { Op } from "sequelize";
import { SERVER_URL_NORMALIZED } from "../../config/index.js";


const SosProfileController = {
getMySosProfile: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

     const user = await User.findByPk(userId, {
  attributes: { exclude: ['password'] }
});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    let sosProfileCustomization;

    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });

      sosProfileCustomization = await SosProfileCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(sosProfile.id),
        layout: "LIST",
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) {
        return res.status(500).json({ message: "Corrupted SOS profile" });
      }

      sosProfileCustomization =
        (await SosProfileCustomization.findOne({
          where: { user_profile_id: userProfile.id },
        })) ||
        (await SosProfileCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: String(sosProfile.id),
          layout: "LIST",
        }));
    }

    const sosContactsCustomization =
      (await SosContactsCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      })) ||
      (await SosContactsCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(sosProfile.id),
      }));

    const sosMedicalCustomization =
      (await SosMedicalCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      })) ||
      (await SosMedicalCustomization.create({
        user_profile_id: userProfile.id,
      }));

    const emergencyContacts = await SosEmergencyContact.findAll({
      where: { user_profile_id: userProfile.id },
    });

    const doctorsContacts = await SosDoctorsContact.findAll({
      where: { user_profile_id: userProfile.id },
    });

    const addresses = await SosAddress.findAll({
      where: { user_profile_id: userProfile.id },
    });

    const medicalDetails = await SosMedicalDetail.findAll({
      where: { user_profile_id: userProfile.id },
    });

    const medicalInsurances = await SosMedicalInsurance.findAll({
      where: { user_profile_id: userProfile.id },
    });

    const profileJson = sosProfile.toJSON();
    const cjson = sosProfileCustomization.toJSON();
    const customizationWithServer = {
      ...cjson,
      background_image: cjson.background_image
        ? `${SERVER_URL_NORMALIZED}${cjson.background_image.startsWith("/") ? "" : "/"}${cjson.background_image}`
        : null,
    };

    return res.json({
      user,
      profile: {
        ...profileJson,
        profile_image: profileJson.profile_image
          ? `${SERVER_URL_NORMALIZED}${profileJson.profile_image.startsWith("/") ? "" : "/"}${profileJson.profile_image}`
          : null,
      },
      userProfile,
      customization: customizationWithServer,
      sosContactsCustomization,
      emergencyContacts,
      doctorsContacts,
      addresses,
      sosMedicalCustomization,
      medicalDetails,
      medicalInsurances,
    });
  } catch (err) {
    console.error("Error in getMySosProfile:", err);
    return next(err);
  }
},


updateMySosProfile: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new Error("Unauthorized: user not found"));

    // 1) Fetch User
    const user = await User.findByPk(userId);
    if (!user) return next(new Error("User not found"));

    // 2) Ensure SOS ProfileType exists
    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    // 3) Find or create UserProfile + SosProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;

    if (!userProfile) {
      const [firstNameFromFull, ...rest] = (user.full_name || "").split(" ");
      const lastNameFromFull = rest.join(" ") || null;

      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name || firstNameFromFull || null,
        last_name: user.last_name || lastNameFromFull || null,
        username: user.username || null,
        gender: null,
        dob: null,
        height: null,
        weight: null,
        blood_group: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return next(new Error("Corrupted profile: missing SosProfile"));
    }

    // 4) Update SosProfile fields
    const allowedProfileFields = [
      "first_name",
      "last_name",
      "username",
      "gender",
      "dob",
      "height",
      "weight",
      "blood_group",
      "important_note",
      "note_is_pinned",
      "profile_image",
    ];

    const profileUpdates = {};

    const profileFile = req.files?.profilePicture?.[0];

   if (profileFile) {
  profileUpdates.profile_image = `/uploads/profile/${profileFile.filename}`;
  }    
     
  for (const key of allowedProfileFields) {
      if (req.body[key] !== undefined) profileUpdates[key] = req.body[key];
    }

    // Normalize empty strings -> null
    ["first_name","last_name","username","gender","dob","blood_group","profile_image"].forEach(k => {
      if (profileUpdates[k] === "") profileUpdates[k] = null;
    });

    await sosProfile.update(profileUpdates);

    // 5) Handle SosProfileCustomization
    let customization = await SosProfileCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!customization) {
      customization = await SosProfileCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(sosProfile.id),
        about_text_color: "#ffffff",
        font_family: "inter",
        font_size: 12,
        background_color: "#000000",
        background_image: null,
        background_blur: 0,
        layout: "LIST",
      });
    }

    const allowedCustomizationFields = [
      "about_text_color",
      "font_family",
      "font_size",
      "background_color",
      "background_blur",
      "layout",
    ];

    const customizationUpdates = {};
    for (const key of allowedCustomizationFields) {
      if (req.body[key] !== undefined) customizationUpdates[key] = req.body[key];
    }

    const backgroundFile = req.files?.backgroundImage?.[0];
    if (backgroundFile) {
  customizationUpdates.background_image = `/uploads/background/${backgroundFile.filename}`;
}

    // Normalize numeric fields
    if (customizationUpdates.font_size !== undefined) {
      const n = Number(customizationUpdates.font_size);
      if (Number.isNaN(n) || n <= 0) return next(new Error("font_size must be positive"));
      customizationUpdates.font_size = n;
    }

    if (customizationUpdates.background_blur !== undefined) {
      const n = Number(customizationUpdates.background_blur);
      if (Number.isNaN(n) || n < 0) return next(new Error("background_blur must be >= 0"));
      customizationUpdates.background_blur = n;
    }

    await customization.update(customizationUpdates);

    // 6) Prepare response
    const profileJSON = sosProfile.toJSON();
    const customizationJSON = customization.toJSON();

    const profileWithServer = {
      ...profileJSON,
      profile_image: profileJSON.profile_image
        ? `${SERVER_URL_NORMALIZED}${profileJSON.profile_image.startsWith("/") ? "" : "/"}${profileJSON.profile_image}`
        : null,
    };

    const customizationWithServer = {
      ...customizationJSON,
      background_image: customizationJSON.background_image
        ? `${SERVER_URL_NORMALIZED}${customizationJSON.background_image.startsWith("/") ? "" : "/"}${customizationJSON.background_image}`
        : null,
    };

    return res.json({
      message: "SOS profile updated successfully",
      profile: profileWithServer,
      userProfile,
      customization: customizationWithServer,
    });
  } catch (err) {
    console.error("Error in updateMySosProfile:", err);
    return next(err);
  }
},

// NOTE: This function is currently unused.
getMySosProfileCustomization: async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new HttpError(401, "Unauthorized: user not found"));
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) return next(new HttpError(404, "User not found"));

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      // Create default SOS profile + userProfile
      const [firstNameFromFull, ...rest] = (user.full_name || "").split(" ");
      const lastNameFromFull = rest.join(" ") || null;

      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name || firstNameFromFull || null,
        last_name: user.last_name || lastNameFromFull || null,
        username: user.username || null,
        gender: null,
        dob: null,
        height: null,
        weight: null,
        blood_group: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return next(new HttpError(500, "Corrupted profile: missing SosProfile"));
    }

    let customization = await SosProfileCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!customization) {
      customization = await SosProfileCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(sosProfile.id),
        about_text_color: "#000000",
        font_family: "system",
        font_size: 16,
        background_color: "#ffffff",
        background_image: null,
        background_blur: 0,
        layout: "LIST",
      });
    }

    const cjson = customization.toJSON();
    const customizationWithServer = {
      ...cjson,
      background_image: cjson.background_image
        ? `${SERVER_URL_NORMALIZED}${cjson.background_image.startsWith("/") ? "" : "/"}${cjson.background_image}`
        : null,
    };

    return res.json({
      userProfile,
      customization: customizationWithServer,
    });
  } catch (err) {
    console.error("Error in getMySosProfileCustomization:", err);
    return next(err);
  }
},

updateMySosProfileCustomization: async (req, res, next) => {
    const userId = req.user?.id;

    if (!userId) return next(new Error("Unauthorized: user not found"));

    try {
      const user = await User.findByPk(userId);
      if (!user) return next(new Error("User not found"));

      let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
      if (!sosType) {
        sosType = await ProfileType.create({
          type: "SOS",
          category: "RESCUE_ID",
          name: "SOS Profile",
          description: "Default SOS profile type",
        });
      }

      let userProfile = await UserProfile.findOne({
        where: { user_id: userId, profile_type_id: sosType.id },
      });

      let sosProfile;
      if (!userProfile) {
        const [firstNameFromFull, ...rest] = (user.full_name || "").split(" ");
        const lastNameFromFull = rest.join(" ") || null;

        sosProfile = await SosProfile.create({
          user_id: userId,
          first_name: user.first_name || firstNameFromFull || null,
          last_name: user.last_name || lastNameFromFull || null,
          username: user.username || null,
          gender: null,
          dob: null,
          height: null,
          weight: null,
          blood_group: null,
          important_note: null,
          note_is_pinned: false,
          profile_image: null,
        });

        userProfile = await UserProfile.create({
          user_id: userId,
          profile_type_id: sosType.id,
          profile_id: sosProfile.id,
          profile_type_name: "SOS Profile",
          role: "OWNER",
          is_primary: false,
          is_active: true,
        });
      } else {
        sosProfile = await SosProfile.findByPk(userProfile.profile_id);
        if (!sosProfile) return next(new Error("Corrupted profile: missing SosProfile"));
      }

      let customization = await SosProfileCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      });

      if (!customization) {
        customization = await SosProfileCustomization.create({
          user_profile_id: userProfile.id,
          profile_id: String(sosProfile.id),
          about_text_color: "#000000",
          font_family: "system",
          font_size: 16,
          background_color: "#ffffff",
          background_image: null,
          background_blur: 0,
          layout: "LIST",
        });
      }

      const allowedFields = [
        "about_text_color",
        "font_family",
        "font_size",
        "background_color",
        "background_blur",
        "layout",
      ];

      const updates = {};
      for (const key of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
          updates[key] = req.body[key];
        }
      }

      // Handle uploaded background image
      if (req.file) {
        updates.background_image = `/uploads/background/${req.file.filename}`;
      }

      // Normalize numeric fields
      if (updates.font_size !== undefined && updates.font_size !== null) {
        const n = Number(updates.font_size);
        if (Number.isNaN(n) || n <= 0) return next(new Error("font_size must be positive"));
        updates.font_size = n;
      }

      if (updates.background_blur !== undefined && updates.background_blur !== null) {
        const n = Number(updates.background_blur);
        if (Number.isNaN(n) || n < 0) return next(new Error("background_blur must be >= 0"));
        updates.background_blur = n;
      }

      await customization.update(updates);

      const cjson = customization.toJSON();
      const customizationWithServer = {
        ...cjson,
        background_image: cjson.background_image
          ? `${SERVER_URL_NORMALIZED}${cjson.background_image.startsWith("/") ? "" : "/"}${cjson.background_image}`
          : null,
      };

      return res.json({
        message: "SOS profile customization updated successfully",
        userProfile,
        customization: customizationWithServer,
      });
 } catch (err) {
  console.error("FULL ERROR:", err);
  console.error("STACK:", err.stack);
  return res.status(500).json({
    success: false,
    message: err.message,
  });


    }
  },

getMySosContacts: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return res.status(500).json({ message: "Corrupted profile: missing SosProfile" });
    }

    const sosContactsCustomization =
      (await SosContactsCustomization.findOne({ where: { user_profile_id: userProfile.id } })) ||
      (await SosContactsCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(sosProfile.id),
      }));

    const emergencyContacts = await SosEmergencyContact.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"], ["id", "ASC"]],
    });

    const doctorsContacts = await SosDoctorsContact.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"], ["id", "ASC"]],
    });

    const addresses = await SosAddress.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"], ["id", "ASC"]],
    });

    return res.json({
      userProfile,
      sosContactsCustomization,
      emergencyContacts,
      doctorsContacts,
      addresses,
    });
  } catch (err) {
    console.error("Error in getMySosContacts:", err);
    return next(err);
  }
},

createMySosEmergencyContact: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return res.status(500).json({ message: "Corrupted profile: missing SosProfile" });
    }

    const { contact_name, phone_number, whatsapp_number } = req.body;

    if (!contact_name || !String(contact_name).trim()) {
      return res.status(400).json({ message: "contact_name is required" });
    }

    const maxSeq = await SosEmergencyContact.max("sequence", {
      where: { user_profile_id: userProfile.id },
    });
    const nextSeq = (Number.isFinite(maxSeq) ? maxSeq : 0) + 1;

    const created = await SosEmergencyContact.create({
      user_profile_id: userProfile.id,
      profile_id: String(sosProfile.id),
      contact_name: String(contact_name).trim(),
      phone_number: phone_number ?? null,
      whatsapp_number: whatsapp_number ?? null,
      sequence: nextSeq,
      // is_visible defaults to true via model
    });

    return res.status(201).json({ message: "Emergency contact created", contact: created });
  } catch (err) {
    console.error("Error in createMySosEmergencyContact:", err);
    return next(err);
  }
},

createMySosDoctorContact: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return res.status(500).json({ message: "Corrupted profile: missing SosProfile" });
    }

    const { doctor_name, phone_number, whatsapp_number } = req.body;

    if (!doctor_name || !String(doctor_name).trim()) {
      return res.status(400).json({ message: "doctor_name is required" });
    }

    const maxSeq = await SosDoctorsContact.max("sequence", {
      where: { user_profile_id: userProfile.id },
    });
    const nextSeq = (Number.isFinite(maxSeq) ? maxSeq : 0) + 1;

    const created = await SosDoctorsContact.create({
      user_profile_id: userProfile.id,
      profile_id: String(sosProfile.id),
      doctor_name: String(doctor_name).trim(),
      phone_number: phone_number ?? null,
      whatsapp_number: whatsapp_number ?? null,
      sequence: nextSeq,
    });

    return res.status(201).json({ message: "Doctor contact created", contact: created });
  } catch (err) {
    console.error("Error in createMySosDoctorContact:", err);
    return next(err);
  }
},

createMySosAddress: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return res.status(500).json({ message: "Corrupted profile: missing SosProfile" });
    }

    const {
      address_description,
      street_number,
      house_number,
      zipcode,
      country,
      city,
    } = req.body;

    const maxSeq = await SosAddress.max("sequence", {
      where: { user_profile_id: userProfile.id },
    });
    const nextSeq = (Number.isFinite(maxSeq) ? maxSeq : 0) + 1;

    const created = await SosAddress.create({
      user_profile_id: userProfile.id,
      profile_id: String(sosProfile.id),
      address_description: address_description ?? null,
      street_number: street_number ?? null,
      house_number: house_number ?? null,
      zipcode: zipcode ?? null,
      country: country ?? null,
      city: city ?? null,
      sequence: nextSeq,
    });

    return res.status(201).json({ message: "Address created", address: created });
  } catch (err) {
    console.error("Error in createMySosAddress:", err);
    return next(err);
  }
},

updateMySosContactsVisibility: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const type = req.params.type; // emergency | doctor | address
    const { contacts } = req.body; // [{ id: 1, is_visible: true }, ...]

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return res.status(400).json({
        message: "contacts must be a non-empty array of { id, is_visible } objects",
      });
    }

    // Validate each item
    for (const item of contacts) {
      if (typeof item.id !== "number") {
        return res.status(400).json({ message: "Each contact must include a numeric id" });
      }
      if (typeof item.is_visible !== "boolean") {
        return res.status(400).json({ message: "Each contact must include a boolean is_visible" });
      }
    }

    // Determine model
    let Model;
    if (type === "emergency") Model = SosEmergencyContact;
    else if (type === "doctor") Model = SosDoctorsContact;
    else if (type === "address") Model = SosAddress;
    else return res.status(400).json({ message: "Invalid type. Use emergency|doctor|address" });

    // Fetch SOS profile
    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });
    if (!userProfile) return res.status(404).json({ message: "SOS profile not found" });

    // Fetch existing records
    const existingRecords = await Model.findAll({
      where: { user_profile_id: userProfile.id },
    });
    const existingIds = existingRecords.map((r) => r.id);

    // Ensure all IDs match
    const missingInRequest = existingIds.filter((id) => !contacts.some((c) => c.id === id));
    const unknownIds = contacts.map((c) => c.id).filter((id) => !existingIds.includes(id));

    if (missingInRequest.length > 0 || unknownIds.length > 0) {
      return res.status(400).json({
        message: "contacts array must contain exactly all IDs for this profile",
        missing_ids: missingInRequest,
        unknown_ids: unknownIds,
      });
    }

    // Bulk update
    const recordMap = new Map(existingRecords.map((r) => [r.id, r]));
    const updates = [];

    contacts.forEach((item) => {
      const record = recordMap.get(item.id);
      if (record && record.is_visible !== item.is_visible) {
        record.is_visible = item.is_visible;
        updates.push(record.save());
      }
    });

    await Promise.all(updates);

    const updatedRecords = await Model.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"]],
    });

    return res.json({
      message: "Contacts visibility updated successfully",
      records: updatedRecords,
    });
  } catch (err) {
    console.error("Error in updateMySosContactsVisibility:", err);
    return next(err);
  } 
},

editMySosContactById: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const type = req.params.type; // emergency | doctor | address
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    if (!userProfile) return res.status(404).json({ message: "SOS profile not found" });

    let Model;
    let allowedFields = [];

    if (type === "emergency") {
      Model = SosEmergencyContact;
      allowedFields = ["contact_name", "phone_number", "whatsapp_number"];
    } else if (type === "doctor") {
      Model = SosDoctorsContact;
      allowedFields = ["doctor_name", "phone_number", "whatsapp_number"];
    } else if (type === "address") {
      Model = SosAddress;
      allowedFields = ["address_description", "street_number", "house_number", "zipcode", "country", "city"];
    } else {
      return res.status(400).json({ message: "Invalid type. Use emergency|doctor|address" });
    }

    const record = await Model.findOne({ where: { id, user_profile_id: userProfile.id } });
    if (!record) return res.status(404).json({ message: "Record not found" });

    const updates = {};
    for (const k of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) updates[k] = req.body[k];
    }

    if (type === "emergency" && updates.contact_name !== undefined) {
      if (!String(updates.contact_name).trim()) return res.status(400).json({ message: "contact_name cannot be empty" });
      updates.contact_name = String(updates.contact_name).trim();
    }

    if (type === "doctor" && updates.doctor_name !== undefined) {
      if (!String(updates.doctor_name).trim()) return res.status(400).json({ message: "doctor_name cannot be empty" });
      updates.doctor_name = String(updates.doctor_name).trim();
    }

    await record.update(updates);

    return res.json({ message: "Updated successfully", record });
  } catch (err) {
    console.error("Error in editMySosContactById:", err);
    return next(err);
  }
},

deleteMySosContactById: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const type = req.params.type; // emergency | doctor | address
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    if (!userProfile) return res.status(404).json({ message: "SOS profile not found" });

    let Model;
    if (type === "emergency") Model = SosEmergencyContact;
    else if (type === "doctor") Model = SosDoctorsContact;
    else if (type === "address") Model = SosAddress;
    else return res.status(400).json({ message: "Invalid type. Use emergency|doctor|address" });

    const deleted = await Model.destroy({ where: { id, user_profile_id: userProfile.id } });
    if (!deleted) return res.status(404).json({ message: "Record not found" });

    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error in deleteMySosContactById:", err);
    return next(err);
  }
},

getMySosContactsCustomization: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) {
        return res.status(500).json({ message: "Corrupted profile: missing SosProfile" });
      }
    }

    let customization = await SosContactsCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!customization) {
      customization = await SosContactsCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(sosProfile.id),
      });
    }

    return res.json({
      userProfile,
      sosContactsCustomization: customization,
    });
  } catch (err) {
    console.error("Error in getMySosContactsCustomization:", err);
    return next(err);
  }
},

updateMySosContactsCustomization: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return res.status(500).json({ message: "Corrupted profile: missing SosProfile" });
    }

    const customization =
      (await SosContactsCustomization.findOne({ where: { user_profile_id: userProfile.id } })) ||
      (await SosContactsCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(sosProfile.id),
      }));

    const allowedFields = [
      "title_color",
      "background_color",
      "header_color",
      "body_color",
      "contact_btn_enabled",
    ];

    const updates = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    // Normalize empty strings -> null for color fields
    const nullIfEmpty = ["title_color", "background_color", "header_color", "body_color"];
    for (const k of nullIfEmpty) {
      if (updates[k] === "") updates[k] = null;
    }

    // If boolean is provided as "true"/"false" string, normalize
    if (updates.contact_btn_enabled !== undefined) {
      if (typeof updates.contact_btn_enabled === "string") {
        updates.contact_btn_enabled = updates.contact_btn_enabled.toLowerCase() === "true";
      } else {
        updates.contact_btn_enabled = Boolean(updates.contact_btn_enabled);
      }
    }

    updates.updated_at = new Date();

    await customization.update(updates);

    return res.json({
      message: "SOS contacts customization updated successfully",
      userProfile,
      sosContactsCustomization: customization,
    });
  } catch (err) {
    console.error("Error in updateMySosContactsCustomization:", err);
    return next(err);
  }
},

getMySosMedicalInformation: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return res.status(500).json({ message: "Corrupted profile: missing SosProfile" });
    }

    const sosMedicalCustomization =
      (await SosMedicalCustomization.findOne({ where: { user_profile_id: userProfile.id } })) ||
      (await SosMedicalCustomization.create({ user_profile_id: userProfile.id }));

    // insurance: there can be only one (0 or 1 row)
    const medicalInsurance = await SosMedicalInsurance.findOne({
      where: { user_profile_id: userProfile.id },
    });

    const medicalDetails = await SosMedicalDetail.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"], ["id", "ASC"]],
    });

    return res.json({
      userProfile,
      sosMedicalCustomization,
      medicalInsurance, // may be null if not created yet
      medicalDetails,
    });
  } catch (err) {
    console.error("Error in getMySosMedicalInformation:", err);
    return next(err);
  }
},


createMySosMedicalDetail: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return res.status(500).json({ message: "Corrupted profile: missing SosProfile" });
    }

    const { disease_name, disease_detail } = req.body;

    if (!disease_name || !String(disease_name).trim()) {
      return res.status(400).json({ message: "disease_name is required" });
    }

    const maxSeq = await SosMedicalDetail.max("sequence", {
      where: { user_profile_id: userProfile.id },
    });
    const nextSeq = (Number.isFinite(maxSeq) ? maxSeq : 0) + 1;

    const created = await SosMedicalDetail.create({
      user_profile_id: userProfile.id,
      disease_name: String(disease_name).trim(),
      disease_detail: disease_detail ?? null,
      sequence: nextSeq,
      // is_visible defaults true
    });

    return res.status(201).json({ message: "Medical detail created", medicalDetail: created });
  } catch (err) {
    console.error("Error in createMySosMedicalDetail:", err);
    return next(err);
  }
},

updateMySosMedicalDetailsSequenceVisibility: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const { details } = req.body; // [{ id: 1, sequence: 1, is_visible: true }, ...]

    if (!Array.isArray(details) || details.length === 0) {
      return res.status(400).json({ message: "details must be a non-empty array of { id, sequence?, is_visible? } objects" });
    }

    // Validate each item
    for (const item of details) {
      if (typeof item.id !== "number") {
        return res.status(400).json({ message: "Each detail must include a numeric id" });
      }
      if (item.sequence !== undefined && (typeof item.sequence !== "number" || item.sequence <= 0)) {
        return res.status(400).json({ message: "sequence must be a positive number if provided" });
      }
      if (item.is_visible !== undefined && typeof item.is_visible !== "boolean") {
        return res.status(400).json({ message: "is_visible must be boolean if provided" });
      }
    }

    // Fetch SOS profile
    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });
    if (!userProfile) return res.status(404).json({ message: "SOS profile not found" });

    // Fetch existing medical details
    const existingDetails = await SosMedicalDetail.findAll({
      where: { user_profile_id: userProfile.id },
    });

    const existingIds = existingDetails.map((d) => d.id);

    // Validate that all IDs match exactly
    const missingInRequest = existingIds.filter((id) => !details.some((d) => d.id === id));
    const unknownIds = details.map((d) => d.id).filter((id) => !existingIds.includes(id));

    if (missingInRequest.length > 0 || unknownIds.length > 0) {
      return res.status(400).json({
        message: "details array must contain exactly all medical detail IDs for this profile",
        missing_ids: missingInRequest,
        unknown_ids: unknownIds,
      });
    }

    // Map existing details by ID
    const detailMap = new Map(existingDetails.map((d) => [d.id, d]));
    const updates = [];

    details.forEach((item) => {
      const detail = detailMap.get(item.id);
      if (detail) {
        let mustUpdate = false;

        if (item.sequence !== undefined && detail.sequence !== item.sequence) {
          detail.sequence = item.sequence;
          mustUpdate = true;
        }

        if (item.is_visible !== undefined && detail.is_visible !== item.is_visible) {
          detail.is_visible = item.is_visible;
          mustUpdate = true;
        }

        if (mustUpdate) updates.push(detail.save());
      }
    });

    await Promise.all(updates);

    const updatedDetails = await SosMedicalDetail.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"]],
    });

    return res.json({
      message: "Medical details updated successfully",
      medicalDetails: updatedDetails,
    });
  } catch (err) {
    console.error("Error in updateMySosMedicalDetailsSequenceVisibility:", err);
    return next(err);
  }
},


editMySosMedicalDetailById: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });
    if (!userProfile) return res.status(404).json({ message: "SOS profile not found" });

    const detail = await SosMedicalDetail.findOne({
      where: { id, user_profile_id: userProfile.id },
    });
    if (!detail) return res.status(404).json({ message: "Medical detail not found" });

    const allowedFields = ["disease_name", "disease_detail"];
    const updates = {};
    for (const k of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) updates[k] = req.body[k];
    }

    if (updates.disease_name !== undefined) {
      if (!String(updates.disease_name).trim()) return res.status(400).json({ message: "disease_name cannot be empty" });
      updates.disease_name = String(updates.disease_name).trim();
    }

    await detail.update(updates);

    return res.json({ message: "Updated successfully", medicalDetail: detail });
  } catch (err) {
    console.error("Error in editMySosMedicalDetailById:", err);
    return next(err);
  }
},

deleteMySosMedicalDetailById: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });
    if (!userProfile) return res.status(404).json({ message: "SOS profile not found" });

    const deleted = await SosMedicalDetail.destroy({
      where: { id, user_profile_id: userProfile.id },
    });

    if (!deleted) return res.status(404).json({ message: "Medical detail not found" });

    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error in deleteMySosMedicalDetailById:", err);
    return next(err);
  }
},

updateMySosMedicalInsurance: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return res.status(500).json({ message: "Corrupted profile: missing SosProfile" });
    }

    const { insurance_company, insurance_id } = req.body;

    if (!insurance_company || !String(insurance_company).trim()) {
      return res.status(400).json({ message: "insurance_company is required" });
    }
    if (!insurance_id || !String(insurance_id).trim()) {
      return res.status(400).json({ message: "insurance_id is required" });
    }

    let insurance = await SosMedicalInsurance.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!insurance) {
      insurance = await SosMedicalInsurance.create({
        user_profile_id: userProfile.id,
        insurance_company: String(insurance_company).trim(),
        insurance_id: String(insurance_id).trim(),
      });
    } else {
      await insurance.update({
        insurance_company: String(insurance_company).trim(),
        insurance_id: String(insurance_id).trim(),
      });
    }

    return res.json({ message: "Medical insurance updated successfully", medicalInsurance: insurance });
  } catch (err) {
    console.error("Error in updateMySosMedicalInsurance:", err);
    return next(err);
  }
},

updateMySosMedicalCustomization: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return res.status(500).json({ message: "Corrupted profile: missing SosProfile" });
    }

    let customization = await SosMedicalCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!customization) {
      customization = await SosMedicalCustomization.create({
        user_profile_id: userProfile.id,
      });
    }

    const allowedFields = ["header_text", "background_color", "header_color", "body_color"];
    const updates = {};

    for (const k of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) updates[k] = req.body[k];
    }

    // normalize empty string -> null for text/colors
    for (const k of allowedFields) {
      if (updates[k] === "") updates[k] = null;
    }

    await customization.update(updates);

    return res.json({
      message: "SOS medical customization updated successfully",
      userProfile,
      sosMedicalCustomization: customization,
    });
  } catch (err) {
    console.error("Error in updateMySosMedicalCustomization:", err);
    return next(err);
  }
},

getMySosMedicalCustomization: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let sosType = await ProfileType.findOne({ where: { type: "SOS" } });
    if (!sosType) {
      sosType = await ProfileType.create({
        type: "SOS",
        category: "RESCUE_ID",
        name: "SOS Profile",
        description: "Default SOS profile type",
      });
    }

    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: sosType.id },
    });

    let sosProfile;
    if (!userProfile) {
      sosProfile = await SosProfile.create({
        user_id: userId,
        first_name: user.first_name ?? null,
        last_name: user.last_name ?? null,
        username: user.username ?? null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: sosType.id,
        profile_id: sosProfile.id,
        profile_type_name: "SOS Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      sosProfile = await SosProfile.findByPk(userProfile.profile_id);
      if (!sosProfile) return res.status(500).json({ message: "Corrupted profile: missing SosProfile" });
    }

    let customization = await SosMedicalCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!customization) {
      customization = await SosMedicalCustomization.create({
        user_profile_id: userProfile.id,
      });
    }

    return res.json({ userProfile, sosMedicalCustomization: customization });
  } catch (err) {
    console.error("Error in getMySosMedicalCustomization:", err);
    return next(err);
  }
},



};

export default SosProfileController;
