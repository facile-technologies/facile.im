import User from "../../models/User.model.js";
import ProfileType from "../../models/ProfileType.model.js";
import UserProfile from "../../models/UserProfile.model.js";

import PetProfile from "../../models/PetProfile.model.js";
import PetProfileCustomization from "../../models/PetProfileCustomization.model.js";
import PetAddress from "../../models/PetAddress.model.js";
import PetContactsCustomization from "../../models/PetContactsCustomization.model.js";
import PetDoctorsContact from "../../models/PetDoctorsContact.model.js";
import PetEmergencyContact from "../../models/PetEmergencyContact.model.js";
import PetMedicalCustomization from "../../models/PetMedicalCustomization.model.js";
import PetMedicalDetail from "../../models/PetMedicalDetail.model.js";
import PetMedicalInsurance from "../../models/PetMedicalInsurance.model.js";
import PetIdentification from "../../models/PetIdentification.model.js";



import { Op } from "sequelize";
import { SERVER_URL_NORMALIZED } from "../../config/index.js";

const PetProfileController = {

getMyPetProfile: async (req, res, next) => {
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

    // 1) Ensure PET profile type exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet",
        description: "Pet profile",
      });
    }

    // 2) Find or create userProfile row for PET
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;

    // 3) Create pet profile + userProfile if missing
    if (!userProfile) {
      // PetProfile model fields:
      // user_id, pet_name, gender, age, color, breed, important_note, note_is_pinned, profile_image
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: null,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id, // keep integer id
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) {
        return res.status(500).json({ message: "Corrupted PET profile" });
      }
    }

    // 4) PetProfileCustomization (layout must be ENUM: "LIST" or "CARD")
    const petProfileCustomization =
      (await PetProfileCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      })) ||
      (await PetProfileCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(petProfile.id), // model defines STRING
        layout: "LIST", // ✅ valid: "LIST" | "CARD"
        // other fields optional (allowNull: true) so omitted safely
      }));

    // 5) Module customizations
    const petContactsCustomization =
      (await PetContactsCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      })) ||
      (await PetContactsCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(petProfile.id),
        // optional fields omitted
      }));

    const petMedicalCustomization =
      (await PetMedicalCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      })) ||
      (await PetMedicalCustomization.create({
        user_profile_id: userProfile.id,
        // medical_detail_sequence has defaultValue: 1
        // other fields optional
      }));

    // 6) Collections
    const emergencyContacts = await PetEmergencyContact.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"]],
    });

    const doctorsContacts = await PetDoctorsContact.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"]],
    });

    const addresses = await PetAddress.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"]],
    });

    const medicalDetails = await PetMedicalDetail.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"]],
    });

    const medicalInsurances = await PetMedicalInsurance.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["created_at", "DESC"]],
    });

    // 7) PetIdentification (chipped is required: allowNull:false)
    const petIdentification =
      (await PetIdentification.findOne({
        where: { user_profile_id: userProfile.id },
      })) ||
      (await PetIdentification.create({
        user_profile_id: userProfile.id,
        profile_id: String(petProfile.id),
        chipped: "NO", // ✅ required field
        collar: null,
        special_feature: null,
        header_text: null,
        background_color: null,
        header_color: null,
        body_color: null,
      }));

    const profileJson = petProfile.toJSON();


    const c = petProfileCustomization.toJSON();
    const customizationWithServer = {
      ...c,
      background_image: c.background_image
        ? `${SERVER_URL_NORMALIZED}${c.background_image.startsWith("/") ? "" : "/"}${c.background_image}`
        : null,
    };
    return res.json({
      user,
      profile: {
        ...profileJson,
        profile_image: profileJson.profile_image
          ? `${SERVER_URL_NORMALIZED}${
              profileJson.profile_image.startsWith("/") ? "" : "/"
            }${profileJson.profile_image}`
          : null,
      },
      userProfile,
      customization: customizationWithServer,
      petContactsCustomization,
      emergencyContacts,
      doctorsContacts,
      addresses,
      petMedicalCustomization,
      medicalDetails,
      medicalInsurances,
      petIdentification,
    });
  } catch (err) {
    console.error("Error in getMyPetProfile:", err);
    return next(err);
  }
},

updateMyPetProfile: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new Error("Unauthorized: user not found"));

    // 1) Fetch User
    const user = await User.findByPk(userId);
    if (!user) return next(new Error("User not found"));

    // 2) Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // 3) Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;

    if (!userProfile) {
      // Create default PetProfile (matches PetProfile model)
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) return next(new Error("Corrupted profile: missing PetProfile"));
    }

    
    // 4) PROFILE UPDATE LOGIC
    const allowedProfileFields = [
      "pet_name",
      "gender",
      "age",
      "color",
      "breed",
      "important_note",
      "note_is_pinned",
      "profile_image",
    ];

    const profileUpdates = {};

    // Handle uploaded profile image
    if (req.files?.profilePicture?.[0]) {
     profileUpdates.profile_image = `/uploads/profile/${req.files.profilePicture[0].filename}`;
    }



    // Merge body fields
    for (const key of allowedProfileFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        profileUpdates[key] = req.body[key];
      }
    }

    // Normalize empty strings → null
    const nullIfEmpty = ["pet_name", "gender", "color", "breed", "important_note", "profile_image"];
    for (const k of nullIfEmpty) {
      if (profileUpdates[k] === "") profileUpdates[k] = null;
    }

    // Normalize age
    if (profileUpdates.age !== undefined) {
      if (profileUpdates.age === "" || profileUpdates.age === null) {
        profileUpdates.age = null;
      } else {
        const n = Number(profileUpdates.age);
        if (!Number.isFinite(n) || n < 0) {
          return res.status(400).json({ message: "age must be a non-negative number" });
        }
        profileUpdates.age = Math.trunc(n);
      }
    }

    // Normalize boolean
    if (profileUpdates.note_is_pinned !== undefined) {
      profileUpdates.note_is_pinned =
        String(profileUpdates.note_is_pinned).toLowerCase() === "true";
    }

    await petProfile.update(profileUpdates);

    
    // 5) CUSTOMIZATION (find or create + update)
    
    let customization = await PetProfileCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!customization) {
      customization = await PetProfileCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(petProfile.id),
        about_text_color: "#000000",
        font_family: "system",
        font_size: 16,
        background_color: "#ffffff",
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
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        customizationUpdates[key] = req.body[key];
      }
    }

    // Handle uploaded background image
if (req.files?.backgroundImage?.[0]) {
  customizationUpdates.background_image = `/uploads/background/${req.files.backgroundImage[0].filename}`;
}

    // Normalize empty strings → null
    const nullIfEmptyC = ["about_text_color", "font_family", "background_color", "background_image"];
    for (const k of nullIfEmptyC) {
      if (customizationUpdates[k] === "") customizationUpdates[k] = null;
    }

    // font_size
    if (customizationUpdates.font_size !== undefined) {
      const n = Number(customizationUpdates.font_size);
      if (Number.isNaN(n) || n <= 0) return next(new Error("font_size must be positive"));
      customizationUpdates.font_size = Math.trunc(n);
    }

    // background_blur
    if (customizationUpdates.background_blur !== undefined) {
      const n = Number(customizationUpdates.background_blur);
      if (Number.isNaN(n) || n < 0)
        return next(new Error("background_blur must be >= 0"));
      customizationUpdates.background_blur = Math.trunc(n);
    }

    // layout enum
    if (customizationUpdates.layout) {
      const val = String(customizationUpdates.layout).toUpperCase();
      if (!["LIST", "CARD"].includes(val)) {
        return res.status(400).json({ message: "layout must be LIST or CARD" });
      }
      customizationUpdates.layout = val;
    }

    customizationUpdates.updated_at = new Date();

    await customization.update(customizationUpdates);

    
    //6) RESPONSE (normalized URLs)

    const p = petProfile.toJSON();
    const profile = {
      ...p,
      profile_image: p.profile_image
        ? `${SERVER_URL_NORMALIZED}${p.profile_image.startsWith("/") ? "" : "/"}${p.profile_image}`
        : null,
    };

    const c = customization.toJSON();
    const customizationWithServer = {
      ...c,
      background_image: c.background_image
        ? `${SERVER_URL_NORMALIZED}${c.background_image.startsWith("/") ? "" : "/"}${c.background_image}`
        : null,
    };

    return res.json({
      message: "Pet profile updated successfully",
      profile,
      userProfile,
      customization: customizationWithServer,
    });

  } catch (err) {
    console.error("Error in updateMyPetProfile:", err);
    return next(err);
  }
},

// NOTE: This function is currently unused.
getMyPetProfileCustomization: async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) return next(new Error("Unauthorized: user not found"));

  try {
    const user = await User.findByPk(userId);
    if (!user) return next(new Error("User not found"));

    // 1) Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // 2) Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;

    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) return next(new Error("Corrupted profile: missing PetProfile"));
    }

    // 3) Find-or-create customization
    let customization = await PetProfileCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!customization) {
      customization = await PetProfileCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(petProfile.id),
        about_text_color: "#000000",
        font_family: "system",
        font_size: 16,
        background_color: "#ffffff",
        background_image: null,
        background_blur: 0,
        layout: "LIST", // ✅ valid: "LIST" | "CARD"
      });
    }

    // 4) Normalize background image URL (if you ever store an uploaded image path)
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
    console.error("Error in getMyPetProfileCustomization:", err);
    return next(err);
  }
},

updateMyPetProfileCustomization: async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) return next(new Error("Unauthorized: user not found"));

  try {
    const user = await User.findByPk(userId);
    if (!user) return next(new Error("User not found"));

    // 1) Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // 2) Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;

    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) return next(new Error("Corrupted profile: missing PetProfile"));
    }

    // 3) Find or create customization
    let customization = await PetProfileCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!customization) {
      customization = await PetProfileCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(petProfile.id),
        about_text_color: "#000000",
        font_family: "system",
        font_size: 16,
        background_color: "#ffffff",
        background_image: null,
        background_blur: 0,
        layout: "LIST", // ✅ valid enum value
      });
    }

    // 4) Allowed fields (match PetProfileCustomization.model.js)
    const allowedFields = [
      "about_text_color",
      "font_family",
      "font_size",
      "background_color",
      "background_blur",
      "layout", // ENUM("LIST","CARD")
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

    // Normalize empty strings -> null (for text/colors)
    const nullIfEmpty = ["about_text_color", "font_family", "background_color", "background_image"];
    for (const k of nullIfEmpty) {
      if (updates[k] === "") updates[k] = null;
    }

    // Normalize font_size
    if (updates.font_size !== undefined && updates.font_size !== null) {
      if (updates.font_size === "") {
        updates.font_size = null;
      } else {
        const n = Number(updates.font_size);
        if (Number.isNaN(n) || n <= 0) return next(new Error("font_size must be positive"));
        updates.font_size = Math.trunc(n);
      }
    }

    // Normalize background_blur
    if (updates.background_blur !== undefined && updates.background_blur !== null) {
      if (updates.background_blur === "") {
        updates.background_blur = null;
      } else {
        const n = Number(updates.background_blur);
        if (Number.isNaN(n) || n < 0) return next(new Error("background_blur must be >= 0"));
        updates.background_blur = Math.trunc(n);
      }
    }

    // Validate layout enum if provided
    if (updates.layout !== undefined && updates.layout !== null) {
      const val = String(updates.layout).toUpperCase();
      if (!["LIST", "CARD"].includes(val)) {
        return res.status(400).json({ message: "layout must be LIST or CARD" });
      }
      updates.layout = val;
    }

    updates.updated_at = new Date();

    // 5) Update customization
    await customization.update(updates);

    // 6) Return with full URL for background_image
    const cjson = customization.toJSON();
    const customizationWithServer = {
      ...cjson,
      background_image: cjson.background_image
        ? `${SERVER_URL_NORMALIZED}${cjson.background_image.startsWith("/") ? "" : "/"}${cjson.background_image}`
        : null,
    };

    return res.json({
      message: "Pet profile customization updated successfully",
      userProfile,
      customization: customizationWithServer,
    });
  } catch (err) {
    console.error("Error in updateMyPetProfileCustomization:", err);
    return next(err);
  }
},

getMyPetContacts: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1) Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // 2) Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;

    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) {
        return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
      }
    }

    // 3) Contacts customization (find-or-create)
    const petContactsCustomization =
      (await PetContactsCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      })) ||
      (await PetContactsCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(petProfile.id),
      }));

    // 4) Fetch collections
    const emergencyContacts = await PetEmergencyContact.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"], ["id", "ASC"]],
    });

    const doctorsContacts = await PetDoctorsContact.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"], ["id", "ASC"]],
    });

    const addresses = await PetAddress.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"], ["id", "ASC"]],
    });

    return res.json({
      userProfile,
      petContactsCustomization,
      emergencyContacts,
      doctorsContacts,
      addresses,
    });
  } catch (err) {
    console.error("Error in getMyPetContacts:", err);
    return next(err);
  }
},

createMyPetEmergencyContact: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1) Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // 2) Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;

    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) {
        return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
      }
    }

    // 3) Validate body
    const { contact_name, phone_number, whatsapp_number } = req.body;

    if (!contact_name || !String(contact_name).trim()) {
      return res.status(400).json({ message: "contact_name is required" });
    }

    // 4) Auto-increment sequence
    const maxSeq = await PetEmergencyContact.max("sequence", {
      where: { user_profile_id: userProfile.id },
    });
    const nextSeq = (Number.isFinite(maxSeq) ? maxSeq : 0) + 1;

    // 5) Create
    const created = await PetEmergencyContact.create({
      user_profile_id: userProfile.id,
      profile_id: String(petProfile.id),
      contact_name: String(contact_name).trim(),
      phone_number: phone_number ?? null,
      whatsapp_number: whatsapp_number ?? null,
      sequence: nextSeq,
      // is_visible defaultValue: true in model
    });

    return res.status(201).json({
      message: "Emergency contact created",
      contact: created,
    });
  } catch (err) {
    console.error("Error in createMyPetEmergencyContact:", err);
    return next(err);
  }
},

createMyPetDoctorContact: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1) Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // 2) Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;

    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) {
        return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
      }
    }

    // 3) Validate body
    const { doctor_name, phone_number, whatsapp_number } = req.body;

    if (!doctor_name || !String(doctor_name).trim()) {
      return res.status(400).json({ message: "doctor_name is required" });
    }

    // 4) Auto-increment sequence
    const maxSeq = await PetDoctorsContact.max("sequence", {
      where: { user_profile_id: userProfile.id },
    });
    const nextSeq = (Number.isFinite(maxSeq) ? maxSeq : 0) + 1;

    // 5) Create
    const created = await PetDoctorsContact.create({
      user_profile_id: userProfile.id,
      profile_id: String(petProfile.id),
      doctor_name: String(doctor_name).trim(),
      phone_number: phone_number ?? null,
      whatsapp_number: whatsapp_number ?? null,
      sequence: nextSeq,
      // is_visible defaultValue: true in model
    });

    return res.status(201).json({
      message: "Doctor contact created",
      contact: created,
    });
  } catch (err) {
    console.error("Error in createMyPetDoctorContact:", err);
    return next(err);
  }
},

createMyPetAddress: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1) Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // 2) Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;

    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) {
        return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
      }
    }

    // 3) Extract body
    const {
      address_description,
      street_number,
      house_number,
      zipcode,
      country,
      city,
    } = req.body;

    // 4) Auto-increment sequence
    const maxSeq = await PetAddress.max("sequence", {
      where: { user_profile_id: userProfile.id },
    });
    const nextSeq = (Number.isFinite(maxSeq) ? maxSeq : 0) + 1;

    // 5) Create address
    const created = await PetAddress.create({
      user_profile_id: userProfile.id,
      profile_id: String(petProfile.id),
      address_description: address_description ?? null,
      street_number: street_number ?? null,
      house_number: house_number ?? null,
      zipcode: zipcode ?? null,
      country: country ?? null,
      city: city ?? null,
      sequence: nextSeq,
      // is_visible defaults to true
    });

    return res.status(201).json({
      message: "Address created",
      address: created,
    });
  } catch (err) {
    console.error("Error in createMyPetAddress:", err);
    return next(err);
  }
},

updateMyPetContactsVisibility: async (req, res, next) => {
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

    // Validate payload
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
    if (type === "emergency") Model = PetEmergencyContact;
    else if (type === "doctor") Model = PetDoctorsContact;
    else if (type === "address") Model = PetAddress;
    else {
      return res.status(400).json({ message: "Invalid type. Use emergency|doctor|address" });
    }

    // Ensure PET profile exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });
    if (!userProfile) {
      return res.status(404).json({ message: "Pet profile not found" });
    }

    // Fetch existing records
    const existingRecords = await Model.findAll({
      where: { user_profile_id: userProfile.id },
    });

    const existingIds = existingRecords.map((r) => r.id);

    // Ensure request contains exactly all IDs for this profile
    const missingInRequest = existingIds.filter((id) => !contacts.some((c) => c.id === id));
    const unknownIds = contacts.map((c) => c.id).filter((id) => !existingIds.includes(id));

    if (missingInRequest.length > 0 || unknownIds.length > 0) {
      return res.status(400).json({
        message: "contacts array must contain exactly all IDs for this profile",
        missing_ids: missingInRequest,
        unknown_ids: unknownIds,
      });
    }

    // Bulk update only changed rows
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
      order: [["sequence", "ASC"], ["id", "ASC"]],
    });

    return res.json({
      message: "Contacts visibility updated successfully",
      records: updatedRecords,
    });
  } catch (err) {
    console.error("Error in updateMyPetContactsVisibility:", err);
    return next(err);
  }
},

editMyPetContactById: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const type = req.params.type; // emergency | doctor | address
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    // Ensure PET profile type exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });
    if (!userProfile) return res.status(404).json({ message: "Pet profile not found" });

    // Pick model + allowed fields
    let Model;
    let allowedFields = [];

    if (type === "emergency") {
      Model = PetEmergencyContact;
      allowedFields = ["contact_name", "phone_number", "whatsapp_number"];
    } else if (type === "doctor") {
      Model = PetDoctorsContact;
      allowedFields = ["doctor_name", "phone_number", "whatsapp_number"];
    } else if (type === "address") {
      Model = PetAddress;
      allowedFields = [
        "address_description",
        "street_number",
        "house_number",
        "zipcode",
        "country",
        "city",
      ];
    } else {
      return res.status(400).json({ message: "Invalid type. Use emergency|doctor|address" });
    }

    // Find record belonging to this user_profile
    const record = await Model.findOne({
      where: { id, user_profile_id: userProfile.id },
    });
    if (!record) return res.status(404).json({ message: "Record not found" });

    // Apply updates
    const updates = {};
    for (const k of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) {
        updates[k] = req.body[k];
      }
    }

    // Validate required name fields if provided
    if (type === "emergency" && updates.contact_name !== undefined) {
      if (!String(updates.contact_name).trim()) {
        return res.status(400).json({ message: "contact_name cannot be empty" });
      }
      updates.contact_name = String(updates.contact_name).trim();
    }

    if (type === "doctor" && updates.doctor_name !== undefined) {
      if (!String(updates.doctor_name).trim()) {
        return res.status(400).json({ message: "doctor_name cannot be empty" });
      }
      updates.doctor_name = String(updates.doctor_name).trim();
    }

    await record.update(updates);

    return res.json({ message: "Updated successfully", record });
  } catch (err) {
    console.error("Error in editMyPetContactById:", err);
    return next(err);
  }
},

deleteMyPetContactById: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const type = req.params.type; // emergency | doctor | address
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    // Ensure PET profile type exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });
    if (!userProfile) return res.status(404).json({ message: "Pet profile not found" });

    // Pick model
    let Model;
    if (type === "emergency") Model = PetEmergencyContact;
    else if (type === "doctor") Model = PetDoctorsContact;
    else if (type === "address") Model = PetAddress;
    else return res.status(400).json({ message: "Invalid type. Use emergency|doctor|address" });

    const deleted = await Model.destroy({
      where: { id, user_profile_id: userProfile.id },
    });

    if (!deleted) return res.status(404).json({ message: "Record not found" });

    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error in deleteMyPetContactById:", err);
    return next(err);
  }
},

getMyPetContactsCustomization: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure PET profile type exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;
    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
    }

    // Find-or-create customization
    let customization = await PetContactsCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!customization) {
      customization = await PetContactsCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(petProfile.id),
      });
    }

    return res.json({
      userProfile,
      petContactsCustomization: customization,
    });
  } catch (err) {
    console.error("Error in getMyPetContactsCustomization:", err);
    return next(err);
  }
},

updateMyPetContactsCustomization: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure PET profile type exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;
    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
    }

    // Find-or-create customization
    const customization =
      (await PetContactsCustomization.findOne({ where: { user_profile_id: userProfile.id } })) ||
      (await PetContactsCustomization.create({
        user_profile_id: userProfile.id,
        profile_id: String(petProfile.id),
      }));

    // Allowed fields (match PetContactsCustomization.model.js)
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

    // Normalize boolean (may arrive as "true"/"false")
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
      message: "Pet contacts customization updated successfully",
      userProfile,
      petContactsCustomization: customization,
    });
  } catch (err) {
    console.error("Error in updateMyPetContactsCustomization:", err);
    return next(err);
  }
},

getMyPetMedicalInformation: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1) Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // 2) Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;

    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) {
        return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
      }
    }

    // 3) Medical customization (find-or-create)
    const petMedicalCustomization =
      (await PetMedicalCustomization.findOne({
        where: { user_profile_id: userProfile.id },
      })) ||
      (await PetMedicalCustomization.create({
        user_profile_id: userProfile.id,
      }));

    // 4) Insurance: your PetMedicalInsurance model supports multiple rows,
    // but SOS "medicalInformation" endpoint returns either one row or many.
    // We'll return MANY to match your earlier getMyPetProfile usage.
    const medicalInsurances = await PetMedicalInsurance.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["created_at", "DESC"]],
    });

    // 5) Medical details
    const medicalDetails = await PetMedicalDetail.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"], ["id", "ASC"]],
    });

    return res.json({
      userProfile,
      petMedicalCustomization,
      medicalInsurances,
      medicalDetails,
    });
  } catch (err) {
    console.error("Error in getMyPetMedicalInformation:", err);
    return next(err);
  }
},

createMyPetMedicalDetail: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1) Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // 2) Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;
    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) {
        return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
      }
    }

    // 3) Validate body
    const { disease_name, disease_detail } = req.body;

    if (!disease_name || !String(disease_name).trim()) {
      return res.status(400).json({ message: "disease_name is required" });
    }

    // 4) Auto-increment sequence
    const maxSeq = await PetMedicalDetail.max("sequence", {
      where: { user_profile_id: userProfile.id },
    });
    const nextSeq = (Number.isFinite(maxSeq) ? maxSeq : 0) + 1;

    // 5) Create
    const created = await PetMedicalDetail.create({
      user_profile_id: userProfile.id,
      disease_name: String(disease_name).trim(),
      disease_detail: disease_detail ?? null,
      sequence: nextSeq,
      // is_visible defaults true in model
    });

    return res.status(201).json({
      message: "Medical detail created",
      medicalDetail: created,
    });
  } catch (err) {
    console.error("Error in createMyPetMedicalDetail:", err);
    return next(err);
  }
},

updateMyPetMedicalDetailsSequenceVisibility: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const { details } = req.body; // [{ id: 1, sequence: 1, is_visible: true }, ...]

    if (!Array.isArray(details) || details.length === 0) {
      return res.status(400).json({
        message:
          "details must be a non-empty array of { id, sequence?, is_visible? } objects",
      });
    }

    // Validate each item
    for (const item of details) {
      if (typeof item.id !== "number") {
        return res.status(400).json({ message: "Each detail must include a numeric id" });
      }
      if (
        item.sequence !== undefined &&
        (typeof item.sequence !== "number" || item.sequence <= 0)
      ) {
        return res.status(400).json({ message: "sequence must be a positive number if provided" });
      }
      if (item.is_visible !== undefined && typeof item.is_visible !== "boolean") {
        return res.status(400).json({ message: "is_visible must be boolean if provided" });
      }
    }

    // Ensure PET profile exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });
    if (!userProfile) return res.status(404).json({ message: "Pet profile not found" });

    // Fetch existing details
    const existingDetails = await PetMedicalDetail.findAll({
      where: { user_profile_id: userProfile.id },
    });
    const existingIds = existingDetails.map((d) => d.id);

    // Validate IDs match exactly
    const missingInRequest = existingIds.filter((id) => !details.some((d) => d.id === id));
    const unknownIds = details.map((d) => d.id).filter((id) => !existingIds.includes(id));

    if (missingInRequest.length > 0 || unknownIds.length > 0) {
      return res.status(400).json({
        message:
          "details array must contain exactly all medical detail IDs for this profile",
        missing_ids: missingInRequest,
        unknown_ids: unknownIds,
      });
    }

    // Map by id + update changed records only
    const detailMap = new Map(existingDetails.map((d) => [d.id, d]));
    const updates = [];

    details.forEach((item) => {
      const detail = detailMap.get(item.id);
      if (!detail) return;

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
    });

    await Promise.all(updates);

    const updatedDetails = await PetMedicalDetail.findAll({
      where: { user_profile_id: userProfile.id },
      order: [["sequence", "ASC"], ["id", "ASC"]],
    });

    return res.json({
      message: "Medical details updated successfully",
      medicalDetails: updatedDetails,
    });
  } catch (err) {
    console.error("Error in updateMyPetMedicalDetailsSequenceVisibility:", err);
    return next(err);
  }
},

editMyPetMedicalDetailById: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: "Invalid id" });

    // Ensure PET profile exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });
    if (!userProfile) return res.status(404).json({ message: "Pet profile not found" });

    const detail = await PetMedicalDetail.findOne({
      where: { id, user_profile_id: userProfile.id },
    });
    if (!detail) return res.status(404).json({ message: "Medical detail not found" });

    const allowedFields = ["disease_name", "disease_detail"];
    const updates = {};

    for (const k of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) updates[k] = req.body[k];
    }

    if (updates.disease_name !== undefined) {
      if (!String(updates.disease_name).trim()) {
        return res.status(400).json({ message: "disease_name cannot be empty" });
      }
      updates.disease_name = String(updates.disease_name).trim();
    }

    // normalize empty string -> null for disease_detail
    if (updates.disease_detail === "") updates.disease_detail = null;

    await detail.update(updates);

    return res.json({ message: "Updated successfully", medicalDetail: detail });
  } catch (err) {
    console.error("Error in editMyPetMedicalDetailById:", err);
    return next(err);
  }
},

deleteMyPetMedicalDetailById: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Ensure PET profile exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    const userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });
    if (!userProfile) {
      return res.status(404).json({ message: "Pet profile not found" });
    }

    const deleted = await PetMedicalDetail.destroy({
      where: { id, user_profile_id: userProfile.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Medical detail not found" });
    }

    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error in deleteMyPetMedicalDetailById:", err);
    return next(err);
  }
},

updateMyPetMedicalInsurance: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;
    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
    }

    // Validate body (PetMedicalInsurance: insurance_company, insurance_id are required in model)
    const { insurance_company, insurance_id } = req.body;

    if (!insurance_company || !String(insurance_company).trim()) {
      return res.status(400).json({ message: "insurance_company is required" });
    }
    if (!insurance_id || !String(insurance_id).trim()) {
      return res.status(400).json({ message: "insurance_id is required" });
    }

    // Create a new row each time (your PetMedicalInsurance model allows multiple rows)
    const created = await PetMedicalInsurance.create({
      user_profile_id: userProfile.id,
      insurance_company: String(insurance_company).trim(),
      insurance_id: String(insurance_id).trim(),
    });

    return res.json({
      message: "Pet medical insurance created successfully",
      medicalInsurance: created,
    });
  } catch (err) {
    console.error("Error in updateMyPetMedicalInsurance:", err);
    return next(err);
  }
},

updateMyPetMedicalCustomization: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;
    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
    }

    // Find-or-create customization
    let customization = await PetMedicalCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!customization) {
      customization = await PetMedicalCustomization.create({
        user_profile_id: userProfile.id,
        // medical_detail_sequence has default
      });
    }

    // Allowed fields (match PetMedicalCustomization model)
    const allowedFields = ["header_text", "background_color", "header_color", "body_color"];
    const updates = {};

    for (const k of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) updates[k] = req.body[k];
    }

    // normalize empty string -> null
    for (const k of allowedFields) {
      if (updates[k] === "") updates[k] = null;
    }

    await customization.update(updates);

    return res.json({
      message: "Pet medical customization updated successfully",
      userProfile,
      petMedicalCustomization: customization,
    });
  } catch (err) {
    console.error("Error in updateMyPetMedicalCustomization:", err);
    return next(err);
  }
},

getMyPetMedicalCustomization: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;
    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
    }

    let customization = await PetMedicalCustomization.findOne({
      where: { user_profile_id: userProfile.id },
    });

    if (!customization) {
      customization = await PetMedicalCustomization.create({
        user_profile_id: userProfile.id,
      });
    }

    return res.json({
      userProfile,
      petMedicalCustomization: customization,
    });
  } catch (err) {
    console.error("Error in getMyPetMedicalCustomization:", err);
    return next(err);
  }
},

getMyPetIdentification: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1) Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // 2) Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;
    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
    }

    // 3) Find-or-create identification (chipped is required)
    const petIdentification =
      (await PetIdentification.findOne({
        where: { user_profile_id: userProfile.id },
      })) ||
      (await PetIdentification.create({
        user_profile_id: userProfile.id,
        profile_id: String(petProfile.id),
        chipped: "NO", // required by model
        collar: null,
        special_feature: null,
        header_text: null,
        background_color: null,
        header_color: null,
        body_color: null,
      }));

    return res.json({
      userProfile,
      petIdentification,
    });
  } catch (err) {
    console.error("Error in getMyPetIdentification:", err);
    return next(err);
  }
},

updateMyPetIdentification: async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized: user not found" });

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1) Ensure PET ProfileType exists
    let petType = await ProfileType.findOne({ where: { type: "PET" } });
    if (!petType) {
      petType = await ProfileType.create({
        type: "PET",
        category: "RESCUE_ID",
        name: "Pet Profile",
        description: "Default Pet profile type",
      });
    }

    // 2) Find or create UserProfile + PetProfile
    let userProfile = await UserProfile.findOne({
      where: { user_id: userId, profile_type_id: petType.id },
    });

    let petProfile;
    if (!userProfile) {
      petProfile = await PetProfile.create({
        user_id: userId,
        pet_name: null,
        gender: null,
        age: null,
        color: null,
        breed: null,
        important_note: null,
        note_is_pinned: false,
        profile_image: null,
      });

      userProfile = await UserProfile.create({
        user_id: userId,
        profile_type_id: petType.id,
        profile_id: petProfile.id,
        profile_type_name: "Pet Profile",
        role: "OWNER",
        is_primary: false,
        is_active: true,
      });
    } else {
      petProfile = await PetProfile.findByPk(userProfile.profile_id);
      if (!petProfile) return res.status(500).json({ message: "Corrupted profile: missing PetProfile" });
    }

    // 3) Find-or-create identification
    const identification =
      (await PetIdentification.findOne({
        where: { user_profile_id: userProfile.id },
      })) ||
      (await PetIdentification.create({
        user_profile_id: userProfile.id,
        profile_id: String(petProfile.id),
        chipped: "NO",
        collar: null,
        special_feature: null,
        header_text: null,
        background_color: null,
        header_color: null,
        body_color: null,
        layout: "DEFAULT"
      }));

    // 4) Allowed fields (match PetIdentification.model.js)
    const allowedFields = [
      "chipped",
      "collar",
      "special_feature",
      "header_text",
      "background_color",
      "header_color",
      "body_color",
      "layout"
    ];

    const updates = {};
    for (const k of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, k)) {
        updates[k] = req.body[k];
      }
    }

    // chipped is required in model: don't allow setting it to null/empty
    if (updates.chipped !== undefined) {
      if (updates.chipped === null || String(updates.chipped).trim() === "") {
        return res.status(400).json({ message: "chipped cannot be empty" });
      }
      updates.chipped = String(updates.chipped).trim();
    }

    // normalize empty strings -> null for optional fields
    const nullIfEmpty = [
      "collar",
      "special_feature",
      "header_text",
      "background_color",
      "header_color",
      "body_color",
      "layout"
    ];
    for (const k of nullIfEmpty) {
      if (updates[k] === "") updates[k] = null;
    }

    if (updates.layout !== undefined && updates.layout !== null) {
  const validLayouts = ["DEFAULT", "LIST", "CARD"];
  if (!validLayouts.includes(updates.layout)) {
    return res.status(400).json({
      message: "Invalid layout value. Allowed: DEFAULT, LIST, CARD",
    });
  }
}

    await identification.update(updates);

    return res.json({
      message: "Pet identification updated successfully",
      userProfile,
      petIdentification: identification,
    });
  } catch (err) {
    console.error("Error in updateMyPetIdentification:", err);
    return next(err);
  }
},


};

export default PetProfileController;