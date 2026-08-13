"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/app/components/ui/Container";
import { Tilt } from "@/app/components/motion/Float";
import { Reveal } from "@/app/components/motion/Reveal";
import { PayCardVisual } from "./PayCardVisual";

const GRADIENT =
  "linear-gradient(155deg, #c4b5fd 0%, #7dd3fc 50%, #6ee7b7 100%)";

/* ── icons (stroked on dark) ─────────────────────────────────────────── */

function WifiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e5e5e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.55a11 11 0 0 1 14 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

function IdIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e5e5e5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2.5" />
      <circle cx="8" cy="11" r="2" />
      <path d="M5.5 16.5a3 3 0 0 1 5 0" />
      <line x1="14" y1="10" x2="18" y2="10" />
      <line x1="14" y1="14" x2="18" y2="14" />
    </svg>
  );
}

/* ── one value block ─────────────────────────────────────────────────── */

function ValueBlock({
  icon,
  tag,
  title,
  body,
}: {
  icon: React.ReactNode;
  tag: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-[14px] border border-white/[0.07] bg-white/[0.04]">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-[#6ee7b7]">
          {tag}
        </p>
        <h3 className="mt-3 text-xl font-bold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-2 max-w-[360px] text-sm leading-relaxed text-[#888]">
          {body}
        </p>
      </div>
    </div>
  );
}

export function PayOneTap() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#080808] py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6ee7b7]/[0.04] blur-[160px]"
      />

      <Container size="lg">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#444]">
              One tap, two jobs
            </p>
            <h2 className="mt-3 font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-5xl md:text-[60px] md:leading-[1.02]">
              Pays the bill. Makes the
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: GRADIENT }}
              >
                {" "}
                introduction.
              </span>
            </h2>
            <p className="mt-4 text-lg text-[#888]">
              Faster than cash. Sharper than a business card. Hold it near any
              reader to pay — or near any phone to drop your full profile.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
          {/* ── card visual ──────────────────────────────────────── */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative flex items-center justify-center">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-8 bottom-6 -z-0 h-40 rounded-full bg-[#7dd3fc]/[0.08] blur-[60px]"
              />
              <motion.div
                animate={reduce ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <Tilt max={9}>
                  <PayCardVisual width={420} className="max-w-full" />
                </Tilt>
              </motion.div>

              {/* swatch + price chip */}
              <div className="absolute -bottom-3 left-2 flex items-center gap-3 rounded-full border border-white/[0.08] bg-[#161616] px-4 py-2.5">
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded-[6px] border border-white/15 bg-[#1a1a1a]" />
                  <span className="size-3 rounded-[6px] border border-white/15 bg-[#9ca3af]" />
                  <span className="size-3 rounded-[6px] border border-white/15 bg-[#f3f4f6]" />
                </span>
                <span className="text-[13px] text-[#888]">From $29</span>
              </div>
            </div>
          </Reveal>

          {/* ── value blocks ─────────────────────────────────────── */}
          <div className="order-1 flex flex-col gap-10 lg:order-2">
            <Reveal>
              <p className="text-[26px] font-bold leading-tight tracking-tight text-white sm:text-[30px]">
                Tap.{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: GRADIENT }}
                >
                  Paid.
                </span>{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: GRADIENT }}
                >
                  Shared.
                </span>
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <ValueBlock
                icon={<WifiIcon />}
                tag="Tap to pay"
                title="The payment card."
                body="Brushed metal, milled to 0.8mm. Hold it near any reader to settle the bill in 0.3 seconds — fully standalone, no app, no phone, no PIN."
              />
            </Reveal>

            <Reveal delay={0.12}>
              <ValueBlock
                icon={<IdIcon />}
                tag="Tap to share"
                title="Pay and share, as one."
                body="The same tap that settles the bill can hand over your full Facile profile — links, socials, contact, all of it, on any phone."
              />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
