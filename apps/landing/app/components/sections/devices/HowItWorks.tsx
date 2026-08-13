import { Media } from "@/app/components/ui/Media";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";

type Step = {
  title: string;
  description: string;
  image: { src: string; alt: string };
};

const STEPS: Step[] = [
  {
    title: "Order & engrave",
    description:
      "Pick your finish, drop in your name, and we laser-engrave it. Your card ships ready to tap.",
    image: { src: "/devices/how-order.png", alt: "Facile NFC card resting on a phone" },
  },
  {
    title: "Build your profile",
    description:
      "Add links, contact details, socials, and your portfolio from one dashboard — change it anytime.",
    image: {
      src: "/devices/how-customize.png",
      alt: "Facile card standing upright on a surface",
    },
  },
  {
    title: "Tap & connect",
    description:
      "Hold the card to any phone. Your full profile opens in their browser — no app, no friction.",
    image: { src: "/devices/how-tap.png", alt: "Facile NFC smart band being tapped" },
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-background py-24 text-foreground sm:py-32"
    >
      <Container size="lg">
        <Reveal className="flex justify-center">
          <SectionHeading
            align="center"
            className="font-display"
            title={
              <>
                Set up once. <span className="text-gradient">Tap</span> forever.
              </>
            }
            description="Three steps from unboxing to your first connection."
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-8 sm:mt-16 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <StaggerItem key={step.title} className="flex flex-col">
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-[#0c0c0e]">
                <Media
                  src={step.image.src}
                  alt={step.image.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
                <span className="absolute left-5 top-5 flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/40 font-display text-sm font-semibold text-white backdrop-blur">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-foreground/60">
                {step.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
