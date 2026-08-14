// Render every transactional email to HTML you can open in a browser.
//
//   npm run preview:email        render to .email-previews/ and open index.html
//   npm run preview:email:lint   fail if any template uses email-hostile CSS
//   npm run preview:email:send   actually send one of each (see EMAIL_PREVIEW_TO)
//
// This imports only the render layer — no models, no DB connection. It is a
// separate node process, so nodemon's state is irrelevant and template edits
// are always picked up.
//
// NOTE: the npm scripts hardcode NODE_ENV=dev. config/index.js defaults to
// "prod" and would otherwise load .env — i.e. PRODUCTION mail credentials.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { renderTemplate, templates, templateKeys } from "../utils/email/index.js";
import { logoBuffer } from "../utils/email/transport.js";
import { logo } from "../utils/email/tokens.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "..", ".email-previews");

const args = process.argv.slice(2);
const MODE = args.includes("--send") ? "send" : args.includes("--lint") ? "lint" : "render";

// Patterns that do not survive real email clients. background-clip and
// -webkit-text-fill-color are here specifically because the original OTP
// template used them, which made the verification code invisible in Outlook.
const FORBIDDEN = [
  [/display\s*:\s*flex/i, "display:flex — unsupported in Outlook"],
  [/display\s*:\s*grid/i, "display:grid — unsupported in Outlook"],
  [/backdrop-filter/i, "backdrop-filter — unsupported almost everywhere"],
  [/box-shadow/i, "box-shadow — dropped by Outlook, unreliable elsewhere"],
  [/background-clip/i, "background-clip — renders text INVISIBLE in Outlook"],
  [/-webkit-text-fill-color/i, "-webkit-text-fill-color — renders text INVISIBLE in Outlook"],
  [/position\s*:\s*absolute/i, "position:absolute — unsupported in Outlook"],
  [/\$\{/, "unresolved ${...} — a template literal leaked into the output"],
  // A double quote inside a style attribute closes it early and silently drops
  // every declaration after it. Font stacks are where this bites: "SF Pro Text"
  // rendered the entire email in Times until the families were single-quoted.
  [
    /font-family:[^;"]*"/,
    'double quote inside a style attribute — use single quotes for font family names',
  ],
];

function renderAll() {
  // Swap the CID reference for a data: URI so the browser shows the real logo.
  const logoSrc = logoBuffer
    ? `data:image/png;base64,${logoBuffer.toString("base64")}`
    : null;

  return templateKeys.map((key) => {
    const t = templates[key];
    const { subject, html, text } = renderTemplate(key, t.sample || {}, { logoSrc });
    return { key, subject, html, text };
  });
}

function lint(rendered) {
  let failures = 0;
  for (const { key, html } of rendered) {
    for (const [pattern, why] of FORBIDDEN) {
      if (pattern.test(html)) {
        console.error(`  FAIL  ${key}: ${why}`);
        failures++;
      }
    }
  }
  if (failures === 0) {
    console.log(`  PASS  ${rendered.length} templates, ${FORBIDDEN.length} rules, no violations.`);
    return 0;
  }
  console.error(`\n${failures} violation(s).`);
  return 1;
}

function indexPage(rendered) {
  const cards = rendered
    .map(
      ({ key, subject, html }) => `
  <section>
    <h2>${key}</h2>
    <p class="subj">Subject: <strong>${subject}</strong></p>
    <div class="frames">
      <div><span>desktop · 600px</span><iframe src="${key}.html" width="620" height="800"></iframe></div>
      <div><span>mobile · 375px</span><iframe src="${key}.html" width="375" height="800"></iframe></div>
    </div>
  </section>`
    )
    .join("\n");

  return `<!doctype html><html><head><meta charset="utf-8"><title>Facile email previews</title>
<style>
  body{font:14px -apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;background:#111;color:#eee;margin:0;padding:32px}
  h1{font-size:20px;margin:0 0 4px}
  .meta{color:#888;margin:0 0 32px}
  section{margin:0 0 48px;border-top:1px solid #333;padding-top:24px}
  h2{font-size:15px;font-family:ui-monospace,Menlo,monospace;color:#4f7cff;margin:0 0 4px}
  .subj{color:#888;margin:0 0 16px;font-size:13px}
  .frames{display:flex;gap:24px;flex-wrap:wrap}
  .frames span{display:block;color:#666;font-size:11px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
  iframe{border:1px solid #333;background:#fff}
</style></head><body>
<h1>Facile transactional emails</h1>
<p class="meta">${rendered.length} templates · generated ${new Date().toISOString()}</p>
${cards}
</body></html>`;
}

function main() {
  const rendered = renderAll();

  if (MODE === "lint") {
    console.log("Linting rendered email HTML...");
    process.exit(lint(rendered));
  }

  if (MODE === "send") {
    return send(rendered);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const { key, html, text } of rendered) {
    fs.writeFileSync(path.join(OUT_DIR, `${key}.html`), html);
    if (text) fs.writeFileSync(path.join(OUT_DIR, `${key}.txt`), text);
  }
  fs.writeFileSync(path.join(OUT_DIR, "index.html"), indexPage(rendered));

  console.log(`Rendered ${rendered.length} templates:\n`);
  for (const { key, subject, html } of rendered) {
    console.log(`  ${key.padEnd(24)} ${(html.length / 1024).toFixed(1)}kb  "${subject}"`);
  }
  console.log(`\nOpen: ${path.join(OUT_DIR, "index.html")}`);
  const code = lint(rendered);
  if (code !== 0) process.exit(code);
}

async function send(rendered) {
  const to = process.env.EMAIL_PREVIEW_TO;
  if (!to) {
    console.error("Set EMAIL_PREVIEW_TO to a real address, e.g.");
    console.error("  EMAIL_PREVIEW_TO=you@gmail.com npm run preview:email:send");
    process.exit(1);
  }
  // Plus-tag each message so every template lands in its own Gmail thread.
  const [user, domain] = to.split("@");
  const { sendTemplateEmail } = await import("../utils/email/index.js");

  for (const { key } of rendered) {
    const target = domain ? `${user}+facile-${key}@${domain}` : to;
    try {
      await sendTemplateEmail({
        to: target,
        template: key,
        data: templates[key].sample || {},
      });
      console.log(`  sent  ${key.padEnd(24)} -> ${target}`);
    } catch (err) {
      console.error(`  FAIL  ${key.padEnd(24)} -> ${target}: ${err.message}`);
    }
  }
}

main();
