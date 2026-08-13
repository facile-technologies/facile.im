# Facile — Build Handoff / Progress

Living doc to resume work without losing context. Last updated: 2026-06-12.

## Round 2 — navigation, Devices, logo, working checkout (2026-06-12)
- **Navbar** (`app/components/layout/Navbar.tsx`): links now Features · Devices · Shops · Pay · FAQ.
- **Devices `/devices`** built (frame `88:1264`): `app/devices/page.tsx` + `sections/devices/*`
  (8 sections) + images in `public/devices/`.
- **Footer** (`app/components/layout/Footer.tsx`): dropped all dead `#` links; columns now
  PRODUCT (Features/Devices/Shops/Pay/Pricing) + SUPPORT (FAQ/Designs). Logo now uses the same
  `<Wordmark/>` as the header (footer scoped `.light` so the wordmark stays dark on its white bg).
- **Logo**: header + footer unified on `<Wordmark/>` (single source). ⏳ A NEW logo from the
  client's Figma link is still pending — when provided, export to `public/brand/` and update the
  one `Wordmark.tsx`; both header & footer pick it up.
- **Checkout is now a working mock flow** (no backend/real payments): new
  `app/components/cart/CartContext.tsx` (localStorage-persisted) mounted in `app/checkout/layout.tsx`.
  Product buttons across products/shops/devices link to `/checkout?product=<id>`; `checkout-data.ts`
  is the catalog + promo/shipping config. Cart reflects product+qty, promo `FACILE10`/`WELCOME15`
  apply, order summary + totals are live, shipping/payment forms validate before advancing, and
  confirmation shows the ordered item then clears the cart. Verified end-to-end in the browser.
  (The explicit "Go to Shopify Store" CTA in `ShopCta.tsx` stays external by design.)
- `pnpm build` green (14 routes); new/changed files lint-clean (pre-existing `ThemeToggle.tsx`
  lint error remains, untouched). No mobile horizontal overflow on the new/changed routes.

## What this is
Marketing + commerce site for **Facile**, an NFC "all-in-one link" smart card
(Linktree-style profile on a tap-to-share physical card). Dark, premium aesthetic.
Built faithfully from a **client-approved Figma**, with motion/interactions layered on
top (things Figma can't express), responsive, plus a light/dark theme toggle.

Stack: **Next.js 16.2.9 + React 19.2 + Tailwind v4**, `motion` (Framer Motion
successor), `next-themes`. ⚠️ Custom Next.js build — read `node_modules/next/dist/docs`
before writing Next-specific code.

## Figma source (source of truth)
File key: `ACxTmGarxGmQIE1gWtBasH`. Read via the Figma MCP
(`get_metadata` → `get_design_context` / `get_screenshot` / `download_assets`).

| Page | Frame node | Route |
| --- | --- | --- |
| Landing | `209:2271` | `/` ✅ |
| Products | `209:3004` | `/products` |
| Shops | `210:3607` | `/shops` |
| Features | `211:4388` | `/features` |
| Facile Pay | `244:62` | `/pay` |
| FAQ | `213:5396` | `/faq` |
| Checkout flow | `128:1371`, `131:2244`, `131:2402`, `131:2547`, `131:2713` | `/checkout` |

Landing section → frame: Hero `20:3692` · Marquee `209:2276` · Bento "The card. The
profile." `247:2424` · How It Works `247:2588` · Pricing `209:2360` · Stats+Testimonials
`209:2633` · FAQ `244:1042` · Final CTA `209:2933` · Footer `209:2549` · Nav `74:25`.

## Architecture
- `app/globals.css` — Tailwind v4 `@theme` tokens. Semantic: `background/foreground`,
  `muted(-foreground)`, `border(-strong)`, `card(-foreground)`,
  `panel(-foreground/-muted/-border)`, `primary(-foreground)`, `accent`. **Dark-first**
  (`:root, .dark`) with a `.light` override. Site alternates dark page sections and
  light "panel" sections. Utilities: `.font-display` (SF-Pro stack for big headings),
  `.facile-gradient` (brand conic gradient), `.animate-marquee`.
- `app/layout.tsx` — Inter font, metadata, `ThemeProvider`, global `Navbar` + `Footer`
  wrap every route. So **page files only render their own content.**
- `app/components/ui/*` — `Container` (size sm/md/lg), `Button` (variant + size, `href`
  → Link), `SectionHeading`, `Card` (tone card/panel/plain), `Badge`.
- `app/components/layout/*` — `Navbar` (client, mobile menu), `Footer`, `Wordmark`
  (gradient ring + "facile"), `ThemeToggle` (next-themes, mount-guarded).
- `app/components/motion/*` — `Reveal` (scroll entrance), `Stagger`/`StaggerItem`. Both
  client, both respect `prefers-reduced-motion`. Safe to use inside server components.
- `app/components/sections/*` — landing sections; per-page sections under
  `sections/<route>/`.
- `app/lib/cn.ts` — dependency-free className combiner.

## Conventions (and how subagents build pages)
Foundation-first, then **one subagent per page/section in parallel**. Each agent:
reuses `ui`/`layout`/`motion`/`lib` (never edits them), creates only its own route +
`sections/<route>/` files + `public/<route>/` assets, matches each section's tone
(dark vs light panel) to Figma, adds responsive + tasteful motion, verifies its route
returns HTTP 200. See memory `facile-build-workflow`.

## Status — ALL PAGES COMPLETE ✅ (`pnpm build` green, 13 static routes)
- ✅ **Landing `/`** — 8 sections faithful to Figma, motion, responsive.
- ✅ **Products `/products`** — route + `sections/products/*` + 8 assets in `public/products/`.
- ✅ **Shops `/shops`** — `app/shops/page.tsx` composes `ShopHero → TrustRow → Catalog →
  PopularRow → ShopCta` (frame `210:3607`; PopularRow + ShopCta added to match the frame).
- ✅ **Features `/features`** — `app/features/page.tsx`, 7 sections (FeaturesHero,
  DigitalProfile + new LinkInBio, Analytics, Customisation, ShareYourWay, FeaturesCta) from
  frame `211:4388`. All visuals CSS-built.
- ✅ **FAQ `/faq`** — `app/faq/page.tsx` composes `FaqHero → FaqProductStrip (new) →
  FaqAccordion → FaqContact` (frame `213:5396`).
- ✅ **Checkout** — separate routes: `/checkout` (cart), `/checkout/shipping`,
  `/checkout/payment`, `/checkout/confirmation` + shared `sections/checkout/*`
  (StepIndicator, OrderSummary, CheckoutShell, Field, CartReview, ShippingForm, PaymentForm,
  Confirmation, checkout-data). Designed UI only, mock data, no backend (frames `128:1371`,
  `131:2244/2402/2547/2713`).
- ✅ **Facile Pay `/pay`** — `app/pay/page.tsx`, 8 sections in `sections/pay/*` (frame
  `244:62`). All CSS-built (matte-black card via `PayCardVisual`).

### QA done (2026-06-12)
- `pnpm build` green (TS clean); `pnpm lint` clean for all new page/section files (2 remaining
  lint errors are pre-existing in foundation `ThemeToggle.tsx` / `Button.tsx`, untouched).
- Every route returns 200; no mobile horizontal overflow. Fixed: `/checkout` cart grid
  overflow (added `min-w-0` + `minmax(0,1fr)` track in `CartReview.tsx`).
- Dark mode (the shipped default — `defaultTheme="dark"`, `enableSystem={false}`) verified
  correct on all pages. Light-mode fix: `PayHero` hero is always dark, so it now carries the
  `dark` token-scope class (its ghost CTA was invisible in light mode otherwise).
- Known/accepted: other hardcoded-dark sections aren't pixel-perfect in light mode — dark is
  the client's review target (per design). No breakage, just not fully theme-adaptive.

## Run / verify
- Dev: `pnpm dev` → http://localhost:3000 (falls back to **3003** if 3000 busy).
  Current session's server runs on **3003**; log at `/tmp/facile-dev.log`.
- Build: `pnpm build` (also type-checks). Lint: `pnpm lint`.
- Branch: `build/facile-site`.

## Deploy (do at the end — needs the client's Vercel login)
Option A (fastest): client runs `npx vercel` in the project and follows prompts → live
preview URL. Option B: push to a GitHub repo, then connect it on vercel.com for
per-push previews. No env vars / backend required (fully static).

## Remaining
Only deploy is left (needs the client's Vercel login — see the Deploy section above). All
pages are built, the build is green, and basic responsive/dark-mode QA is done. Optional
future polish: full light-mode theming of the hardcoded-dark sections.
