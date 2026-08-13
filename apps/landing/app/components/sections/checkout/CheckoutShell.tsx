import type { ReactNode } from "react";
import { Container } from "@/app/components/ui/Container";
import { Reveal } from "@/app/components/motion/Reveal";
import { StepIndicator } from "./StepIndicator";
import type { Step } from "./checkout-data";

/**
 * Shared frame for every checkout route: top padding (clears the fixed navbar),
 * the step rail, then the route's own content. Keeps vertical rhythm consistent
 * across cart / shipping / payment.
 */
export function CheckoutShell({
  current,
  children,
  size = "lg",
}: {
  current: Step;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <section className="relative min-h-[70vh] overflow-hidden py-28 sm:py-32">
      {/* Soft accent ambiance so the focused column never feels stranded on
          ultra-wide screens. Purely decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[420px] max-w-[900px] bg-[radial-gradient(ellipse_at_top,_rgba(79,124,255,0.12),_transparent_70%)]"
      />
      <Container size={size}>
        <Reveal y={16} className="mb-12">
          <StepIndicator current={current} />
        </Reveal>
        {children}
      </Container>
    </section>
  );
}
