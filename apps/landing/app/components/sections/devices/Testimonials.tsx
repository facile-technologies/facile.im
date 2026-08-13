import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Card } from "@/app/components/ui/Card";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";

type Review = {
  quote: string;
  name: string;
  role: string;
};

const REVIEWS: Review[] = [
  {
    quote:
      "Simply the best solution on the market right now. Highly recommended.",
    name: "Benjamin Evans",
    role: "Product Designer",
  },
  {
    quote:
      "I handed out my card at a conference and tripled my follow-ups overnight.",
    name: "Sofia Martinez",
    role: "Founder, Loop",
  },
  {
    quote:
      "The metal card feels incredible. People remember the tap every single time.",
    name: "Daniel Kim",
    role: "Sales Lead",
  },
  {
    quote:
      "Setup took two minutes and I never have to reprint when my links change.",
    name: "Amara Okafor",
    role: "Freelance Developer",
  },
  {
    quote:
      "Our whole team switched. The shared dashboard makes onboarding effortless.",
    name: "Liam Walsh",
    role: "Operations Manager",
  },
  {
    quote:
      "Clients are genuinely impressed. It's the easiest networking upgrade I've made.",
    name: "Priya Sharma",
    role: "Brand Consultant",
  },
];

function Stars() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5 text-[#f5b54a]">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-3.5"
            aria-hidden
          >
            <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.8 6.1 20.2l1.2-6.6L2.5 9l6.6-.9L12 2z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-foreground">5.0</span>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="bg-background py-24 text-foreground sm:py-32">
      <Container size="lg">
        <Reveal className="flex justify-center">
          <SectionHeading
            align="center"
            className="font-display"
            title={
              <>
                The last business card they&apos;ll{" "}
                <span className="text-gradient">remember</span>
              </>
            }
            description="Founders, creatives, and sales teams who made the switch."
          />
        </Reveal>

        <Stagger className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <StaggerItem key={review.name}>
              <Card tone="card" className="flex h-full flex-col p-6">
                <Stars />
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-foreground/80">
                  {review.quote}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
                    {review.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-foreground">
                      {review.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.role}
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
