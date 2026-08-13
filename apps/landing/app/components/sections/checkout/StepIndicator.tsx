import { cn } from "@/app/lib/cn";
import { steps, type Step } from "./checkout-data";

/**
 * Cart → Shipping → Payment progress rail. Completed steps show a check, the
 * active step is filled with the accent, upcoming steps are dimmed. Connectors
 * fill once a step is cleared. Server component (no state).
 */
export function StepIndicator({ current }: { current: Step }) {
  const activeIndex = steps.findIndex((s) => s.id === current);

  return (
    <nav
      aria-label="Checkout progress"
      className="flex items-center justify-center"
    >
      <ol className="flex items-center gap-2 sm:gap-3">
        {steps.map((step, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li key={step.id} className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300",
                    active
                      ? "bg-[var(--accent)] text-white shadow-[0_0_0_4px_rgba(79,124,255,0.18)]"
                      : done
                        ? "bg-foreground text-background"
                        : "border border-border-strong text-muted"
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 6.5L4.75 8.75L9.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    active
                      ? "text-foreground"
                      : done
                        ? "text-foreground/80"
                        : "text-muted"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="relative h-px w-8 overflow-hidden rounded-full bg-border sm:w-12"
                >
                  <span
                    className={cn(
                      "absolute inset-0 origin-left bg-foreground/60 transition-transform duration-500 ease-out",
                      done ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
