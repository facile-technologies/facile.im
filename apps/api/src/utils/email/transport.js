// SMTP transport and the inline logo attachment.

import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MAIL_USER, MAIL_PASS, APP_NAME } from "../../config/index.js";
import { logo } from "./tokens.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Module-relative so pm2's working directory is irrelevant. Lives under src/
// rather than public/ because apps/api/.gitignore ignores public/ wholesale —
// an asset there would never be committed, and the deploy rsyncs the checkout.
//
// Source: apps/landing/public/brand/logo-full-light.png (1600x416), downscaled
// to 400x104 with `sips -Z 400`. Kept small deliberately: it ships base64-encoded
// on every send, and Gmail clips messages past ~102KB.
const LOGO_PATH = path.join(__dirname, "assets", "logo-email.png");

/**
 * Read once at module load, not per send. A failure here must never break
 * signup, so it degrades to a styled text wordmark instead of throwing.
 */
export const logoBuffer = (() => {
  try {
    return fs.readFileSync(LOGO_PATH);
  } catch (err) {
    console.warn(
      `[email] logo asset unreadable at ${LOGO_PATH} — falling back to a text wordmark:`,
      err.message
    );
    return null;
  }
})();

export function logoAttachment() {
  if (!logoBuffer) return [];
  return [
    {
      filename: "facile.png",
      content: logoBuffer,
      cid: logo.cid,
      contentDisposition: "inline",
      contentType: "image/png",
    },
  ];
}

export const FROM = `"${APP_NAME || "Facile"}" <noreply@facile.im>`;

export const transporter = nodemailer.createTransport({
  host: "mail.gandi.net",
  port: 465,
  secure: true,
  auth: { user: MAIL_USER, pass: MAIL_PASS },
});
