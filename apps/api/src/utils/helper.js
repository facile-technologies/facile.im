import { SERVER_URL_NORMALIZED, FRONTEND_URL } from "../config/index.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";

import geoip from "geoip-lite";
class HelperMethods {
  static generateOTP() {
    // Use a cryptographically strong RNG (crypto.randomInt) instead of Math.random()
    // so OTPs aren't predictable. Keeps the same output shape: a 6-digit numeric string.
    let otp = ''
    for (let i = 0; i <= 5; i++) {
      const randVal = crypto.randomInt(0, 10) // 0-9 inclusive, uniform
      otp = otp + randVal
    }
    return otp;


  }

  static addDays = (d, days) => {

    return new Date(d.getTime() + days * 24 * 60 * 60 * 1000);
  }

  static addMinutes = (d, minutes) => {
    return new Date(d.getTime() + minutes * 60 * 1000);
  };

  static withBaseUrl(path) {
    if (!path) return null;

    return `${SERVER_URL_NORMALIZED}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  static generateNfcCode(length = 10) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const bytes = crypto.randomBytes(length);

    let code = "";
    for (let i = 0; i < length; i++) {
      code += chars[bytes[i] % chars.length];
    }

    return code;
  }

  // Turn a human label ("SOS Band - Black") into a URL-safe slug segment
  // ("sos-band-black"). Used to build the cosmetic descriptor in the printed
  // card URL: facile.im/activate/{code}/{slug}. Never used for lookup/auth.
  static slugify(text) {
    return String(text || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")     // strip accents
      .replace(/[^a-z0-9]+/g, "-")        // non-alnum -> hyphen
      .replace(/^-+|-+$/g, "")            // trim leading/trailing hyphens
      .replace(/-{2,}/g, "-");            // collapse repeats
  }

  static exportNfcCsv = ({
    codes,
    device,
    status = "GENERATED",
  }) => {
    // CSV header. `codes` is an array of { code, slug } pairs.
    const csvHeader = "code,slug,device,device_type,status,url\n";

    const csvRows = codes.map(({ code, slug }) => {
      // The printed card URL is itself the activation entry point. `code` is the
      // trusted DB key; `slug` is a cosmetic brand-product-color-serial descriptor.
      const url = `${FRONTEND_URL}/activate/${code}/${slug}`;

      return [
        code,
        slug,
        device.title,
        device.profile_type,
        status,
        url,
      ].join(",");
    });

    const csvContent = csvHeader + csvRows.join("\n");

    // File setup
    const timestamp = Date.now();
    const fileName = `nfc_codes_${device.id}_${timestamp}.csv`;
    const exportDir = path.join(process.cwd(), "public", "exports");

    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const filePath = path.join(exportDir, fileName);
    fs.writeFileSync(filePath, csvContent, "utf8");

    return `${SERVER_URL_NORMALIZED}/public/exports/${fileName}`;
  }


  static  getCountryFromRequest = (req) => {
  // Get real IP (works behind proxies/load balancers)
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket.remoteAddress;

  const geo = geoip.lookup(ip);

  return {
    country_code: geo?.country || "XX",   // "PK", "US" etc. "XX" = unknown
    country_name: geo?.country
      ? new Intl.DisplayNames(["en"], { type: "region" }).of(geo.country)
      : "Unknown",                          // "Pakistan", "United States" etc.
  };
};
}

export default HelperMethods