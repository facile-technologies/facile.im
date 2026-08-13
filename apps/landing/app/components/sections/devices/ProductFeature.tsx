import { Media } from "@/app/components/ui/Media";
import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";
import { Reveal } from "@/app/components/motion/Reveal";
import { cn } from "@/app/lib/cn";

type ProductFeatureProps = {
  /** Drives the section surface + text + button styling. */
  theme: "light" | "dark";
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Shown in the button label, e.g. "$49". */
  price: string;
  href: string;
  image: { src: string; alt: string };
};

/**
 * Full-width product feature section (per Figma Metal Cards / Business Cards):
 * a centered eyebrow, title, subtitle and order button, with a large product
 * image below. `theme` flips it between the warm light panel and the dark page.
 */
export function ProductFeature({
  theme,
  eyebrow,
  title,
  subtitle,
  price,
  href,
  image,
}: ProductFeatureProps) {
  const light = theme === "light";

  return (
    <section
      className={cn(
        "py-20 sm:py-28",
        light
          ? "bg-panel text-panel-foreground"
          : "bg-background text-foreground",
      )}
    >
      <Container size="lg">
        <Reveal className="flex flex-col items-center text-center">
          <p
            className={cn(
              "text-base sm:text-lg",
              light ? "text-panel-muted" : "text-foreground/60",
            )}
          >
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p
            className={cn(
              "mt-3 text-lg sm:text-xl",
              light ? "text-panel-muted" : "text-foreground/70",
            )}
          >
            {subtitle}
          </p>
          <Button
            href={href}
            variant={light ? "primary" : "secondary"}
            size="lg"
            className="mt-7"
          >
            Order Now — {price}
          </Button>
        </Reveal>

        <Reveal delay={0.1} className="mt-12 sm:mt-16">
          <Media
            src={image.src}
            alt={image.alt}
            width={1080}
            height={720}
            sizes="(min-width: 1024px) 980px, 90vw"
            className="mx-auto h-auto w-full max-w-[980px]"
          />
        </Reveal>
      </Container>
    </section>
  );
}
