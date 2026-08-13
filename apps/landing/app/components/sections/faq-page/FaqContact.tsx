import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Reveal } from "@/app/components/motion/Reveal";

type ContactCard = {
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
};

const CARDS: ContactCard[] = [
  {
    title: "Live chat",
    description: "Real humans, Mon–Fri, 9am–6pm EST.",
    cta: "Start chat",
    href: "#chat",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-6">
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-4-1L3 20l1-5.5a8.5 8.5 0 0 1 17 -3Z" />
      </svg>
    ),
  },
  {
    title: "Email us",
    description: "support@facile.me — we reply within a few hours.",
    cta: "Send email",
    href: "mailto:support@facile.me",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="size-6">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
];

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform group-hover:translate-x-0.5">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Dark "Still stuck?" support section — glass cards + a strong gradient CTA. */
export function FaqContact() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[170px]"
      />

      <Container size="lg" className="relative flex flex-col items-center">
        <Reveal className="flex flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">
            Still stuck?
          </span>
          <h2 className="font-display mt-4 text-balance text-4xl font-medium leading-[1.02] tracking-tight sm:text-5xl">
            We&apos;re here to <span className="text-gradient">help</span>.
          </h2>
          <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-foreground/65">
            Can&apos;t find what you&apos;re looking for? Reach out and a real
            person will get back to you fast.
          </p>
        </Reveal>

        <div className="mt-14 grid w-full max-w-3xl gap-5 sm:grid-cols-2">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08}>
              <Card
                tone="glass"
                className="flex h-full flex-col p-8 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-foreground/[0.06] text-foreground">
                  {card.icon}
                </span>
                <h3 className="mt-7 text-xl font-semibold tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  {card.description}
                </p>
                <Button
                  href={card.href}
                  variant="primary"
                  size="md"
                  className="group mt-7 w-fit"
                >
                  {card.cta}
                  <ArrowIcon />
                </Button>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
