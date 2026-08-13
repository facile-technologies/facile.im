"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/app/components/ui/Button";
import { Tilt } from "@/app/components/motion/Float";
import { PayCardVisual } from "./PayCardVisual";

const GRADIENT =
  "linear-gradient(155deg, #c4b5fd 0%, #7dd3fc 50%, #6ee7b7 100%)";

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

export function PayHero() {
  const reduce = useReducedMotion();

  return (
    <section className="dark relative overflow-hidden bg-[#080808] pt-28 sm:pt-32">
      {/* soft radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 -z-0 size-[760px] translate-x-1/4 -translate-y-1/4 rounded-full bg-[#7dd3fc]/[0.06] blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0 -z-0 size-[620px] -translate-x-1/3 translate-y-1/4 rounded-full bg-[#c4b5fd]/[0.05] blur-[150px]"
      />

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-16 px-5 pb-24 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-10 lg:px-12 lg:pb-28">
        {/* ── left: copy ──────────────────────────────────────────── */}
        <div className="max-w-[560px]">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-block rounded-full p-px"
            style={{ backgroundImage: GRADIENT }}
          >
            <span className="block rounded-full bg-[#161616] px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              Introducing Facile Pay
            </span>
          </motion.span>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease }}
            className="mt-8 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-[80px] md:leading-[0.96]"
          >
            One card.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: GRADIENT }}
            >
              Pay and be known.
            </span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease }}
            className="mt-7 max-w-[480px] text-pretty text-lg leading-relaxed text-[#888]"
          >
            Facile Pay is one brushed-metal card that taps to pay and taps to
            share your profile. Contactless everywhere — no phone, no app, no
            PIN.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease }}
            className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center"
          >
            <Button href="/products" size="md" className="group">
              Order Facile Pay
              <ArrowIcon />
            </Button>
            <Button href="#how-it-works" variant="ghost" size="md">
              See How It Works
            </Button>
          </motion.div>

          {/* trust row */}
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? undefined : { opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.26 }}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#555]"
          >
            <span className="text-[#777]">★★★★★ 4.9</span>
            <span className="text-[#333]">·</span>
            <span>10,000+ professionals</span>
            <span className="text-[#333]">·</span>
            <span>0.3s tap-to-pay</span>
          </motion.div>
        </div>

        {/* ── right: card + floating chips ────────────────────────── */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="relative flex w-full items-center justify-center"
        >
          {/* glow under the card */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-10 bottom-4 -z-0 h-44 rounded-full bg-[#7dd3fc]/[0.08] blur-[70px]"
          />

          <motion.div
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <Tilt max={9}>
              <PayCardVisual width={460} priority className="max-w-full" />
            </Tilt>
          </motion.div>

          {/* "Paid & shared" chip — bottom-left */}
          <div
            className="absolute -bottom-2 left-0 rounded-full p-px sm:-left-4"
            style={{ backgroundImage: GRADIENT }}
          >
            <div className="flex items-center gap-2 rounded-full bg-[#161616] px-4 py-2.5">
              <span className="size-[7px] rounded-[3.5px] bg-[#6ee7b7] shadow-[0_0_6px_rgba(110,231,183,0.8)]" />
              <span className="font-mono text-xs text-white">
                Paid &amp; shared
              </span>
              <span className="text-[10px] font-semibold tracking-wide text-[#6ee7b7]">
                0.3s
              </span>
            </div>
          </div>

          {/* "Today's taps" mini card — top-right */}
          <div className="absolute -right-2 top-2 hidden w-[168px] flex-col gap-1.5 rounded-[14px] border border-white/[0.08] bg-[#161616] px-4 py-3 sm:flex lg:-right-6">
            <p className="text-center text-[11px] tracking-[0.07em] text-[#555]">
              TODAY&apos;S TAPS
            </p>
            <p className="text-center text-base font-bold tracking-tight text-white">
              847 payments
            </p>
            <div className="flex h-[52px] items-end gap-1">
              {[10, 18, 15, 26, 21, 33, 27, 39, 31, 44, 37, 52].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[3px]"
                  style={{
                    height: `${h}px`,
                    backgroundImage:
                      i >= 9
                        ? "linear-gradient(to bottom, #6ee7b7, rgba(110,231,183,0.4))"
                        : undefined,
                    backgroundColor:
                      i >= 9 ? undefined : "rgba(255,255,255,0.07)",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
