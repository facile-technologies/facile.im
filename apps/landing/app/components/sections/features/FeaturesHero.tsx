import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";
import { Media } from "@/app/components/ui/Media";
import { Reveal } from "@/app/components/motion/Reveal";
import { Float, Tilt } from "@/app/components/motion/Float";

const BRAND_GRADIENT =
  "linear-gradient(150deg, #c4b5fd 0%, #7dd3fc 50%, #6ee7b7 100%)";

const stats: [string, string][] = [
  ["< 2s", "to update everywhere"],
  ["0", "apps to download"],
  ["1 tap", "to share it all"],
];

export function FeaturesHero() {
  return (
    <section className="relative overflow-hidden bg-background pb-20 pt-28 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-0 size-[760px] -translate-x-1/2 rounded-full opacity-[0.16] blur-[160px]"
        style={{ backgroundImage: BRAND_GRADIENT }}
      />
      <Container
        size="full"
        className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8"
      >
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Reveal>
            <span
              className="inline-flex items-center rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white"
              style={{ backgroundColor: "#161616" }}
            >
              All Features
            </span>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="font-display mt-6 text-balance text-5xl font-extrabold leading-[1.02] tracking-tight text-foreground sm:text-6xl md:text-[78px] md:leading-[0.98]">
              One tap.
              <br />
              <span className="text-gradient">Everything</span> you are.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              A card you tap and a profile you control. Links, socials, contact
              and live analytics — all in one place, always current, no app to
              install.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
              <Button href="/products" variant="primary" size="lg">
                Shop Cards
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Button>
              <Button href="/pricing" variant="secondary" size="lg">
                View Pricing
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-12 grid w-full max-w-md grid-cols-3 gap-6 border-t border-border pt-8">
              {stats.map(([v, k]) => (
                <div key={k}>
                  <dt className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
                    {v}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted">{k}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Float amount={12} duration={7}>
            <Tilt
              max={8}
              className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[32px] bg-[#e9e8e4] ring-1 ring-black/5"
            >
              <Media
                src="/images/phone-card.png"
                alt="A matte black Facile NFC smart card adhered to the back of an iPhone, ready to tap"
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute bottom-5 left-5 rounded-2xl bg-black/70 px-4 py-3 backdrop-blur-md">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                  Tap to share
                </p>
                <p className="font-mono text-sm text-white">facile.me/you</p>
              </div>
            </Tilt>
          </Float>
        </Reveal>
      </Container>
    </section>
  );
}
