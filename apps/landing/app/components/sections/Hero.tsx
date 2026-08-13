"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/app/components/ui/Button";
import { Container } from "@/app/components/ui/Container";
import { Tilt } from "@/app/components/motion/Float";

const EASE = [0.22, 1, 0.36, 1] as const;

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="transition-transform group-hover:translate-x-0.5"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const TRUST = [
  "Works on iPhone 7+ & Android",
  "No app to download",
  "Ships in 2–3 days",
];

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background pt-16 sm:pt-20">
      {/* layered ambient glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[38%] top-[34%] -z-0 size-[640px] -translate-x-1/2 rounded-full bg-accent/15 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 -z-0 size-[420px] translate-x-1/3 rounded-full bg-emerald-400/[0.07] blur-[130px]"
      />

      <Container size="full" className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-12 lg:py-28">
        {/* Card visual */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92, rotate: -5 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative order-2 mx-auto flex w-full max-w-[480px] justify-center lg:order-1"
        >
          <Tilt max={9} className="w-full">
            <motion.div
              animate={reduce ? undefined : { y: [0, -16, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Image
                src="/cards/hero-card.png"
                alt="Facile matte black NFC smart card with laser-engraved QR code"
                width={560}
                height={560}
                priority
                sizes="(min-width: 1024px) 480px, 90vw"
                className="h-auto w-full drop-shadow-[0_50px_90px_rgba(0,0,0,0.65)]"
              />
            </motion.div>
          </Tilt>
        </motion.div>

        {/* Copy */}
        <div className="order-1 flex flex-col items-center text-center lg:order-2 lg:items-start lg:text-left">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3.5 py-1.5 text-xs font-medium tracking-tight text-foreground/70"
          >
            <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
            NFC smart cards · trusted by 10,000+ professionals
          </motion.span>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
            className="font-display mt-6 text-balance text-5xl font-medium leading-[0.98] tracking-tight text-foreground sm:text-6xl lg:text-[80px]"
          >
            One tap.
            <br />
            <span className="text-gradient">Unforgettable.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-foreground/65"
          >
            A card you tap on any phone to share your contact, links, and
            socials in under a second. Update your profile anytime — the card
            never changes.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button href="/products" variant="primary" size="lg" className="group">
              Order your card
              <ArrowIcon />
            </Button>
            <Button href="/#how-it-works" variant="secondary" size="lg">
              See how it works
            </Button>
          </motion.div>

          <motion.ul
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.28, ease: EASE }}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
          >
            {TRUST.map((item) => (
              <li
                key={item}
                className="flex items-center gap-1.5 text-[13px] text-foreground/50"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-400/80"
                  aria-hidden
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {item}
              </li>
            ))}
          </motion.ul>
        </div>
      </Container>
    </section>
  );
}
