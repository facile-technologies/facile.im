import { Container } from "@/app/components/ui/Container";
import { Media } from "@/app/components/ui/Media";
import { Button } from "@/app/components/ui/Button";
import { Reveal } from "@/app/components/motion/Reveal";
import { Float } from "@/app/components/motion/Float";

const stats = [
  { value: "1 tap", label: "to share everything" },
  { value: "No app", label: "works on every phone" },
  { value: "QR backup", label: "laser-engraved" },
];

/**
 * Apple-minimal products hero. A centered editorial column — quiet eyebrow,
 * large display headline with a gradient accent word, one line of subcopy, and
 * a CTA pair — sits above a single large floating hero render with a soft
 * accent bloom. A thin hairline-divided stat row closes the section.
 */
export function ProductsHero() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      {/* Ambient accent bloom */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10%] -z-0 size-[760px] -translate-x-1/2 rounded-full bg-accent/[0.08] blur-[180px]"
      />

      <Container size="lg" className="relative py-24 sm:py-28 lg:py-32">
        {/* Centered copy */}
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            The Facile collection
          </span>

          <h1 className="mt-7 text-balance font-display text-5xl font-semibold leading-[1.03] tracking-tight text-white sm:text-6xl md:text-[76px]">
            Carry one card.
            <br />
            Share <span className="text-gradient">everything</span>.
          </h1>

          <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Matte, metal, or worn on your wrist — every Facile product taps to
            your full profile in a second.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button href="#collection" variant="primary" size="lg">
              Browse the collection
            </Button>
            <Button href="/features" variant="secondary" size="lg">
              How it works
            </Button>
          </div>
        </Reveal>

        {/* Hero visual */}
        <Reveal delay={0.12} className="relative mt-16 sm:mt-20">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-[640px]">
            <div
              aria-hidden
              className="absolute inset-x-10 bottom-6 top-10 -z-0 rounded-[3rem] bg-accent/[0.1] blur-[120px]"
            />
            <Float amount={14} duration={7} className="relative size-full">
              <Media
                src="/images/phone-card.png"
                alt="Facile NFC card on the back of an iPhone"
                fill
                priority
                sizes="(min-width: 1024px) 640px, 90vw"
                className="object-contain drop-shadow-[0_50px_90px_rgba(0,0,0,0.6)]"
              />
            </Float>
          </div>
        </Reveal>

        {/* Quiet stat row with hairline dividers */}
        <Reveal delay={0.2}>
          <dl className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center divide-x divide-white/10 sm:mt-20">
            {stats.map((s) => (
              <div key={s.value} className="px-6 text-center sm:px-10">
                <dt className="font-display text-xl font-semibold tracking-tight text-white">
                  {s.value}
                </dt>
                <dd className="mt-1 text-[12px] leading-snug text-muted-foreground">
                  {s.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
