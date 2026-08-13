import type { ReactNode } from "react";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";
import { Media } from "@/app/components/ui/Media";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";
import { Float, Tilt } from "@/app/components/motion/Float";

function Icon({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-10 items-center justify-center rounded-xl border border-black/[0.06] bg-black/[0.04]">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#555"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {children}
      </svg>
    </span>
  );
}

const PRIMARY: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: (
      <>
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </>
    ),
    title: "NFC tap",
    body: "Hold the card to any phone. The profile opens instantly — no app, no pairing.",
  },
  {
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    title: "QR fallback",
    body: "A laser-engraved QR is built into every card for the rare phone that can't tap.",
  },
];

const SECONDARY: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: (
      <>
        <path d="M9 15l6-6" />
        <path d="M11 7l1-1a4 4 0 0 1 6 6l-1 1" />
        <path d="M13 17l-1 1a4 4 0 0 1-6-6l1-1" />
      </>
    ),
    title: "Share the link",
    body: "Drop facile.me/yourname in a text, email, or any chat.",
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    title: "Link in bio",
    body: "Pin it in your Instagram, X, or LinkedIn bio.",
  },
  {
    icon: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
    title: "Add to Wallet",
    body: "Keep a tappable copy in Apple or Google Wallet.",
  },
  {
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    title: "Embed it",
    body: "Drop your profile card onto any site or portfolio.",
  },
];

export function ShareYourWay() {
  return (
    <section className="bg-[#f2f1ee] py-24 text-[#0a0a0a]">
      <Container size="full">
        <Reveal className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#999]">
            Share Your Way
          </p>
          <h2 className="font-display mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-[56px]">
            However they meet you,
            <br />
            <span className="text-gradient">one tap does it.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Float amount={12} duration={7}>
              <Tilt
                max={7}
                className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[32px] bg-[#e9e8e4] ring-1 ring-black/5"
              >
                <Media
                  src="/images/phone-card.png"
                  alt="A Facile card on the back of a phone being tapped to share a profile"
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover"
                />
              </Tilt>
            </Float>
          </Reveal>

          <div>
            <Stagger className="grid gap-5 sm:grid-cols-2">
              {PRIMARY.map((it) => (
                <StaggerItem key={it.title}>
                  <Card
                    tone="panel"
                    className="flex h-full flex-col rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18)]"
                  >
                    <Icon>{it.icon}</Icon>
                    <h3 className="mt-5 text-[15px] font-bold text-[#0a0a0a]">
                      {it.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#777]">
                      {it.body}
                    </p>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>

            <Stagger className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {SECONDARY.map((it) => (
                <StaggerItem key={it.title}>
                  <Card
                    tone="panel"
                    className="flex h-full flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                  >
                    <Icon>{it.icon}</Icon>
                    <h3 className="mt-4 text-[13px] font-bold text-[#0a0a0a]">
                      {it.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[#777]">
                      {it.body}
                    </p>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Container>
    </section>
  );
}
