"use client";

import { motion, useReducedMotion } from "motion/react";
import { Media } from "@/app/components/ui/Media";
import { Button } from "@/app/components/ui/Button";

/**
 * Devices hero — "Your Profile, One Tap Away" (per Figma node 20:3692).
 * Dark section: the floating NFC card visual on the left, copy on the right with
 * a large two-line headline, supporting line, and the order / how-it-works pair.
 */
export function DevicesHero() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-background pt-20 sm:pt-24">
      <div className="mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:py-24">
        {/* Product visual */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, rotate: -4 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 mx-auto flex w-full max-w-[480px] justify-center lg:order-1"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -16, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full"
          >
            <Media
              src="/devices/hero-card.png"
              alt="Facile NFC smart cards stacked, matte black with QR fallback"
              width={560}
              height={560}
              priority
              sizes="(min-width: 1024px) 480px, 85vw"
              className="h-auto w-full drop-shadow-[0_50px_90px_rgba(0,0,0,0.65)]"
            />
          </motion.div>
        </motion.div>

        {/* Copy */}
        <div className="order-1 flex flex-col items-center text-center lg:order-2">
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-balance text-5xl font-medium leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-[88px] lg:leading-[0.98]"
          >
            Your Profile,
            <br />
            One Tap Away
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-foreground/80 sm:text-xl"
          >
            Smart NFC cards that instantly share your contact information,
            portfolio, and social media. No apps required.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button href="/checkout?product=metal" variant="secondary" size="lg" className="group">
              Order Your Card
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
            </Button>
            <Button href="#how-it-works" variant="secondary" size="lg">
              See How It Works
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
