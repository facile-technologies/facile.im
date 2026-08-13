"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/app/components/ui/Button";
import { PayCardVisual } from "./PayCardVisual";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PayFinalCTA() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-t border-white/[0.04] bg-[#080808] py-28">
      {/* soft glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-10 -z-0 size-[600px] -translate-x-1/2 rounded-full bg-[#c4b5fd]/[0.06] blur-[120px]"
      />

      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center px-5 text-center sm:px-8">
        {/* floating card */}
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="rotate-[4deg]">
              <PayCardVisual width={300} className="max-w-full" />
            </div>
          </motion.div>
        </motion.div>

        <h2 className="font-display text-5xl font-extrabold leading-[1.0] tracking-tight text-white sm:text-6xl md:text-[76px]">
          Carry one card.
        </h2>
        <p className="mt-5 max-w-[600px] text-base text-[#888]">
          Pay anywhere, share everywhere. Join thousands of professionals
          who&apos;ve retired the wallet and the business card both — profile
          included, free.
        </p>

        <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <Button href="/products" size="md" className="group">
            Order Facile Pay
            <ArrowIcon />
          </Button>
          <Button href="#pricing" variant="ghost" size="md">
            See Pricing
          </Button>
        </div>

        <p className="mt-6 text-xs text-[#444]">
          No subscription. 30-day returns. Free shipping over $50.
        </p>
      </div>
    </section>
  );
}
