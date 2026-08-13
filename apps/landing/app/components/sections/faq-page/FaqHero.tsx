"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/app/components/ui/Container";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Dark FAQ hero — eyebrow, big display heading with a single gradient accent
 * word, and a refined glass search field. The search input is presentational
 * (the FAQ is a static page), so it has no submit behaviour.
 */
export function FaqHero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      {/* layered ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] -z-0 size-[640px] -translate-x-1/2 rounded-full bg-accent/15 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/3 -z-0 size-[420px] translate-x-1/3 rounded-full bg-emerald-400/[0.06] blur-[140px]"
      />

      <Container
        size="lg"
        className="relative flex flex-col items-center py-24 text-center sm:py-32"
      >
        <motion.span
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3.5 py-1.5 text-xs font-medium tracking-tight text-foreground/70"
        >
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          Help Center · FAQ
        </motion.span>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          className="font-display mt-7 text-balance text-5xl font-medium leading-[0.98] tracking-tight sm:text-6xl lg:text-[76px]"
        >
          Questions?
          <br />
          We&apos;ve got <span className="text-gradient">answers</span>.
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
          className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-foreground/65 sm:text-lg"
        >
          Everything you need to know about Facile cards — how the tap works,
          which phones it supports, and how your profile stays private and
          always up to date.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="glass mt-10 flex w-full max-w-md items-center gap-3 rounded-full px-5 py-3.5 text-left transition-shadow focus-within:ring-2 focus-within:ring-accent/40"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="shrink-0 text-foreground/50"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search questions..."
            aria-label="Search questions"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground/45 focus:outline-none"
          />
        </motion.div>
      </Container>
    </section>
  );
}
