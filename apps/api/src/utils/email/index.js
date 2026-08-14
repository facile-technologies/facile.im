// Public API for transactional email.
//
//   renderTemplate(key, data)              -> { subject, html, text, usesLogo }
//   sendTemplateEmail({ to, template, data })
//
// Templates are addressed by a stable key, not by their subject line. The old
// mailer matched on the subject string, which meant the subject was both a
// user-visible string and a dispatch identifier — so rewording a subject
// silently broke delivery, and one subject was built at the call site from
// APP_NAME. Keys decouple the two.

import { logo } from "./tokens.js";
import { transporter, logoAttachment, logoBuffer, FROM } from "./transport.js";

import signupOtp from "./templates/signupOtp.js";
import welcome from "./templates/welcome.js";
import passwordResetOtp from "./templates/passwordResetOtp.js";
import passwordResetSuccess from "./templates/passwordResetSuccess.js";
import teamInvitation from "./templates/teamInvitation.js";
import purchaseDelivery from "./templates/purchaseDelivery.js";

const ALL = [
  signupOtp,
  welcome,
  passwordResetOtp,
  passwordResetSuccess,
  teamInvitation,
  purchaseDelivery,
];

export const templates = Object.fromEntries(ALL.map((t) => [t.key, t]));
export const templateKeys = ALL.map((t) => t.key);

/** Default image src: the CID the mailer attaches, or null when the asset failed
 *  to load (the layout then renders a text wordmark). */
function defaultLogoSrc() {
  return logoBuffer ? `cid:${logo.cid}` : null;
}

/**
 * Render a template to HTML without sending. Used by sendTemplateEmail and by
 * the preview harness (src/scripts/previewEmails.js).
 *
 * @throws if the key is unknown — deliberately loud. There is no fallback
 *         template: a thrown error is strictly better than delivering a blank
 *         email, and every call site already sits inside a try/catch.
 */
export function renderTemplate(key, data = {}, { logoSrc } = {}) {
  const template = templates[key];
  if (!template) {
    throw new Error(
      `Unknown email template: "${key}". Known templates: ${templateKeys.join(", ")}`
    );
  }

  const ctx = { logoSrc: logoSrc === undefined ? defaultLogoSrc() : logoSrc };

  return {
    key,
    subject: template.subject(data),
    html: template.render(data, ctx),
    text: template.text ? template.text(data) : undefined,
    usesLogo: template.usesLogo !== false,
  };
}

/**
 * Render and send.
 *
 * @param {object}  opts
 * @param {string}  opts.to
 * @param {string}  opts.template  registry key
 * @param {object}  opts.data      template data
 * @param {?string} opts.replyTo   e.g. the seller, for purchase delivery
 */
export async function sendTemplateEmail({ to, template, data = {}, replyTo }) {
  const { subject, html, text, usesLogo } = renderTemplate(template, data);

  // The real fix for the old silent-blank-body bug. The previous mailer had no
  // else branch, so an unmatched subject passed html:undefined to nodemailer,
  // which sent an empty email and resolved successfully — the try/catch never
  // fired. Assert on the rendered output so ANY template returning nothing is
  // caught, not just an unknown key.
  if (typeof html !== "string" || html.trim().length === 0) {
    throw new Error(`Email template "${template}" produced an empty body — refusing to send.`);
  }

  const mailOptions = {
    from: FROM,
    to,
    subject,
    html,
    ...(text ? { text } : {}),
    ...(replyTo ? { replyTo } : {}),
    ...(usesLogo && logoBuffer ? { attachments: logoAttachment() } : {}),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[email] sent "${template}" to ${to}: ${info.response}`);
    return info;
  } catch (error) {
    console.error(`[email] FAILED "${template}" to ${to}:`, error.message);
    throw error;
  }
}
