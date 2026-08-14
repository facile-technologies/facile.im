// utils/generateJwtTokens.js

import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_TTL } from "../config/index.js";

const generateJwtTokens = async (user) => {
  try {
    // Sequelize instances use "id", not "_id"
    const payload = { sub: user.id };

    // Short-lived access token. The SPA silently refreshes it via the httpOnly
    // refresh-token cookie, so a short TTL keeps the XSS blast-radius small.
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL, // default 15m
    });

    return accessToken; // no need for Promise.resolve()
  } catch (err) {
    throw err; // cleaner than Promise.reject()
  }
};

export default generateJwtTokens;
