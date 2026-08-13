import Image from "next/image";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";

type Step = {
  image: string;
  alt: string;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    image: "/how-it-works/order-your-card.png",
    alt: "Facile NFC smart card on a phone case",
    title: "Order your card",
    description:
      "Pick matte PVC or brushed metal. Your card ships in 2–3 days with a free profile already linked.",
  },
  {
    image: "/how-it-works/customize-profile.png",
    alt: "Facile NFC card stand on a desk",
    title: "Make it yours",
    description:
      "Add contact details, social handles, your portfolio, payment links — anything. Edit it anytime from your dashboard.",
  },
  {
    image: "/how-it-works/tap-share.png",
    alt: "Facile NFC wristband",
    title: "Tap & share",
    description:
      "Hold the card to any phone. Your profile opens in the browser in under a second. No app, no friction.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-24 sm:py-32">
      <Container size="full">
        <Reveal>
          <SectionHeading
            title={
              <>
                Up and running in{" "}
                <span className="text-gradient">three steps</span>
              </>
            }
            description="From unboxing to your first tap — it takes about five minutes."
            align="center"
            className="text-foreground [&_p]:opacity-70 [&_p]:text-foreground"
          />
        </Reveal>

        <Stagger className="mx-auto mt-16 grid max-w-[1280px] grid-cols-1 gap-x-12 gap-y-14 sm:mt-20 md:grid-cols-3">
          {steps.map((step, i) => (
            <StaggerItem key={step.title}>
              <div className="group flex flex-col">
                <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#f3f4f6] transition-transform duration-300 ease-out group-hover:-translate-y-1">
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-black/55 font-display text-sm font-semibold text-white backdrop-blur-md">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground sm:text-[30px] sm:leading-[1.2]">
                  {step.title}
                </h3>
                <p className="mt-4 text-pretty text-base leading-relaxed text-foreground/70">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
