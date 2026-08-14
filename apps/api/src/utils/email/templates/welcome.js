// Sent once the signup OTP is verified and the real User row exists.
// Non-essential: the call site swallows send failures.

import { FRONTEND_URL } from "../../../config/index.js";
import { baseLayout } from "../layout.js";
import {
  ctaButton,
  escapeHtml,
  firstName,
  heading,
  paragraph,
  sectionLabel,
  steps,
} from "../blocks.js";

export default {
  key: "welcome",
  usesLogo: true,

  subject: () => "Welcome to Facile",

  sample: { name: "Ada Lovelace", username: "ada" },

  render: ({ name, username }, ctx = {}) => {
    const loginUrl = `${FRONTEND_URL || "https://facile.im"}/login`;
    const profileLine = username
      ? paragraph(
          `Your profile is reserved at <strong style="color:#0a0a0a;">facile.im/${escapeHtml(username)}</strong> — share it with a tap.`,
          { muted: true }
        )
      : "";

    return baseLayout({
      title: "Welcome to Facile",
      preheader: "Your account is ready. Here's how to get started.",
      logoSrc: ctx.logoSrc,
      bodyHtml: [
        heading(`Welcome, ${escapeHtml(firstName(name))}`),
        paragraph("Your account is verified and ready to go.", { muted: true }),
        profileLine,
        sectionLabel("Get started"),
        steps([
          "Sign in and finish your profile",
          "Add your links, socials, and contact details",
          "Tap your card to share it — no app needed",
        ]),
        ctaButton({ href: loginUrl, label: "Open your dashboard" }),
      ]
        .filter(Boolean)
        .join("\n"),
    });
  },

  text: ({ name }) =>
    `Welcome to Facile, ${firstName(name)}.\n\nYour account is verified and ready. Sign in at ${FRONTEND_URL || "https://facile.im"}/login to finish your profile.`,
};
