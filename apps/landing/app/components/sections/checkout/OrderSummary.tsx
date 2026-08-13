"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Card } from "@/app/components/ui/Card";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { cn } from "@/app/lib/cn";
import { CardThumb } from "./CardThumb";
import { useCart } from "@/app/components/cart/CartContext";
import { formatPrice } from "./checkout-data";

type Trust = { icon: "lock" | "ship" | "return" | "shield"; label: string };

const TrustIcon = ({ icon }: { icon: Trust["icon"] }) => {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 16 16",
    fill: "none",
    "aria-hidden": true as const,
    stroke: "currentColor",
    strokeWidth: 1.3,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (icon) {
    case "lock":
      return (
        <svg {...common}>
          <rect x="3.5" y="7" width="9" height="6" rx="1.2" />
          <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
        </svg>
      );
    case "ship":
      return (
        <svg {...common}>
          <path d="M1.5 5h8v6h-8z" />
          <path d="M9.5 7h3l2 2v2h-5z" />
          <circle cx="4.5" cy="12.5" r="1.2" />
          <circle cx="11.5" cy="12.5" r="1.2" />
        </svg>
      );
    case "return":
      return (
        <svg {...common}>
          <path d="M3 6a5 5 0 1 1-1 3" />
          <path d="M3 3v3h3" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M8 1.5 13 3.5v4c0 3-2.2 5.2-5 6.5-2.8-1.3-5-3.5-5-6.5v-4z" />
          <path d="M6 7.8 7.4 9.2 10 6" />
        </svg>
      );
  }
};

/**
 * Item list + price breakdown + trust badges, driven by the cart context so the
 * totals stay in sync with qty / promo / shipping selections across steps. Uses
 * the glass panel surface and stays sticky alongside tall forms. While the cart
 * hydrates from storage, the summary shows a graceful shimmer rather than a flash
 * of default values.
 */
export function OrderSummary({
  trust = [
    { icon: "lock", label: "SSL Secure" },
    { icon: "ship", label: "Free Shipping" },
    { icon: "return", label: "30-Day Returns" },
  ],
  className,
}: {
  trust?: Trust[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const { hydrated, product, qty, promo, totals } = useCart();

  return (
    <Card
      tone="glass"
      className={cn("lg:sticky lg:top-28", className)}
    >
      <div className="flex flex-col gap-5 p-6">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        {!hydrated ? (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-32 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
              </div>
            </div>
            <div className="h-px bg-border" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-2/3 rounded-full" />
            <div className="h-px bg-border" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center gap-3">
                <CardThumb
                  src={product.image}
                  alt={product.alt}
                  className="h-12 w-12"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {product.variant}
                    {qty > 1 ? ` · Qty ${qty}` : ""}
                  </p>
                </div>
                <span className="text-sm font-medium tabular-nums">
                  {formatPrice(product.price * qty)}
                </span>
              </li>
            </ul>

            <div className="h-px bg-border" />

            <dl className="flex flex-col gap-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
              </div>
              <AnimatePresence initial={false}>
                {totals.discount > 0 ? (
                  <motion.div
                    key="discount"
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="flex items-center justify-between overflow-hidden text-emerald-500"
                  >
                    <dt>Discount{promo ? ` (${promo})` : ""}</dt>
                    <dd className="tabular-nums">−{formatPrice(totals.discount)}</dd>
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="tabular-nums">{formatPrice(totals.shipping)}</dd>
              </div>
            </dl>

            <div className="h-px bg-border" />

            <div className="flex items-baseline justify-between">
              <span className="text-base font-semibold">Total</span>
              <span className="font-display text-2xl font-semibold tabular-nums">
                {formatPrice(totals.total)}
              </span>
            </div>
          </>
        )}

        <ul className="flex flex-col gap-1.5 border-t border-border pt-4 text-xs text-muted">
          {trust.map((t) => (
            <li key={t.label} className="flex items-center gap-2">
              <TrustIcon icon={t.icon} />
              {t.label}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
