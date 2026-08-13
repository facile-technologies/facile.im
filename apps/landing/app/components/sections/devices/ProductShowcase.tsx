import { Media } from "@/app/components/ui/Media";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Button } from "@/app/components/ui/Button";
import { Reveal } from "@/app/components/motion/Reveal";
import { cn } from "@/app/lib/cn";

type Showcase = {
  id: string;
  name: string;
  description: string;
  price: string;
  features: string[];
  image: { src: string; alt: string };
};

const SHOWCASES: Showcase[] = [
  {
    id: "band",
    name: "Premium Band",
    description:
      "Soft-touch silicone that lives on your wrist, not in a wallet. Made for conferences, festivals, and the handshake-heavy days.",
    price: "$39",
    features: [
      "Sweat- and water-resistant",
      "Embedded NFC + QR fallback",
      "Tap from either side",
      "Adjustable, all-day comfort",
      "Lifetime profile updates",
    ],
    image: {
      src: "/devices/premium-bands.png",
      alt: "Matte black Facile NFC smart band worn on a wrist",
    },
  },
  {
    id: "phone",
    name: "Phone Card",
    description:
      "A featherweight card that sticks to the back of your phone — so the thing you're already holding becomes the thing you share.",
    price: "$29",
    features: [
      "Re-stickable, residue-free",
      "Profiles in under 2 minutes",
      "Slim enough for any case",
      "Matte, fingerprint-proof finish",
      "Unlimited link edits",
    ],
    image: {
      src: "/devices/phone-cards.png",
      alt: "White Facile NFC phone card stuck to the back of a smartphone",
    },
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function ProductShowcase() {
  return (
    <section className="bg-panel text-panel-foreground py-24 sm:py-32">
      <Container size="lg">
        <Reveal className="flex justify-center">
          <SectionHeading
            align="center"
            className="font-display"
            title="Everyday carry, upgraded"
            description="Different shapes for different days — every one taps to the same profile you control."
          />
        </Reveal>

        <div className="mt-16 flex flex-col gap-20 sm:mt-20 sm:gap-28">
          {SHOWCASES.map((item, i) => {
            const imageFirst = i % 2 === 0;
            return (
              <Reveal key={item.id}>
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  {/* Image */}
                  <div
                    className={cn(
                      "group relative aspect-[4/3] overflow-hidden rounded-3xl border border-panel-border bg-white",
                      imageFirst ? "lg:order-1" : "lg:order-2"
                    )}
                  >
                    <Media
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* Copy */}
                  <div
                    className={cn(
                      "flex flex-col items-start",
                      imageFirst ? "lg:order-2" : "lg:order-1"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl md:text-[36px]">
                        {item.name}
                      </h3>
                      <span className="rounded-full bg-panel-foreground/[0.06] px-3 py-1 text-sm font-medium text-panel-foreground/70">
                        from {item.price}
                      </span>
                    </div>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-panel-muted">
                      {item.description}
                    </p>

                    <ul className="mt-7 flex flex-col gap-3">
                      {item.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-panel-foreground text-white">
                            <CheckIcon />
                          </span>
                          <span className="text-[17px] text-panel-foreground/80">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      href={`/checkout?product=${item.id}`}
                      variant="primary"
                      className="mt-8"
                    >
                      Order Now &mdash; {item.price}
                    </Button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
