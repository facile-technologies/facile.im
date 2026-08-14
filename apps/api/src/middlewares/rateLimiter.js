// middlewares/rateLimiter.js
//
// Rate limiters for abuse-prone endpoints. The app runs behind nginx, so
// `app.set("trust proxy", 1)` (see server.js) makes req.ip reflect the real
// client — these limiters key off that.

import { rateLimit } from "express-rate-limit";

// Emit a 429 in the app's standard { success:false, message } error shape.
const rateLimitHandler = (req, res /*, next, options */) =>
  res.status(429).json({
    success: false,
    message: "Too many requests, please try again later.",
  });

// Strict limiter for unauthenticated auth endpoints (login / signup / OTP flows)
// to blunt credential stuffing and OTP brute-force / spam.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max attempts per IP per window
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false, // no X-RateLimit-* headers
  skipSuccessfulRequests: false, // count every request, success or not
  handler: rateLimitHandler,
});

// Looser limiter for unauthenticated public lookups (consumed by a later batch).
export const publicLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // max requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// Poll-friendly limiter for the activation-status endpoint. The desktop UI polls
// GET /device/status/:code every ~2s during activation (~30/min on its own), which
// would sit right at publicLimiter's ceiling; this gives headroom so legitimate
// polling never trips 429 while still bounding abuse.
export const pollLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // ~2 req/s sustained
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

// Moderate limiter for session endpoints (refresh / logout). We deliberately do
// NOT reuse the strict authLimiter (10/15min): legitimate users open several
// tabs and sit behind shared/office NATs, and a short access-token TTL means
// refreshes happen routinely — 10/15min would lock them out. The refresh token
// is a 256-bit opaque value, so brute force isn't the threat here; this limiter
// just bounds abuse (~60 requests / 15 min per IP).
export const sessionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // max requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});
