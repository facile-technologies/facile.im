"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Gentle continuous float for hero / product imagery. Transform-only, and
 * fully disabled under prefers-reduced-motion.
 */
export function Float({
  children,
  className,
  amount = 10,
  duration = 6,
}: {
  children: ReactNode;
  className?: string;
  /** Vertical travel in px. */
  amount?: number;
  /** Seconds per cycle. */
  duration?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amount, 0] }}
      transition={{ duration, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Pointer-reactive tilt for cards/visuals. Subtle by default; disabled under
 * reduced motion. Wrap a single child.
 */
export function Tilt({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  max?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 900 }}
      whileHover={{ scale: 1.015 }}
      onPointerMove={(e) => {
        const el = e.currentTarget as HTMLElement;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) scale(1.015)`;
      }}
      onPointerLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "";
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
