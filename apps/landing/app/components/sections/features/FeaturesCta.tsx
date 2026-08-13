import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";
import { Media } from "@/app/components/ui/Media";
import { Reveal } from "@/app/components/motion/Reveal";
import { Float, Tilt } from "@/app/components/motion/Float";

const BRAND_GRADIENT =
  "linear-gradient(150deg, #c4b5fd 0%, #7dd3fc 50%, #6ee7b7 100%)";

export function FeaturesCta() {
  return (
    <section className="relative overflow-hidden bg-[#060606] py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/4 -z-0 size-[620px] -translate-x-1/2 rounded-full opacity-[0.12] blur-[160px]"
        style={{ backgroundImage: BRAND_GRADIENT }}
      />
      <Container
        size="md"
        className="relative flex flex-col items-center text-center"
      >
        <Reveal>
          <div className="mb-12 flex justify-center">
            <Float amount={12} duration={7}>
              <Tilt
                max={10}
                className="relative aspect-square w-[300px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#161616] to-[#070707] ring-1 ring-white/[0.08]"
              >
                <Media
                  src="/images/card.png"
                  alt="Facile matte black NFC smart card"
                  fill
                  sizes="300px"
                  className="object-contain p-6"
                />
              </Tilt>
            </Float>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-balance text-5xl font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl md:text-[68px]">
            Make your first
            <br />
            impression count.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#9a9a9a]">
            Order your card today. The free profile comes with it, and it ships
            in 3 to 5 days.
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
            <Button href="/signup" variant="secondary" size="lg">
              Create Free Profile
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-7 text-xs text-[#666]">
            No subscription. 30-day returns. Free shipping over $50.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
