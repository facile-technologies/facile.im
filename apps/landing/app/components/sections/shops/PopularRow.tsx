import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/app/lib/cn";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";
import { CardVisual } from "./CardVisual";

type Tone = "dark" | "steel" | "white";

const POPULAR: {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  price: string;
  tone: Tone;
  image?: { src: string; alt: string };
  darkTile?: boolean;
}[] = [
  {
    id: "standard",
    name: "Facile Standard",
    tag: "NFC Card",
    blurb: "The one everyone starts with.",
    price: "$29",
    tone: "dark",
  },
  {
    id: "metal",
    name: "Facile Metal",
    tag: "Metal Card",
    blurb: "Brushed steel that makes a moment.",
    price: "$49",
    tone: "steel",
  },
  {
    id: "premium-band",
    name: "Premium Band",
    tag: "Smart Band",
    blurb: "Your profile, worn on the wrist.",
    price: "$79",
    tone: "dark",
    image: { src: "/products/band.png", alt: "Facile NFC smart band, matte black" },
    darkTile: true,
  },
];

/** Dark "Popular right now" rail for /shops. Anchored from the hero CTA. */
export function PopularRow() {
  return (
    <section
      id="popular"
      className="scroll-mt-24 bg-background py-20 text-foreground sm:py-28"
    >
      <Container size="xl">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Trending
              </span>
              <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                What everyone&apos;s tapping.
              </h2>
            </div>
            <a
              href="#catalog"
              className="text-[14px] font-medium text-muted-foreground transition hover:text-foreground"
            >
              View all products &rarr;
            </a>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {POPULAR.map((p) => (
            <StaggerItem key={p.id} className="h-full">
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card transition duration-300 hover:-translate-y-1.5 hover:border-border-strong">
                <div
                  className={cn(
                    "relative flex aspect-[16/10] items-center justify-center p-8",
                    p.darkTile
                      ? "bg-[#0b0b0c]"
                      : "bg-gradient-to-b from-[#161617] to-[#0a0a0b]"
                  )}
                >
                  <CardVisual
                    tone={p.tone}
                    src={p.image?.src}
                    alt={p.image?.alt}
                    className="max-w-[62%]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {p.tag}
                  </span>
                  <h3 className="mt-1.5 text-[19px] font-bold tracking-tight text-card-foreground">
                    {p.name}
                  </h3>
                  <p className="mt-1 flex-1 text-[14px] leading-relaxed text-muted-foreground">
                    {p.blurb}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-[16px] font-bold text-card-foreground">
                      {p.price}
                    </span>
                    <Button
                      href={`/checkout?product=${p.id}`}
                      variant="primary"
                      size="sm"
                    >
                      Shop now
                    </Button>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
