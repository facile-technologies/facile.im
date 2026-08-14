// Team invitation. The old mailer passed the invite URL through its `otp`
// parameter — the clearest symptom of subject-string dispatch being the wrong
// abstraction. Here it is a named field.
//
// teamName and isExistingUser are optional: the data exists at the call site
// (team.controller.js has the team record and the platform-user lookup) but is
// not wired through until the call sites migrate. The copy degrades cleanly.

import { baseLayout } from "../layout.js";
import {
  ctaButton,
  divider,
  escapeHtml,
  firstName,
  heading,
  linkFallback,
  paragraph,
} from "../blocks.js";

export default {
  key: "team-invitation",
  usesLogo: true,

  subject: ({ teamName }) =>
    teamName ? `You're invited to join ${teamName} on Facile` : "You're invited to join a team on Facile",

  sample: {
    name: "Grace Hopper",
    inviteLink: "https://facile.im/signup?member_id=42",
    teamName: "Acme Studio",
    isExistingUser: false,
  },

  render: ({ name, inviteLink, teamName, isExistingUser = false }, ctx = {}) => {
    const where = teamName
      ? `<strong style="color:#0a0a0a;">${escapeHtml(teamName)}</strong>`
      : "a team";

    return baseLayout({
      title: "Team invitation",
      preheader: teamName
        ? `You've been invited to join ${teamName} on Facile.`
        : "You've been invited to join a team on Facile.",
      logoSrc: ctx.logoSrc,
      bodyHtml: [
        heading("You've been invited"),
        paragraph(
          `Hi ${escapeHtml(firstName(name))}, you've been invited to join ${where} on Facile.`,
          { muted: true }
        ),
        paragraph(
          isExistingUser
            ? "Sign in to accept the invitation and start collaborating."
            : "Create your account to accept the invitation — it takes about a minute.",
          { muted: true }
        ),
        ctaButton({
          href: inviteLink,
          label: isExistingUser ? "Accept invitation" : "Accept and create account",
        }),
        linkFallback(inviteLink),
        divider(),
        paragraph(
          "If you weren't expecting this invitation, you can safely ignore this email.",
          { muted: true, size: 13 }
        ),
      ].join("\n"),
    });
  },

  text: ({ name, inviteLink, teamName }) =>
    `Hi ${firstName(name)}, you've been invited to join ${teamName || "a team"} on Facile.\n\nAccept your invitation: ${inviteLink}\n\nIf you weren't expecting this, you can ignore this email.`,
};
