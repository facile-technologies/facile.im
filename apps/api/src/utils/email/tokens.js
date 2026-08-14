// Design tokens for transactional email.
//
// These mirror packages/tailwind-preset/theme.css, which is the app's source of
// truth. They are duplicated here rather than imported because the API has no
// build step and cannot read the frontend's CSS — if theme.css changes, update
// these by hand.
//
// Email note: the app is dark-first, but these emails use the "light panel"
// treatment (the same one the landing footer and pricing sections use). A black
// header band carries the brand; the body stays light so Outlook and dark-mode
// inversion can't wreck it.

export const color = {
  // Header band
  black: "#000000",
  onBlack: "#ffffff",
  onBlackMuted: "#8a8a8a",

  // Body
  panel: "#f4f3ef", // warm off-white page background
  card: "#ffffff",
  text: "#0a0a0a", // --panel-foreground
  muted: "#6f6f6f", // --panel-muted
  faint: "#999999", // footer
  border: "#e4e2dc", // hairline on the warm panel

  // Accent
  accent: "#4f7cff",
  onAccent: "#ffffff",

  // Status (from the dashboard's light-theme values)
  success: "#16a34a",
  successBg: "#eefbf3",
  warning: "#d97706",
  warningBg: "#fff8ec",
  danger: "#ef4444",
  dangerBg: "#fef2f2",
};

// The signature Facile gradient. In-app it is a conic gradient; email clients
// that support gradients at all only handle linear reliably, so it flattens to
// a horizontal sweep. `fallback` is what Outlook actually renders — it drops
// background-image and honours the bgcolor attribute instead.
export const gradient = {
  stops: "#ff5f6d, #ffc371, #4f7cff, #5fffa6",
  fallback: color.accent,
};

// No webfonts: email clients strip @font-face, and this is the same system
// stack the site ships (real SF Pro on Apple devices, clean fallback elsewhere).
// Family names use SINGLE quotes deliberately. These strings are interpolated
// into double-quoted HTML style attributes — a double quote here closes the
// attribute early and silently kills every declaration after it, which renders
// the whole email in Times.
export const font = {
  sans: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "'SF Mono', ui-monospace, Menlo, Consolas, 'Courier New', monospace",
};

export const metrics = {
  width: 600, // outer table width; the email standard
  cardRadius: 16, // matches the app's rounded-2xl cards
  chipRadius: 12,
  cardPadding: 32,
  gutter: 16, // inset from panel edge to card on mobile
};

// Logo display size. The asset is 400x104 so this renders ~2.7x for retina.
export const logo = {
  width: 150,
  height: 39,
  cid: "facile-logo",
};
