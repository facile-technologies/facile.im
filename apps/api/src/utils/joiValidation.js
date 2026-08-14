import Joi from "joi";
class JoiValidation {
  static logInBodyValidation(body) {
    const schema = Joi.object({
      email: Joi.string().email().required().label("email"),
      password: Joi.string().required().label("password"),
    });
    return schema.validate(body);
  }
  static updatePersonalProfileValidation(body) {
    const schema = Joi.object({
      first_name: Joi.string().min(1).required().label("First Name"),
      last_name: Joi.string().min(1).required().label("Last Name"),
      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        // .optional()
        .label("Username"),

      bio: Joi.string().allow("").required().label("Bio"),


      // Optional fields
      about_text_color: Joi.string().optional(),
      font_family: Joi.string().optional(),
      font_size: Joi.number().optional(),
      background_color: Joi.string().optional(),
      background_blur: Joi.number().min(0).max(100).optional(),
      remove_profile_image: Joi.boolean().truthy("true").optional(),
      remove_logo: Joi.boolean().truthy("true").optional(),
      remove_banner: Joi.boolean().truthy("true").optional(),
      remove_background_image: Joi.boolean().truthy("true").optional(),
    });

    return schema.validate(body);
  }


  static updateBusinessProfileValidation(body) {
    const schema = Joi.object({
      business_name: Joi.string()
        .min(1)
        .max(255)
        .required()
        .label("Business Name"),

      username: Joi.string()
        .allow(null, "")
        .optional()
        .label("Username"),

      bio: Joi.string()
        .allow("", null)
        .max(500)
        .optional()
        .label("Bio"),

      // Optional styling (same pattern as personal)
      about_text_color: Joi.string().optional(),
      font_size: Joi.number().integer().min(8).max(48).optional(),
      font_family: Joi.string().optional(),
      background_color: Joi.string().optional(),
      background_blur: Joi.number().integer().min(0).max(50).optional(),
    });

    return schema.validate(body);
  }
  static verifyOtpValidation(body) {
    const schema = Joi.object({
      email: Joi.string().email().required().label("email"),
      otp: Joi.string().required().label("otp"),
    });
    return schema.validate(body);
  }

  static resetForgetPasswordOtpValidation(body) {
    const schema = Joi.object({
      new_password: Joi.string().required().label("New Password"),
      reset_token: Joi.string().required().label("Reset Token"),
    });
    return schema.validate(body);
  }

  static signUpValidation(body) {
    const schema = Joi.object({
      full_name: Joi.string().min(2).max(30).required().label("Full Name"),

      email: Joi.string().email().required().label("Email"),

      password: Joi.string().required().min(8).messages({
        "string.min": "Password must be at least 8 characters long",
        "any.required": "Password is required",
      }),

      username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .label("Username"),

      is_team_member: Joi.boolean().required().label("Is Team Member"),
    });

    return schema.validate(body);
  }





  static createTeamValidation(body) {
    const schema = Joi.object({
      team_name: Joi.string().trim().max(255).required(),
      team_description: Joi.string().trim().optional(),
    });

    return schema.validate(body);
  }


  static addMembersValidation(body) {
    const schema = Joi.object({
      members: Joi.array()
        .items(
          Joi.object({
            full_name: Joi.string().min(2).required(),
            email: Joi.string().email().required(),
          })
        )
        .min(1)
        .required(),
    });

    return schema.validate(body);
  }

  static activateDeviceValidation(body) {
    const schema = Joi.object({
      code: Joi.string().length(10).required().label("NFC Code"),
      user_profile_id: Joi.number().integer().min(0).required().label("User Profile ID"),
      // The activation code (ACTIVATION_CODE Otp) proves possession of the
      // owner's short-lived activation link and is what binds owner -> profile.
      activation_code: Joi.string().trim().required().label("Activation Code"),
    });

    return schema.validate(body);
  }

  static unlinkDeviceValidation(body) {
    const schema = Joi.object({
      code: Joi.string().length(10).required().label("NFC Code"),
    });

    return schema.validate(body);
  }

  // Self-serve claim: the logged-in user (JWT) binds a scanned card to one of
  // their own profiles. Owner comes from the token, so no activation_code here.
  static claimDeviceValidation(body) {
    const schema = Joi.object({
      code: Joi.string().length(10).required().label("NFC Code"),
      user_profile_id: Joi.number().integer().min(0).required().label("User Profile ID"),
    });

    return schema.validate(body);
  }

  static setupOneShareValidation(body) {
    const schema = Joi.object({
      code: Joi.string().length(10).required().label("NFC Code"),
      one_share_active: Joi.boolean().required().label("One Share Active Status"),
      one_share_url: Joi.when("one_share_active", {
        is: true,
        then: Joi.string().uri().required().label("One Share URL"),
        otherwise: Joi.string().allow(null, "").optional(),
      }),
    });

    return schema.validate(body);
  }


  // Validate a single user-supplied URL. Constrains the scheme to http/https so
  // dangerous schemes (javascript:, data:, vbscript:) and malformed URLs are rejected —
  // prevents stored XSS when these URLs are later rendered as links.
  static validateHttpUrl(url, label = "URL") {
    const schema = Joi.string()
      .uri({ scheme: ["http", "https"] })
      .label(label);
    return schema.validate(url);
  }

   static createTemplateValidation(body) {
    const schema = Joi.object({
  
      template_name: Joi.string().required().label("template_name"),
      is_template_locked: Joi.boolean().required().label("is_template_locked"),
    }).unknown(true); // 👈 allow additional fields;
    return schema.validate(body);
  }

}

export default JoiValidation;
