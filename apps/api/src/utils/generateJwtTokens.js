// utils/generateJwtTokens.js

import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config/index.js";

const generateJwtTokens = async (user) => {
  try {
    // Sequelize instances use "id", not "_id"
    const payload = { sub: user.id };

    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "30d", // same expiry
    });

    return accessToken; // no need for Promise.resolve()
  } catch (err) {
    throw err; // cleaner than Promise.reject()
  }
};

export default generateJwtTokens;
