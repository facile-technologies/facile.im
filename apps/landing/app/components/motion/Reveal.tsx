"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Delay in seconds before the reveal starts. */
  delay?: number;
  /** Travel distance in px for the entrance. */
  y?: number;
  className?: string;
  /** Render as a different element if needed (defaults to div). */
  as?: "div" | "section" | "li" | "span";
};

/**
 * Scroll-triggered entrance: fades + lifts content into view once.
 * Respects prefers-reduced-motion (renders statically). Transform/opacity only.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
