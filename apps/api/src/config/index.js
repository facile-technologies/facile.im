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
  // Only used if refresh tokens are implemented as JWTs. We use opaque random
  // tokens (see utils/refreshTokens.js), so this is optional/unused at runtime.
  REFRESH_TOKEN_SECRET,
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

// Address the transactional emails point users at for help. Unset by default:
// there is no support@ mailbox on facile.im yet, and templates omit the support
// line entirely rather than ship a link that bounces. Set SUPPORT_EMAIL once the
// mailbox (or an alias) exists.
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || null;

// Token lifetimes. Access token is short-lived (silent-refreshed by the SPA);
// the refresh token lives in an httpOnly cookie and is rotated on every use.
// Overridable via env, with sane defaults (15m access / 30d refresh).
export const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
export const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "30d";
