import type { ReactNode } from "react";
import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";
import { Media } from "@/app/components/ui/Media";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";

function TapIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.55a11 11 0 0 1 14 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const steps: { icon: ReactNode; step: string; title: string; body: string }[] = [
  {
    icon: <TapIcon />,
    step: "01",
    title: "Tap to pay",
    body: "Hold the card to any contactless terminal. No unlocking, no app, no PIN — the encrypted NFC chip does the rest.",
  },
  {
    icon: <ShieldCheckIcon />,
    step: "02",
    title: "Tap to share",
    body: "Hold the same card to a phone and your full Facile profile lands instantly — links, socials, contact, portfolio.",
  },
  {
    icon: <CheckCircleIcon />,
    step: "03",
    title: "See it all",
    body: "Every payment and every profile tap streams to your dashboard in real time. One card, one source of truth.",
  },
];

export function PayHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-panel py-24 text-panel-foreground sm:py-28"
    >
      <Container size="lg">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#999]">
                How it works
              </p>
              <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-panel-foreground sm:text-5xl md:text-[60px] md:leading-[1.02]">
                One card. One tap.
              </h2>
              <p className="mt-3 text-base text-[#777]">
                The simplest way to pay and to be remembered.
              </p>
            </div>
            <Button href="/products" variant="secondary" size="md">
              Order Now
              <ArrowIcon />
            </Button>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* showcase panel */}
          <Reveal>
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-[28px] border border-[#e8e8e4] bg-[#0a0a0a]">
              <Media
                src="/images/phone-card.png"
                alt="Facile Pay card held against the back of a phone, ready to tap"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent px-8 pb-8 pt-24 sm:px-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6ee7b7]">
                  The same card
                </p>
                <h3 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                  Lives in your pocket, works against any phone.
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#bbb]">
                  No second device, no battery, no setup. The brushed-metal chip
                  reads on the back of a phone the same way it reads at a
                  checkout.
                </p>
              </div>
            </div>
          </Reveal>

          {/* steps as a numbered list */}
          <Stagger className="flex flex-col gap-5">
            {steps.map((s) => (
              <StaggerItem key={s.step}>
                <div className="flex items-start gap-5 rounded-[20px] border border-[#e8e8e4] bg-[#fafaf8] p-7 transition-colors hover:border-[#dcdcd6]">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-[14px] bg-[#f0efe9]">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-2xl font-extrabold tracking-tight text-[#cfcdc4]">
                        {s.step}
                      </span>
                      <h3 className="text-[21px] font-bold tracking-tight text-panel-foreground">
                        {s.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#777]">
                      {s.body}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
