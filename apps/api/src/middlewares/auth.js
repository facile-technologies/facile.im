// middlewares/auth.js

import CustomErrorHandler from "./errors/customErrorHandler.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/index.js";
import UserModel from "../models/User.model.js";

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Must be: Authorization: Bearer <token>
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(CustomErrorHandler.unAuthorized());
    }

    try {
      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

      // Your login was using { sub } as the user id
      // but we also support id / userId to be safe
      const userId = decoded.sub || decoded.id || decoded.userId || decoded.user_id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized.",
          data: {},
        });
      }

      // Sequelize: primary key lookup
      const user = await UserModel.findByPk(userId);

      if (!user) {
        return next(CustomErrorHandler.unAuthorized());
      }

      // Build full_name from snake_case fields in your model
      const full_name =
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        user.full_name ||
        "";

      const authenticatedUser = {
        id: user.id,      // ✅ normalized id
        _id: user.id,     // kept for frontend compatibility if needed
        email: user.email,
        full_name,
        role: user.role,
      };

      // Attach to req for later use
      req.user = authenticatedUser;
      req.userId = user.id; // some controllers use this

      return next();
    } catch (error) {
      console.error("JWT verify error:", error);
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
        data: {},
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return next(error);
  }
};

export default auth;
