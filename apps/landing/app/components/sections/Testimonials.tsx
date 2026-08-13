import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";

/* ── data ─────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "10,000+", label: "Professionals worldwide", accent: false },
  { value: "0.8s", label: "Profile opens in", accent: true },
  { value: "0 apps", label: "Required to receive", accent: false },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "One tap. Their jaw dropped. I've never had a reaction like that from a business card.",
    name: "Sarah K.",
    role: "Brand Strategist",
  },
  {
    quote:
      "Setup took 4 minutes. I've changed my links 3 times since. Never touched the card.",
    name: "James L.",
    role: "Freelance Designer",
  },
  {
    quote: "Every investor I meet asks where I got it.",
    name: "Marco T.",
    role: "Creative Director",
  },
] as const;

const BRAND_GRADIENT =
  "linear-gradient(155deg, #c4b5fd 0%, #7dd3fc 50%, #6ee7b7 100%)";

/* ── stars ────────────────────────────────────────────────────────────── */

function Stars() {
  return (
    <div
      className="flex gap-0.5 text-[13px] leading-none text-[#fbbf24]"
      aria-label="5 out of 5 stars"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden>
          ★
        </span>
      ))}
    </div>
  );
}

/* ── section ──────────────────────────────────────────────────────────── */

export function Testimonials() {
  return (
    <section className="bg-background py-24 text-foreground sm:py-28">
      <Container size="full">
        <Reveal className="mb-14 max-w-2xl">
          <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Loved by the people who{" "}
            <span className="text-gradient">hand it over</span>.
          </h2>
          <p className="mt-4 text-lg text-foreground/60">
            Founders, creatives, and salespeople who replaced the paper card for
            good.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center lg:gap-20">
          {/* stats column */}
          <Reveal>
            <dl className="flex flex-col">
              {STATS.map((stat, i) => (
                <div
                  key={stat.value}
                  className={
                    i < STATS.length - 1
                      ? "border-b border-white/[0.06] pb-7"
                      : ""
                  }
                  style={i > 0 ? { marginTop: "1.75rem" } : undefined}
                >
                  <dt
                    className="font-display text-5xl font-extrabold leading-none tracking-tight sm:text-[56px]"
                    style={
                      stat.accent
                        ? {
                            backgroundImage: BRAND_GRADIENT,
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            color: "transparent",
                          }
                        : undefined
                    }
                  >
                    {stat.value}
                  </dt>
                  <dd className="mt-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#444]">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* testimonials column */}
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <StaggerItem key={t.name} className="h-full">
                <Card
                  tone="card"
                  className="flex h-full flex-col gap-3 p-6 transition duration-300 hover:-translate-y-0.5"
                >
                  <Stars />
                  <p className="text-[15px] italic leading-6 text-[#ccc]">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-auto pt-1">
                    <p className="text-sm font-semibold tracking-tight text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-[#666]">{t.role}</p>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
