import type { ReactNode } from "react";
import { cn } from "@/app/lib/cn";

/**
 * Surface card. Every card is glass — `tone="card"` is the frosted treatment for
 * dark surfaces, `tone="panel"` the translucent one for light sections. `glass`
 * / `glass-panel` are explicit aliases; `plain` opts out. Pass `hover` for the
 * standardised lift. Colours come from semantic tokens so both themes stay
 * consistent.
 */
export function Card({
  children,
  className,
  tone = "card",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  tone?: "card" | "panel" | "plain" | "glass" | "glass-panel";
  hover?: boolean;
}) {
  const tones = {
    card: "glass text-card-foreground",
    panel: "glass-panel text-panel-foreground",
    plain: "border border-current/10",
    glass: "glass text-card-foreground",
    "glass-panel": "glass-panel text-panel-foreground",
  } as const;

  return (
    <div className={cn("rounded-2xl", tones[tone], hover && "glass-hover", className)}>
      {children}
    </div>
  );
}
