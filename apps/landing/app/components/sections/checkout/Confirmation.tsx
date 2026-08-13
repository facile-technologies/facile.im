"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/app/components/ui/Button";
import { Card } from "@/app/components/ui/Card";
import { useCart } from "@/app/components/cart/CartContext";
import { CardThumb } from "./CardThumb";
import { ORDER_NUMBER, formatPrice } from "./checkout-data";

type Snapshot = {
  name: string;
  productName: string;
  variant: string;
  image: string;
  alt: string;
  qty: number;
  total: number;
  email: string;
};

/**
 * Order confirmed panel (Figma 131:2713). Snapshots the ordered cart once it has
 * hydrated, then clears the cart so a refresh / new visit starts clean. The
 * success moment is the emotional peak of the flow — a settling checkmark with a
 * soft accent glow and a tidy receipt.
 */
export function Confirmation() {
  const reduce = useReducedMotion();
  const { hydrated, product, qty, totals, shipping, reset } = useCart();
  const [snap, setSnap] = useState<Snapshot | null>(null);

  useEffect(() => {
    if (hydrated && !snap) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSnap({
        name: shipping.firstName || "there",
        productName: product.name,
        variant: product.variant,
        image: product.image,
        alt: product.alt,
        qty,
        total: totals.total,
        email: shipping.email,
      });
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  const order = snap ?? {
    name: "there",
    productName: product.name,
    variant: product.variant,
    image: product.image,
    alt: product.alt,
    qty,
    total: totals.total,
    email: shipping.email,
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center text-center">
      {/* Checkmark with expanding accent ring */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        {!reduce ? (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[var(--accent)]/20"
            initial={{ scale: 0.6, opacity: 0.7 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
          />
        ) : null}
        <motion.div
          initial={reduce ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_8px_32px_-8px_rgba(79,124,255,0.7)]"
        >
          <motion.svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true">
            <motion.path
              d="M8 17.5L14 23.5L26 11"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            />
          </motion.svg>
        </motion.div>
      </div>

      <motion.h1
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-7 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
      >
        You&apos;re all set,{" "}
        <span className="text-gradient">{order.name}</span>
      </motion.h1>
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-3 max-w-sm text-pretty text-muted-foreground"
      >
        Your order is confirmed and on its way.
        {order.email ? (
          <>
            {" "}
            A receipt and setup instructions are headed to{" "}
            <span className="text-foreground">{order.email}</span>.
          </>
        ) : (
          " Check your email for setup instructions."
        )}
      </motion.p>

      {/* Receipt */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.4 }}
        className="mt-8 w-full"
      >
        <Card tone="glass" className="text-left">
          <div className="flex items-center gap-4 p-5">
            <CardThumb src={order.image} alt={order.alt} className="h-14 w-14" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {order.productName}
                {order.qty > 1 ? ` ×${order.qty}` : ""}
              </p>
              <p className="truncate text-xs text-muted-foreground">{order.variant}</p>
            </div>
            <span className="text-sm font-semibold tabular-nums">
              {formatPrice(order.total)}
            </span>
          </div>
          <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted">
            <span>Order {ORDER_NUMBER}</span>
            <span>Est. arrival 5–7 days</span>
          </div>
        </Card>
      </motion.div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button href="/pay" variant="primary" size="lg">
          Set up my profile →
        </Button>
        <Button href="/products" variant="secondary" size="lg">
          Continue shopping
        </Button>
      </div>

      <div className="mt-10 h-px w-full max-w-xs bg-border" />

      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="10" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="14.2" cy="5.8" r="1" fill="currentColor" />
        </svg>
        Show off your new card on Instagram
      </a>
    </div>
  );
}
