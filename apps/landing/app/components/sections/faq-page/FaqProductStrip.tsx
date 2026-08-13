import { Container } from "@/app/components/ui/Container";
import { Media } from "@/app/components/ui/Media";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";

/**
 * Dark product strip between the hero and the accordion. A tasteful row of real
 * product photos in glass tiles, giving the static FAQ a premium product anchor.
 * Each tile links into the relevant product so help readers can jump to buy.
 */
const PRODUCTS = [
  {
    label: "NFC Card",
    blurb: "The everyday tap.",
    image: "/images/card.png",
    href: "/products",
  },
  {
    label: "Metal Card",
    blurb: "Laser-engraved.",
    image: "/images/business-plate.png",
    href: "/products",
  },
  {
    label: "Smart Band",
    blurb: "Wear your link.",
    image: "/images/band.png",
    href: "/products",
  },
  {
    label: "Tap in Action",
    blurb: "One tap, no app.",
    image: "/images/phone-card.png",
    href: "/products",
  },
] as const;

export function FaqProductStrip() {
  return (
    <section className="border-t border-border bg-background text-foreground py-16 sm:py-20">
      <Container size="full">
        <Reveal className="flex flex-col gap-2 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/45">
            The lineup
          </span>
          <h2 className="font-display text-balance text-2xl font-medium tracking-tight sm:text-3xl">
            One platform, every way to tap.
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <StaggerItem key={product.label}>
              <a
                href={product.href}
                className="group glass relative flex h-full flex-col overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-foreground/[0.03]">
                  <Media
                    src={product.image}
                    alt={`Facile ${product.label}`}
                    fill
                    sizes="(min-width: 1024px) 22vw, 45vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight">
                      {product.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-foreground/55">
                      {product.blurb}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/70 transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </span>
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
