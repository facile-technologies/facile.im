// Composable content blocks for transactional email.
//
// Rules every block here obeys, because email clients are not browsers:
//   - tables for layout, never flexbox or grid
//   - inline styles only (many clients strip <style>)
//   - no box-shadow, backdrop-filter, position, or transform
//   - no background-clip/-webkit-text-fill-color — that renders text INVISIBLE
//     in Outlook, which is exactly how the old OTP template broke
//
// Every block returns an HTML string. Callers pass user data through escapeHtml
// first; blocks do not escape for you, because some callers legitimately pass
// pre-composed markup.

import { color, font, gradient, metrics } from "./tokens.js";

/** Escape a value for interpolation into HTML text or a quoted attribute. */
export function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * First name only, for greetings. Falls back to a neutral word rather than an
 * empty "Hi ," — call sites pass `${first_name} ${last_name}` which is often
 * just a space when the user signed up without a name.
 */
export function firstName(fullName, fallback = "there") {
  const first = String(fullName || "").trim().split(/\s+/)[0];
  return first || fallback;
}

export function heading(text) {
  return `<h1 style="margin:0 0 12px 0;font-family:${font.sans};font-size:24px;line-height:1.25;font-weight:700;letter-spacing:-0.02em;color:${color.text};">${text}</h1>`;
}

export function paragraph(html, { muted = false, size = 15, align = "left", top = 0 } = {}) {
  const c = muted ? color.muted : color.text;
  return `<p style="margin:${top}px 0 16px 0;font-family:${font.sans};font-size:${size}px;line-height:1.6;color:${c};text-align:${align};">${html}</p>`;
}

export function spacer(height = 16) {
  return `<div style="line-height:${height}px;font-size:${height}px;height:${height}px;">&nbsp;</div>`;
}

export function divider({ spacing = 14 } = {}) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding:${spacing}px 0 ${spacing}px 0;"><div style="height:1px;line-height:1px;font-size:0;background-color:${color.border};">&nbsp;</div></td></tr></table>`;
}

/**
 * The verification-code chip.
 *
 * The digits are a SOLID colour on a light chip. The previous implementation
 * used a gradient clipped to the text, which made the code invisible in any
 * client without -webkit-background-clip (notably Outlook) — the single worst
 * bug in the old templates, since it silently blocked signup.
 *
 * text-indent offsets letter-spacing's trailing gap so the code reads centred.
 */
export function otpChip(code, label = "Verification code") {
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 8px 0;">
  <tr>
    <td align="center" bgcolor="${color.panel}" style="background-color:${color.panel};border:1px solid ${color.border};border-radius:${metrics.chipRadius}px;padding:24px 16px;">
      <div style="font-family:${font.sans};font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${color.muted};margin-bottom:12px;">${escapeHtml(label)}</div>
      <div style="font-family:${font.mono};font-size:34px;font-weight:700;letter-spacing:8px;text-indent:8px;color:${color.text};">${escapeHtml(code)}</div>
    </td>
  </tr>
</table>`.trim();
}

// Hugs the chip above it — reads as part of the code block, not a new thought.
export function expiryLine(minutes = 15) {
  return `<p style="margin:0 0 4px 0;font-family:${font.sans};font-size:13px;line-height:1.5;color:${color.muted};text-align:center;">This code expires in ${minutes} minutes.</p>`;
}

/**
 * Pill CTA button.
 *
 * Outlook desktop uses Word to render HTML and collapses padding on <a>, so the
 * button would lose its shape. The VML roundrect inside the MSO conditional is
 * what Outlook draws; every other client ignores it and uses the <a>.
 */
export function ctaButton({ href, label, bg = color.black, fg = color.onBlack }) {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:8px 0 8px 0;">
  <tr>
    <td align="center">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeHref}" style="height:48px;v-text-anchor:middle;width:280px;" arcsize="50%" stroke="f" fillcolor="${bg}">
        <w:anchorlock/>
        <center style="color:${fg};font-family:${font.sans};font-size:15px;font-weight:600;">${safeLabel}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-- -->
      <a href="${safeHref}" style="display:inline-block;background-color:${bg};color:${fg};font-family:${font.sans};font-size:15px;font-weight:600;line-height:20px;text-decoration:none;padding:14px 32px;border-radius:999px;mso-hide:all;">${safeLabel}</a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`.trim();
}

/**
 * "Button not working?" escape hatch. Always pair with ctaButton — a meaningful
 * share of recipients cannot click styled buttons at all.
 */
export function linkFallback(href) {
  const safeHref = escapeHtml(href);
  return `<p style="margin:4px 0 0 0;font-family:${font.sans};font-size:12px;line-height:1.6;color:${color.muted};text-align:center;word-break:break-all;">Button not working? Paste this into your browser:<br><a href="${safeHref}" style="color:${color.accent};text-decoration:underline;">${safeHref}</a></p>`;
}

export function calloutBox({ title = null, bodyHtml, tone = "neutral" }) {
  const tones = {
    neutral: { bg: color.panel, border: color.border, fg: color.text },
    success: { bg: color.successBg, border: color.success, fg: color.text },
    warning: { bg: color.warningBg, border: color.warning, fg: color.text },
    danger: { bg: color.dangerBg, border: color.danger, fg: color.text },
  };
  const t = tones[tone] || tones.neutral;
  const titleHtml = title
    ? `<div style="font-family:${font.sans};font-size:13px;font-weight:700;color:${t.fg};margin-bottom:6px;">${title}</div>`
    : "";
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px 0;">
  <tr>
    <td bgcolor="${t.bg}" style="background-color:${t.bg};border-left:3px solid ${t.border};border-radius:8px;padding:16px 18px;">
      ${titleHtml}<div style="font-family:${font.sans};font-size:14px;line-height:1.6;color:${color.muted};">${bodyHtml}</div>
    </td>
  </tr>
</table>`.trim();
}

/** Ordered list of steps, e.g. the welcome email's getting-started block. */
export function steps(items) {
  const rows = items
    .map(
      (item, i) => `
  <tr>
    <td width="26" valign="top" style="padding:0 0 10px 0;">
      <div style="font-family:${font.mono};font-size:12px;font-weight:700;color:${color.accent};line-height:22px;">${i + 1}</div>
    </td>
    <td valign="top" style="padding:0 0 10px 0;font-family:${font.sans};font-size:14px;line-height:22px;color:${color.text};">${item}</td>
  </tr>`
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px 0;">${rows}</table>`;
}

/** Download/access links, e.g. purchased digital files. */
export function linkList(items) {
  const rows = items
    .map(
      ({ label, href }) => `
  <tr>
    <td style="padding:0 0 10px 0;font-family:${font.sans};font-size:14px;line-height:1.5;">
      <a href="${escapeHtml(href)}" style="color:${color.accent};text-decoration:underline;">${escapeHtml(label)}</a>
    </td>
  </tr>`
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 12px 0;">${rows}</table>`;
}

/** Small uppercase label, used above lists and sections. */
export function sectionLabel(text) {
  return `<div style="font-family:${font.sans};font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${color.muted};margin:0 0 10px 0;">${text}</div>`;
}

/** The 3px brand hairline under the header band. */
export function rainbowBar() {
  return `<td height="3" bgcolor="${gradient.fallback}" style="height:3px;line-height:3px;font-size:0;background-color:${gradient.fallback};background-image:linear-gradient(90deg, ${gradient.stops});">&nbsp;</td>`;
}
