import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";
import { Reveal } from "@/app/components/motion/Reveal";

const TRUST = [
  "Free shipping worldwide",
  "30-day money-back guarantee",
  "Ships in 2-3 business days",
];

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-background py-24 text-foreground sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[160px]"
      />
      <Container size="md" className="relative">
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="max-w-2xl text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-[44px] md:leading-[1.08]">
            Hand someone your <span className="text-gradient">whole</span> world
            in one tap
          </h2>
          <p className="mt-5 max-w-lg text-pretty text-lg text-foreground/65">
            Pick a finish, engrave your name, and start connecting this week.
            One card replaces every paper one you&apos;ll ever print.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Button href="/checkout?product=metal" variant="primary" size="lg" className="group">
              Shop the lineup
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Button>
            <Button href="#compare" variant="secondary" size="lg">
              View Pricing
            </Button>
          </div>

          <ul className="mt-12 flex flex-col items-center gap-3 text-sm text-foreground/55 sm:flex-row sm:gap-8">
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-foreground/40"
                />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
