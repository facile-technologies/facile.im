"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Reveal } from "@/app/components/motion/Reveal";
import { useCart } from "@/app/components/cart/CartContext";
import { CardThumb } from "./CardThumb";
import { OrderSummary } from "./OrderSummary";
import { formatPrice } from "./checkout-data";

/**
 * Cart / order review (Figma 131:2244). Seeds the cart from a `?product=<id>`
 * link, then reflects live qty + promo through the shared cart context.
 */
export function CartReview() {
  const reduce = useReducedMotion();
  const { product, qty, setQty, setProduct, promo, applyPromo, totals } =
    useCart();
  const [promoInput, setPromoInput] = useState("");
  const [promoState, setPromoState] = useState<"idle" | "ok" | "bad">("idle");

  // Seed the cart from the `?product=&qty=` link (client-only, runs once).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("product");
    if (id) {
      const q = Number(params.get("qty"));
      setProduct(id, Number.isFinite(q) && q > 0 ? q : 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApplyPromo = () => {
    if (!promoInput.trim()) return;
    const { ok } = applyPromo(promoInput);
    setPromoState(ok ? "ok" : "bad");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Reveal className="flex min-w-0 flex-col gap-6">
        <header className="flex flex-col gap-1.5">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Review your order
          </h1>
          <p className="text-sm text-muted-foreground">
            One tap, endless connections. Confirm what&apos;s in your bag before
            we ship.
          </p>
        </header>

        <Card tone="card">
          <div className="flex items-center gap-4 p-5">
            <CardThumb
              src={product.image}
              alt={product.alt}
              className="h-16 w-16"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium sm:text-base">
                {product.name}
              </p>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                {product.variant}
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-border bg-foreground/5 p-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={qty <= 1}
                onClick={() => setQty(qty - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              >
                −
              </button>
              <span className="w-6 text-center text-sm tabular-nums">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty(qty + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
              >
                +
              </button>
            </div>

            <span className="w-20 text-right text-sm font-medium tabular-nums sm:text-base">
              {formatPrice(product.price * qty)}
            </span>
          </div>
        </Card>

        <Card tone="card">
          <div className="flex flex-col gap-3 p-5">
            <label
              htmlFor="promo"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
            >
              Promo Code
            </label>
            <div className="flex gap-3">
              <input
                id="promo"
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  setPromoState("idle");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onApplyPromo();
                  }
                }}
                placeholder="e.g. FACILE10"
                className="h-11 flex-1 rounded-xl border border-border bg-foreground/5 px-4 text-sm uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal placeholder:text-muted/70 transition-colors focus:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/25"
              />
              <Button
                variant="secondary"
                type="button"
                className="px-6"
                disabled={!promoInput.trim()}
                onClick={onApplyPromo}
              >
                Apply
              </Button>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              {promoState === "ok" || promo ? (
                <motion.p
                  key="ok"
                  initial={reduce ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-emerald-500"
                >
                  <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.5L4.75 8.75L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Code <span className="font-semibold">{promo}</span> applied —{" "}
                  {Math.round((totals.discount / totals.subtotal) * 100) || ""}% off,
                  added below.
                </motion.p>
              ) : promoState === "bad" ? (
                <motion.p
                  key="bad"
                  initial={reduce ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-500"
                >
                  That code isn&apos;t valid. Try FACILE10 or WELCOME15.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </Card>

        <Button href="/checkout/shipping" variant="primary" size="lg" className="w-full">
          Continue to shipping
        </Button>

        <p className="text-center text-xs text-muted">
          Free returns within 30 days. No questions asked.
        </p>
      </Reveal>

      <Reveal delay={0.08} className="min-w-0">
        <OrderSummary />
      </Reveal>
    </div>
  );
}
