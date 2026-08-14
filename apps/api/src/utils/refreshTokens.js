// utils/refreshTokens.js
//
// Refresh-token helpers (Row 10). A refresh token is an opaque 256-bit random
// string handed to the client in an httpOnly cookie. Server-side we persist only
// its SHA-256 hash in `refresh_tokens`, grouped by a `family_id` (rotation
// lineage). On every refresh the presented token is rotated: the old row is
// revoked and a new row is inserted in the SAME family. Presenting a token that
// is already revoked means it leaked and was replayed → revoke the whole family.

import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.model.js";
import { NODE_ENV, REFRESH_TOKEN_TTL } from "../config/index.js";

// Cookie name for the refresh token.
export const REFRESH_COOKIE_NAME = "refresh_token";

// Generate an opaque, unguessable refresh token (256 bits of entropy).
export const generateRawToken = () => crypto.randomBytes(32).toString("hex");

// Hash a raw token for storage/lookup. We never store or log the raw token.
export const hashToken = (rawToken) =>
  crypto.createHash("sha256").update(rawToken).digest("hex");

// Parse a TTL string like "30d" / "15m" / "3600s" / "12h" into milliseconds.
// Falls back to 30 days if the value is unrecognised.
const ttlToMs = (ttl) => {
  const match = String(ttl).trim().match(/^(\d+)\s*([smhd])?$/i);
  if (!match) return 30 * 24 * 60 * 60 * 1000;
  const value = Number(match[1]);
  const unit = (match[2] || "s").toLowerCase();
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * (multipliers[unit] || 1000);
};

export const REFRESH_TTL_MS = ttlToMs(REFRESH_TOKEN_TTL);

// Cookie flags. httpOnly keeps it out of JS (XSS can't read it); Secure is on
// everywhere except local dev (dev is plain http://localhost). sameSite:"lax"
// is correct because the SPA and API share the facile.im registrable domain
// (api.facile.im ↔ facile.im are same-site), and both are localhost in dev.
export const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: NODE_ENV !== "dev",
  sameSite: "lax",
  path: "/",
  maxAge: REFRESH_TTL_MS,
});

// Issue + persist a new refresh token. Pass an existing familyId to continue a
// rotation lineage, or omit it to start a fresh family (login / verify).
// Returns the RAW token (to be set as a cookie) plus the created row.
export const issueRefreshToken = async ({ userId, familyId }) => {
  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const family = familyId || crypto.randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

  const row = await RefreshToken.create({
    user_id: userId,
    token_hash: tokenHash,
    family_id: family,
    expires_at: expiresAt,
  });

  return { rawToken, row };
};

// Set the refresh cookie on the response.
export const setRefreshCookie = (res, rawToken) => {
  res.cookie(REFRESH_COOKIE_NAME, rawToken, refreshCookieOptions());
};

// Clear the refresh cookie (logout / invalid token). maxAge is omitted so the
// browser drops it, but the other flags must match for the clear to take effect.
export const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: NODE_ENV !== "dev",
    sameSite: "lax",
    path: "/",
  });
};
