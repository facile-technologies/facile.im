// Confirmation that a password was actually changed. Non-essential — the call
// site swallows failures — but security-relevant: it is how a user finds out
// their password was changed without them.

import { FRONTEND_URL } from "../../../config/index.js";
import { baseLayout } from "../layout.js";
import {
  calloutBox,
  ctaButton,
  divider,
  escapeHtml,
  firstName,
  heading,
  paragraph,
} from "../blocks.js";

export default {
  key: "password-reset-success",
  usesLogo: true,

  subject: () => "Your password was changed",

  sample: { name: "Ada Lovelace" },

  render: ({ name }, ctx = {}) =>
    baseLayout({
      title: "Your password was changed",
      preheader: "Your Facile password was updated successfully.",
      logoSrc: ctx.logoSrc,
      bodyHtml: [
        heading("Your password was changed"),
        paragraph(
          `Hi ${escapeHtml(firstName(name))}, your Facile password was updated successfully. You can now sign in with your new password.`,
          { muted: true }
        ),
        ctaButton({
          href: `${FRONTEND_URL || "https://facile.im"}/login`,
          label: "Sign in",
        }),
        divider(),
        calloutBox({
          tone: "danger",
          title: "Wasn't you?",
          bodyHtml:
            "If you didn't make this change, someone else may have access to your account. Reset your password immediately and review your account details.",
        }),
      ].join("\n"),
    }),

  text: ({ name }) =>
    `Hi ${firstName(name)}, your Facile password was changed successfully.\n\nIf you didn't make this change, reset your password immediately.`,
};
