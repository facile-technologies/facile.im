// src/config/index.js
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..", "..");
const MODE = (process.env.NODE_ENV || "prod").trim();
const envPath = path.join(projectRoot, MODE === "dev" ? ".env.dev" : ".env");

// load env
dotenv.config({ path: envPath });

// export named vars
export const {
  PORT,
  DEBUG_MODE,
  DATABASE_URL,
  PASS,
  EMAIL,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  ACCESS_TOKEN_SECRET,
  SERVER_URL,
  FRONTEND_URL,
  APP_NAME,
  MAIL_USER,
  MAIL_PASS,
  FORGET_RESET_TOKEN_SECRET,
  STRIPE_PRODUCT_WEBHOOK_SECRET,
  PLATFORM_FEE_PERCENT,
  STRIPE_CONNECT_RETURN_URL,
  STRIPE_CONNECT_REFRESH_URL,
} = process.env;





export const NODE_ENV = MODE;
export const SERVER_URL_NORMALIZED = (SERVER_URL || "").replace(/\/$/, "");
