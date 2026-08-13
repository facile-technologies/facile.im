import { SERVER_URL_NORMALIZED, FRONTEND_URL } from "../config/index.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";

import geoip from "geoip-lite";
class HelperMethods {
  static generateOTP() {


    let otp = ''
    for (let i = 0; i <= 5; i++) {
      const randVal = Math.round(Math.random() * 9)
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

  static exportNfcCsv = ({
    codes,
    device,
    status = "GENERATED",
  }) => {
    // CSV header
    const csvHeader = "code,device,device_type,status,url\n";

    const csvRows = codes.map(code => {
      const url = `${FRONTEND_URL}/${device.id}/${code}`;

      return [
        code,
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