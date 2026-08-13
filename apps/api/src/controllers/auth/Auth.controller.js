// controllers/auth/Auth.controller.js

import bcrypt from "bcrypt";
import { Op } from "sequelize";

import UserModel from "../../models/User.model.js";
import TempUserModel from "../../models/TempUser.model.js";

import CustomErrorHandler from "../../middlewares/errors/customErrorHandler.js";
import HttpError from "../../middlewares/errors/HttpError.js";

import joiValidation from "../../utils/joiValidation.js";
import generateJwtTokens from "../../utils/generateJwtTokens.js";
import HelperMethods from "../../utils/helper.js";
import EmailMethods from "../../utils/email.js";

import { APP_NAME, SERVER_URL } from "../../config/index.js";
import TeamMemberModel from "../../models/TeamMember.model.js";

class AuthController {
  /*  USERNAME CHECK  */
  static checkUsername = async (req, res, next) => {
    try {
      const { username } = req.query;

      if (!username) {
        throw new HttpError(400, "Username is required");
      }

      const existingUser = await UserModel.findOne({ where: { username } });

      if (existingUser) {
        throw new HttpError(400, "Username already exists");
      }

      return res.status(200).json({
        status: true,
        message: "Username is available",
        data: {},
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  /*  SIGNUP  */
  static signup = async (req, res, next) => {
    try {
      debugger
      // validation
      const { error } = joiValidation.signUpValidation(req.body);

      if (error) {
        return next(error);
      }

      const { full_name, email, password, username,is_team_member } = req.body;



      // Split full_name into first_name / last_name for schema
      let first_name = "";
      let last_name = "";
      if(is_team_member ==true){
         // find team of this user
      const teamMember = await TeamMemberModel.findOne({
        where: { email: email },
      });

      if(!teamMember){
        throw new HttpError(404, "Team member not found");
      }


      if (teamMember.full_name && typeof full_name === "string") {
          const parts = teamMember.full_name.trim().split(" ");
          first_name = parts[0] || "";
          last_name = parts.slice(1).join(" ") || "";
        }

      }else{
        if (full_name && typeof full_name === "string") {
        const parts = full_name.trim().split(" ");
        first_name = parts[0] || "";
        last_name = parts.slice(1).join(" ") || "";
      }

      }
      

      
      const normalized_full_name = `${first_name} ${last_name}`.trim();

      // Check existing user by email or username (Sequelize OR)
      const orConditions = [{ email }];
      if (username) {
        orConditions.push({ username });
      }

      const existingUser = await UserModel.findOne({
        where: {
          [Op.or]: orConditions,
        },
      });

      if (existingUser) {
        throw new HttpError(409, "This email or username is already taken");
      }

      const previousTempUser = await TempUserModel.findOne({
        where: { email },
      });

      if (previousTempUser) {
        await TempUserModel.destroy({ where: { id: previousTempUser.id } });
      }

      // hashing password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate OTP (hashed)
      const otp = HelperMethods.generateOTP();
      const hashedOtp = await bcrypt.hash(otp, 10);

      const now = new Date();

      const result = await TempUserModel.create({
        full_name: normalized_full_name,
        first_name,
        last_name,
        username,
        email,
        password: hashedPassword,
        otp_code: hashedOtp,
        otp_expires_at: HelperMethods.addMinutes(now, 15),
      });

      // Plain object for response
      const user = {
        _id: result.id,
        email: result.email,
        full_name: `${result.first_name || ""} ${
          result.last_name || ""
        }`.trim(),
        username: result.username,
        profile_link: result.profile_link, // if you add this field to TempUser
      };

      EmailMethods.sendEmail(
        result.email,
        "Email Verification",
        otp,
        `${result.first_name || ""} ${result.last_name || ""}`.trim()
      );

      return res.status(201).json({
        status: true,
        message: "Registration successful, please verify OTP.",
        data: user,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  /* VERIFY SIGNUP OTP   */
  static verifyOtp = async (req, res, next) => {
    try {
      // validation
      const { error } = joiValidation.verifyOtpValidation(req.body);

      if (error) {
        return next(error);
      }

      const { email, otp } = req.body;

      const userExists = await UserModel.findOne({ where: { email } });

      if (userExists) {
        return next(
          CustomErrorHandler.alreadyExist("Account already verified")
        );
      }

      const tempUser = await TempUserModel.findOne({ where: { email } });

      if (!tempUser) {
        throw new HttpError(403, "No pending registration found");
      }

      // compare OTP
      const isMatched = await bcrypt.compare(otp, tempUser.otp_code || "");

      if (!isMatched) {
        throw new HttpError(403, "Invalid OTP code");
      }

      const isValidExpiry =
        tempUser.otp_expires_at &&
        new Date(tempUser.otp_expires_at) >= new Date();

      if (!isValidExpiry) {
        // regenerate OTP and resend
        const newOtp = HelperMethods.generateOTP();
        const hashedOtp = await bcrypt.hash(newOtp, 10);
        const now = new Date();

        tempUser.otp_code = hashedOtp;
        tempUser.otp_expires_at = HelperMethods.addMinutes(now, 15);
        await tempUser.save();

        EmailMethods.sendEmail(
          tempUser.email,
          "Email Verification",
          newOtp,
          `${tempUser.first_name || ""} ${tempUser.last_name || ""}`.trim()
        );

        throw new HttpError(
          403,
          "OTP expired, please check your email for a new OTP"
        );
      }

      const normalized_full_name = `${tempUser.first_name || ""} ${
        tempUser.last_name || ""
      }`.trim();

      const newUser = await UserModel.create({
        full_name: normalized_full_name,
        first_name: tempUser.first_name,
        last_name: tempUser.last_name,
        username: tempUser.username,
        email: tempUser.email,
        password: tempUser.password,
        is_verfied: true, // matches users.is_verfied in schema
      });

      // delete temp user
      await TempUserModel.destroy({ where: { id: tempUser.id } });

      const user = {
        _id: newUser.id,
        email: newUser.email,
        full_name: `${newUser.first_name || ""} ${
          newUser.last_name || ""
        }`.trim(),
        username: newUser.username,
        profile_link: newUser.profile_link,
      };


      const teamMember = await TeamMemberModel.findOne({
        where: { email: newUser.email },
        
      });
      
      if(teamMember){
        teamMember.user_id = newUser.id;
        await teamMember.save();
      }
      
      EmailMethods.sendEmail(
        newUser.email,
        `Welcome to ${APP_NAME}`,
        "",
        `${newUser.first_name || ""} ${newUser.last_name || ""}`.trim()
      );


            const accessToken = await generateJwtTokens(newUser);


      return res.status(201).json({
        status: true,
        message: "Registration successful, please login.",
        data: user,
        access_token: accessToken,
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  /*   RESEND REGISTER OTP */
  static resendRegisterOtp = async (req, res, next) => {
    try {
      const { email } = req.body;

      // validation
      if (!email) {
        throw new HttpError(422, "Email is required");
      }

      const userExists = await UserModel.findOne({ where: { email } });

      if (userExists) {
        return next(
          CustomErrorHandler.alreadyExist("Account already verified")
        );
      }

      const tempUser = await TempUserModel.findOne({ where: { email } });

      if (!tempUser) {
        throw new HttpError(403, "No pending registration found");
      }

      // Optional: basic rate limiting
      const now = new Date();
      if (
        tempUser.last_otp_sent_at &&
        now - new Date(tempUser.last_otp_sent_at) < 60 * 1000 // 60 seconds
      ) {
        throw new HttpError(
          429,
          "Please wait 60 seconds before resending OTP."
        );
      }

      const otp = HelperMethods.generateOTP();
      const hashedOtp = await bcrypt.hash(otp, 10);

      tempUser.otp_code = hashedOtp;
      tempUser.otp_expires_at = HelperMethods.addMinutes(now, 15);
      tempUser.last_otp_sent_at = now;
      await tempUser.save();

      EmailMethods.sendEmail(
        tempUser.email,
        "Email Verification",
        otp,
        `${tempUser.first_name || ""} ${tempUser.last_name || ""}`.trim()
      );

      return res.status(200).json({
        status: true,
        message: "OTP resent.",
        data: {},
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  /*  LOGIN */
  static login = async (req, res, next) => {
    try {
      // validation
      const { error } = joiValidation.logInBodyValidation(req.body);

      if (error) {
        return next(error);
      }

      const { email, password } = req.body;

      const user = await UserModel.findOne({ where: { email } });

      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // token
      const accessToken = await generateJwtTokens(user);

      const userPlain = user.toJSON();

      // Map avatar_url to a usable profile_pic URL
      let profile_pic;
      if (userPlain.avatar_url) {
        profile_pic = `${
          SERVER_URL ? SERVER_URL : ""
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


      

      const teamMember = await TeamMemberModel.findOne({
        where: { email: email },
        attributes: ["id","team_id","invitation_status"], // 👈 selected fields
      });


      

      res.status(200).json({
        status: true,
        message: "User logged in successfully.",
        data: {
          user: userData,
          team_member: teamMember ? teamMember : null,
          
          access_token: accessToken,
        },
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };
}

export default AuthController;
