// Signup email verification. Sent from Auth.controller signup, from the
// expired-OTP reissue path, and from resendRegisterOtp.
//
// This is the single most critical email in the product: if it fails, the
// request rolls back the TempUser and registration fails outright.

import { baseLayout } from "../layout.js";
import {
  divider,
  escapeHtml,
  expiryLine,
  firstName,
  heading,
  otpChip,
  paragraph,
} from "../blocks.js";

export default {
  key: "signup-otp",
  usesLogo: true,

  subject: () => "Verify your email",

  sample: { name: "Ada Lovelace", otp: "481920", expiryMinutes: 15 },

  render: ({ name, otp, expiryMinutes = 15 }, ctx = {}) =>
    baseLayout({
      title: "Verify your email",
      preheader: `${otp} is your Facile verification code.`,
      logoSrc: ctx.logoSrc,
      bodyHtml: [
        heading("Verify your email"),
        paragraph(
          `Hi ${escapeHtml(firstName(name))}, enter this code to finish setting up your account.`,
          { muted: true }
        ),
        otpChip(otp),
        expiryLine(expiryMinutes),
        divider(),
        paragraph(
          "If you didn't create a Facile account, you can safely ignore this email — nothing was set up.",
          { muted: true, size: 13 }
        ),
      ].join("\n"),
    }),

  text: ({ otp, expiryMinutes = 15 }) =>
    `Your Facile verification code is ${otp}. It expires in ${expiryMinutes} minutes.\n\nIf you didn't create a Facile account, you can ignore this email.`,
};
