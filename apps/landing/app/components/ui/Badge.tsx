import type { ReactNode } from "react";
import { cn } from "@/app/lib/cn";

type Tone = "outline" | "solid" | "accent";

const tones: Record<Tone, string> = {
  // Inherits the surrounding surface's foreground via currentColor.
  outline: "border border-current/15",
  // Solid dark label (e.g. "Most popular", "Best seller").
  solid: "bg-[#0a0a0a] text-white",
  // Brand accent label.
  accent: "bg-accent text-accent-foreground shadow-sm",
};

/**
 * Small pill label (eyebrow / status / tag). `tone` picks the surface; `dot`
 * prepends the small status dot used by hero eyebrows. Works on both the dark
 * page and light panels.
 */
export function Badge({
  children,
  className,
  tone = "outline",
  dot = false,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        tones[tone],
        className
      )}
    >
      {dot && (
        <span className="size-1.5 rounded-full bg-current opacity-70" aria-hidden />
      )}
      {children}
    </span>
  );
}
