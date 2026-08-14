// Forgot-password verification code. Sent from the forgot-password request,
// the expired-OTP reissue path, and the resend endpoint.

import { baseLayout } from "../layout.js";
import {
  calloutBox,
  divider,
  escapeHtml,
  expiryLine,
  firstName,
  heading,
  otpChip,
  paragraph,
} from "../blocks.js";

export default {
  key: "password-reset-otp",
  usesLogo: true,

  subject: () => "Reset your password",

  sample: { name: "Ada Lovelace", otp: "704318", expiryMinutes: 15 },

  render: ({ name, otp, expiryMinutes = 15 }, ctx = {}) =>
    baseLayout({
      title: "Reset your password",
      preheader: `${otp} is your Facile password reset code.`,
      logoSrc: ctx.logoSrc,
      bodyHtml: [
        heading("Reset your password"),
        paragraph(
          `Hi ${escapeHtml(firstName(name))}, use this code to set a new password.`,
          { muted: true }
        ),
        otpChip(otp, "Reset code"),
        expiryLine(expiryMinutes),
        divider(),
        calloutBox({
          tone: "warning",
          title: "Didn't request this?",
          bodyHtml:
            "Your password hasn't changed and your account is safe. You can ignore this email — but if you keep receiving these, someone may know your email address, so consider changing your password once you're signed in.",
        }),
      ].join("\n"),
    }),

  text: ({ otp, expiryMinutes = 15 }) =>
    `Your Facile password reset code is ${otp}. It expires in ${expiryMinutes} minutes.\n\nIf you didn't request this, your password hasn't changed and your account is safe.`,
};
