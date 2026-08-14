// controllers/auth/Password.controller.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import UserModel from "../../models/User.model.js";
import OtpModel from "../../models/Otp.model.js";

import CustomErrorHandler from "../../middlewares/errors/customErrorHandler.js";
import HttpError from "../../middlewares/errors/HttpError.js";

import joiValidation from "../../utils/joiValidation.js";
import HelperMethods from "../../utils/helper.js";
import { sendTemplateEmail } from "../../utils/email/index.js";

import { FORGET_RESET_TOKEN_SECRET } from "../../config/index.js";

class PasswordController {
  /* FORGET PASSWORD - SEND OTP */
  static sendForgetPasswordOtp = async (req, res, next) => {
    try {
      const { email } = req.body;

      // validation
      if (!email) {
        throw new HttpError(422, "Email is required");
      }

      const user = await UserModel.findOne({ where: { email } });

      // Neutral response returned whether or not the account exists — prevents
      // account enumeration. Only generate + send an OTP when the user is real.
      const neutralResponse = {
        status: true,
        message: "If an account exists for that email, an OTP has been sent.",
        data: {},
      };

      if (!user) {
        return res.status(200).json(neutralResponse);
      }

      const otp = HelperMethods.generateOTP();
      const hashedOtp = await bcrypt.hash(otp, 10);

      const now = new Date();

      // Optionally mark previous FORGOT OTPs as used
      await OtpModel.update(
        { is_used: true },
        {
          where: {
            user_id: user.id,
            otp_type: "FORGOT",
            is_used: false,
          },
        }
      );

      await OtpModel.create({
        user_id: user.id,
        otp: hashedOtp,
        otp_type: "FORGOT",
        is_used: false,
        expires_at: HelperMethods.addMinutes(now, 15),
      });

      // Essential OTP email — await so a send failure fails the request.
      await sendTemplateEmail({
        to: user.email,
        template: "password-reset-otp",
        data: {
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          otp,
        },
      });

      return res.status(200).json(neutralResponse);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  /* FORGET PASSWORD - VERIFY OTP  */
  static verifyForgetPasswordOtp = async (req, res, next) => {
    try {
      // validation
      const { error } = joiValidation.verifyOtpValidation(req.body);

      if (error) {
        return next(error);
      }

      const { email, otp } = req.body;

      const user = await UserModel.findOne({ where: { email } });

      if (!user) {
        return next(
          CustomErrorHandler.alreadyExist("User not found, please register")
        );
      }

      const otpRecord = await OtpModel.findOne({
        where: {
          user_id: user.id,
          otp_type: "FORGOT",
          is_used: false,
        },
        order: [["created_at", "DESC"]],
      });

      if (!otpRecord) {
        throw new HttpError(403, "Please send forget password request again");
      }

      // compare OTP
      const isMatched = await bcrypt.compare(otp, otpRecord.otp || "");

      if (!isMatched) {
        throw new HttpError(403, "Invalid OTP code");
      }

      const isValidExpiry =
        otpRecord.expires_at && new Date(otpRecord.expires_at) >= new Date();

      if (!isValidExpiry) {
        // mark old as used
        otpRecord.is_used = true;
        await otpRecord.save();

        const newOtp = HelperMethods.generateOTP();
        const hashedOtp = await bcrypt.hash(newOtp, 10);

        const now = new Date();

        await OtpModel.create({
          user_id: user.id,
          otp: hashedOtp,
          otp_type: "FORGOT",
          is_used: false,
          expires_at: HelperMethods.addMinutes(now, 15),
        });

        // Essential OTP email — await so a send failure fails the request
        // (propagates to the catch -> next(err)).
        await sendTemplateEmail({
          to: user.email,
          template: "password-reset-otp",
          data: {
            name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
            otp: newOtp,
          },
        });

        throw new HttpError(
          403,
          "OTP expired, please check your email for a new OTP"
        );
      }

      // mark OTP as used
      otpRecord.is_used = true;
      await otpRecord.save();

      // Generate reset token (JWT) - stateless
      const resetToken = jwt.sign(
        {
          user_id: user.id,
          purpose: "password_reset",
          type: "reset_token",
        },
        FORGET_RESET_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      return res.status(200).json({
        status: true,
        message:
          "OTP verified successfully! You can now reset your password with the reset token.",
        data: { reset_token: resetToken },
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  /* FORGET PASSWORD - RESEND OTP */
  static reSendForgetPasswordOtp = async (req, res, next) => {
    try {
      const { email } = req.body;

      // validation
      if (!email) {
        throw new HttpError(422, "Email is required");
      }

      const user = await UserModel.findOne({ where: { email } });

      // Neutral response returned whether or not the account exists — prevents
      // account enumeration. Only generate + send an OTP when the user is real.
      const neutralResponse = {
        status: true,
        message: "If an account exists for that email, an OTP has been sent.",
        data: {},
      };

      if (!user) {
        return res.status(200).json(neutralResponse);
      }

      const otp = HelperMethods.generateOTP();
      const hashedOtp = await bcrypt.hash(otp, 10);

      const now = new Date();

      // Invalidate previous FORGOT OTPs
      await OtpModel.update(
        { is_used: true },
        {
          where: {
            user_id: user.id,
            otp_type: "FORGOT",
            is_used: false,
          },
        }
      );

      await OtpModel.create({
        user_id: user.id,
        otp: hashedOtp,
        otp_type: "FORGOT",
        is_used: false,
        expires_at: HelperMethods.addMinutes(now, 15),
      });

      // Essential OTP email — await so a send failure fails the request.
      await sendTemplateEmail({
        to: user.email,
        template: "password-reset-otp",
        data: {
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          otp,
        },
      });

      return res.status(200).json(neutralResponse);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };

  /* FORGET PASSWORD - RESET PASSWORD  */
  static resetForgetPasswordOtp = async (req, res, next) => {
    try {
      // validation
      const { error } = joiValidation.resetForgetPasswordOtpValidation(
        req.body
      );

      if (error) {
        return next(error);
      }

      const { reset_token, new_password } = req.body;

      // First verify JWT signature and expiration
      let decoded;
      try {
        decoded = jwt.verify(reset_token, FORGET_RESET_TOKEN_SECRET);
      } catch (jwtError) {
        return res.status(400).json({
          status: false,
          message: "Invalid or expired reset token",
          data: {},
        });
      }

      // Validate token purpose
      if (
        decoded.purpose !== "password_reset" ||
        decoded.type !== "reset_token"
      ) {
        return res.status(400).json({
          status: false,
          message: "Invalid token type",
          data: {},
        });
      }

      const user = await UserModel.findByPk(decoded.user_id);

      if (!user) {
        return next(
          CustomErrorHandler.alreadyExist("User not found, please register")
        );
      }

      // Update password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      await user.update({
        password: hashedPassword,
      });

      // Confirmation email is non-essential: the password is already changed,
      // so a send failure must NOT fail the request (that would falsely tell the
      // user the reset failed). Await but swallow (log) errors.
      try {
        await sendTemplateEmail({
          to: user.email,
          template: "password-reset-success",
          data: {
            name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
          },
        });
      } catch (mailErr) {
        console.log("Password-reset confirmation email failed (non-fatal):", mailErr);
      }

      return res.status(200).json({
        status: true,
        message: "Password reset successfully",
        data: {},
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  };
}

export default PasswordController;
