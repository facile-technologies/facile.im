// The single HTML shell every transactional email composes into.
//
// Everything hostile about email rendering is handled here so templates stay
// readable. If you are tempted to add client-specific hacks to a template,
// it probably belongs in this file instead.

import { APP_NAME, SUPPORT_EMAIL } from "../../config/index.js";
import { color, font, logo, metrics } from "./tokens.js";
import { escapeHtml, rainbowBar } from "./blocks.js";

const APP = APP_NAME || "Facile";

/**
 * Gmail truncates the preview line by pulling text out of the body, so the
 * hidden preheader is padded with zero-width joiners to stop body copy leaking
 * into the inbox list.
 */
function preheaderBlock(text) {
  const pad = "&#8202;&zwnj;".repeat(60);
  return `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(text)}${pad}</div>`;
}

function headerBand(logoSrc) {
  // When the image is blocked (or the asset failed to load), the alt text is
  // styled to read as the wordmark: white, bold, on the black band.
  const mark = logoSrc
    ? `<img src="${logoSrc}" width="${logo.width}" height="${logo.height}" alt="${escapeHtml(APP)}" style="display:block;border:0;outline:none;text-decoration:none;height:auto;color:${color.onBlack};font-family:${font.sans};font-size:22px;font-weight:700;letter-spacing:-0.03em;" />`
    : `<div style="font-family:${font.sans};font-size:22px;font-weight:700;letter-spacing:-0.03em;color:${color.onBlack};">${escapeHtml(APP.toLowerCase())}</div>`;

  return `
  <tr>
    <td bgcolor="${color.black}" style="background-color:${color.black};padding:28px 32px;" align="left">
      ${mark}
    </td>
  </tr>
  <tr>
    ${rainbowBar()}
  </tr>`;
}

function footerBlock(footerNote) {
  const support = SUPPORT_EMAIL
    ? `<p style="margin:0 0 8px 0;font-family:${font.sans};font-size:12px;line-height:1.6;color:${color.faint};">Need help? <a href="mailto:${escapeHtml(SUPPORT_EMAIL)}" style="color:${color.faint};text-decoration:underline;">${escapeHtml(SUPPORT_EMAIL)}</a></p>`
    : "";
  const note = footerNote
    ? `<p style="margin:0 0 8px 0;font-family:${font.sans};font-size:12px;line-height:1.6;color:${color.faint};">${footerNote}</p>`
    : "";
  return `
  <tr>
    <td align="center" style="padding:24px 32px 40px 32px;">
      ${note}${support}
      <p style="margin:0;font-family:${font.sans};font-size:12px;line-height:1.6;color:${color.faint};">&copy; ${new Date().getFullYear()} ${escapeHtml(APP)}. All rights reserved.</p>
    </td>
  </tr>`;
}

/**
 * @param {object}  opts
 * @param {string}  opts.title       <title> element; not rendered in the body
 * @param {string}  opts.preheader   inbox preview line — always set it explicitly
 * @param {string}  opts.bodyHtml    pre-composed blocks
 * @param {?string} opts.logoSrc     image src, or null for the text wordmark.
 *                                   Defaults to the CID the mailer attaches.
 * @param {?string} opts.footerNote  extra footer line above the copyright
 */
export function baseLayout({
  title,
  preheader,
  bodyHtml,
  logoSrc = `cid:${logo.cid}`,
  footerNote = null,
}) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<!-- format-detection stops iOS turning the OTP digits into a phone link -->
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
<!-- Pin the light treatment: this design is a light card by choice, and client
     auto-inversion turns it into unreadable grey-on-grey. -->
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>${escapeHtml(title)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style type="text/css">
  /* Additive only. Every rule below is a refinement — the email must be
     correct with this whole block stripped, because many clients do strip it. */
  body { margin:0 !important; padding:0 !important; width:100% !important; }
  table { border-collapse:collapse !important; }
  img { -ms-interpolation-mode:bicubic; }
  a { text-decoration:none; }
  /* Gmail/Outlook.com dark mode: [data-ogsc] is the attribute they stamp on
     elements while inverting. Re-pin the surfaces we care about. */
  [data-ogsc] .m-panel { background-color:${color.panel} !important; }
  [data-ogsc] .m-card  { background-color:${color.card}  !important; }
  [data-ogsc] .m-text  { color:${color.text} !important; }
  [data-ogsc] .m-muted { color:${color.muted} !important; }
  @media (prefers-color-scheme: dark) {
    .m-panel { background-color:${color.panel} !important; }
    .m-card  { background-color:${color.card}  !important; }
    .m-text  { color:${color.text} !important; }
    .m-muted { color:${color.muted} !important; }
  }
  /* The last block in the card carries its own bottom margin on top of the
     card padding, which reads as bottom-heavy. Purely cosmetic, so it lives
     here — if a client strips this block the layout is merely a little loose. */
  .m-card p:last-child, .m-card table:last-child { margin-bottom:0 !important; }
  @media only screen and (max-width:620px) {
    .m-wrap  { width:100% !important; }
    .m-pad   { padding-left:20px !important; padding-right:20px !important; }
    .m-inset { padding-left:12px !important; padding-right:12px !important; }
  }
</style>
</head>
<body class="m-panel" style="margin:0;padding:0;background-color:${color.panel};">
${preheaderBlock(preheader)}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="m-panel" style="background-color:${color.panel};">
  <tr>
    <td align="center" class="m-inset" style="padding:24px ${metrics.gutter}px 8px ${metrics.gutter}px;">

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${metrics.width}" class="m-wrap" style="width:${metrics.width}px;max-width:${metrics.width}px;">
        ${headerBand(logoSrc)}
        <tr>
          <td class="m-inset" style="padding:24px 0 0 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" class="m-card" bgcolor="${color.card}" style="background-color:${color.card};border-radius:${metrics.cardRadius}px;">
              <tr>
                <td class="m-pad m-text" style="padding:${metrics.cardPadding}px;font-family:${font.sans};color:${color.text};">
${bodyHtml}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        ${footerBlock(footerNote)}
      </table>

    </td>
  </tr>
</table>
</body>
</html>`;
}
