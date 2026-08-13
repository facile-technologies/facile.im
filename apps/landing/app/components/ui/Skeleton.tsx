import { cn } from "@/app/lib/cn";

/**
 * Shimmer placeholder. Compose with width/height/rounded utilities.
 * The shimmer + reduced-motion guard live in globals.css (`.skeleton`).
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden />;
}
