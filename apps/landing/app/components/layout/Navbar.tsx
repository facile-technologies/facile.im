"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/app/lib/cn";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";
import { Button } from "@/app/components/ui/Button";

type NavLink = {
  label: string;
  href: string;
  /** When present, hovering opens the category mega-menu. */
  menu?: boolean;
};

const links: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products", menu: true },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/faq" },
];

/** Grouped text-link columns shown in the Products mega-menu and mobile submenu. */
type MenuColumn = { heading: string; links: { label: string; href: string }[] };

const productMenu: MenuColumn[] = [
  {
    heading: "Shop",
    links: [
      { label: "NFC Cards", href: "/products?cat=nfc" },
      { label: "Metal Cards", href: "/products?cat=metal" },
      { label: "Smart Bands", href: "/products?cat=bands" },
      { label: "Bundles", href: "/products?cat=bundles" },
    ],
  },
  {
    heading: "Quick links",
    links: [
      { label: "All Products", href: "/products" },
      { label: "How it works", href: "/features" },
      { label: "Compare", href: "/devices#compare" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "For business",
    links: [
      { label: "Team Plans", href: "/products?cat=bundles" },
      { label: "Bulk Orders", href: "/faq" },
    ],
  },
];

export function Navbar() {
  const [open, setOpen] = useState(false); // mobile drawer
  const [mobileProducts, setMobileProducts] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduce = useReducedMotion();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  // Dashboard lives at /app on the same domain in prod; dev overrides via env.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "/app";

  return (
    <header
      onMouseLeave={() => {
        setHovered(null);
        setMenuOpen(false);
      }}
      className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl backdrop-saturate-150"
    >
      <nav className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Facile home" className="relative z-10">
          <Wordmark surface="auto" priority />
        </Link>

        {/* Desktop links with a sliding glass hover pill */}
        <div
          className="relative hidden items-center md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {links.map((l) => (
            <div
              key={l.href}
              className="relative"
              onMouseEnter={() => {
                setHovered(l.href);
                setMenuOpen(Boolean(l.menu));
              }}
            >
              <Link
                href={l.href}
                className={cn(
                  "relative z-10 inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors",
                  isActive(l.href) || hovered === l.href
                    ? "text-foreground"
                    : "text-foreground/70"
                )}
              >
                {l.label}
                {l.menu && (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className={cn(
                      "mt-px text-foreground/50 transition-transform duration-300",
                      menuOpen && hovered === l.href && "rotate-180"
                    )}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                )}
              </Link>
              {hovered === l.href && (
                <motion.span
                  layoutId="nav-hover-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-border bg-foreground/[0.07] backdrop-blur-sm"
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 450, damping: 38 }
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={`${appUrl}/login`}
            aria-label="Log in"
            className="inline-flex size-9 items-center justify-center rounded-full text-current/80 transition-colors hover:bg-foreground/10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="7" r="4" />
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            </svg>
          </a>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full hover:bg-foreground/10 md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* Full-viewport dim/blur backdrop behind the mega-menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mega-backdrop"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 top-16 z-40 hidden bg-black/50 backdrop-blur-sm md:block"
          />
        )}
      </AnimatePresence>

      {/* Products mega-menu — opaque dark, text-column panel that expands on hover */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mega"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }
            }
            className="absolute inset-x-0 top-full z-50 hidden border-b border-border bg-card md:block"
          >
            <div className="mx-auto grid w-full max-w-[1120px] grid-cols-[1.4fr_1fr] gap-10 px-5 py-8 sm:px-8">
              {/* Left: grouped text-link columns */}
              <div className="grid grid-cols-3 gap-8">
                {productMenu.map((col) => (
                  <div key={col.heading} className="flex flex-col gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {col.heading}
                    </span>
                    <div className="flex flex-col gap-2">
                      {col.links.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: featured promo block */}
              <div className="rounded-2xl border border-border bg-foreground/[0.03] p-6">
                <span className="relative mx-auto block h-28 w-full">
                  <Image
                    src="/images/phone-card.png"
                    alt="Facile smart card and phone"
                    fill
                    sizes="320px"
                    className="object-contain"
                  />
                </span>
                <h3 className="font-display mt-4 text-base font-semibold text-foreground">
                  Your Profile, One Tap Away
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Share contacts, links, and socials instantly — no app needed.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Button href="/products" variant="primary" size="sm">
                    Shop Cards
                  </Button>
                  <Button href="/pay" variant="secondary" size="sm">
                    Create Profile
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-border transition-[max-height] duration-300 md:hidden",
          open ? "max-h-[640px] border-t" : "max-h-0"
        )}
      >
        <div className="flex flex-col gap-1 px-5 py-3">
          {links.map((l) =>
            l.menu ? (
              <div key={l.href}>
                <button
                  type="button"
                  onClick={() => setMobileProducts((v) => !v)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground/80 hover:bg-foreground/5"
                >
                  {l.label}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                    className={cn(
                      "text-foreground/50 transition-transform duration-300",
                      mobileProducts && "rotate-180"
                    )}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-[max-height] duration-300",
                    mobileProducts ? "max-h-[640px]" : "max-h-0"
                  )}
                >
                  <div className="ml-2 flex flex-col gap-4 border-l border-border pl-3 py-2">
                    {productMenu.map((col) => (
                      <div key={col.heading} className="flex flex-col gap-1">
                        <span className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
                          {col.heading}
                        </span>
                        {col.links.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="rounded-lg px-2 py-2 text-[13px] text-foreground/70 hover:bg-foreground/5"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-foreground/80 hover:bg-foreground/5"
              >
                {l.label}
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
