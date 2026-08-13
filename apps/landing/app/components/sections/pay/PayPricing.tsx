import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";
import { cn } from "@/app/lib/cn";

type Plan = {
  eyebrow: string;
  note: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

const plans: Plan[] = [
  {
    eyebrow: "Facile Pay Basic",
    note: "with card purchase",
    price: "Free",
    features: [
      "Tap-to-pay enabled",
      "Tap-to-share profile",
      "Standard metal card",
      "Payment dashboard",
    ],
    cta: "Get Started",
    href: "/products",
  },
  {
    eyebrow: "Facile Pay Pro",
    note: "Most popular",
    price: "$9",
    priceSuffix: "/month",
    features: [
      "Everything in Basic",
      "Custom card design",
      "Unlimited profiles",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Go Pro",
    href: "/products",
    featured: true,
  },
  {
    eyebrow: "Facile Pay Business",
    note: "For teams",
    price: "Custom",
    features: [
      "Everything in Pro",
      "Team card management",
      "API access",
      "Branded card design",
      "Dedicated account manager",
    ],
    cta: "Contact Sales",
    href: "/products",
  },
];

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <StaggerItem className="h-full">
      <div
        className={cn(
          "relative flex h-full flex-col rounded-[22px] border p-9 transition-colors",
          plan.featured
            ? "border-white/20 bg-[#151515]"
            : "border-white/[0.08] bg-[#0d0d0d] hover:border-white/15"
        )}
      >
        <div className="flex items-center justify-between">
          <p
            className={cn(
              "text-[11px] font-bold uppercase tracking-[0.16em]",
              plan.featured ? "text-white" : "text-[#666]"
            )}
          >
            {plan.eyebrow}
          </p>
          {plan.featured && (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              Most popular
            </span>
          )}
        </div>
        {!plan.featured && (
          <p className="mt-1.5 text-xs text-[#555]">{plan.note}</p>
        )}
        <p className="mt-5 text-[52px] font-extrabold leading-none tracking-tight text-white">
          {plan.price}
          {plan.priceSuffix && (
            <span className="text-base font-normal tracking-normal text-[#555]">
              {plan.priceSuffix}
            </span>
          )}
        </p>

        <ul className="mt-8 flex flex-1 flex-col gap-3">
          {plan.features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2.5 text-sm text-[#aaa]"
            >
              <span className="flex size-[18px] shrink-0 items-center justify-center rounded-[9px] bg-white/[0.08]">
                <CheckIcon />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <Button
          href={plan.href}
          variant={plan.featured ? "primary" : "secondary"}
          className="mt-8 w-full"
        >
          {plan.cta}
          <ArrowIcon />
        </Button>
      </div>
    </StaggerItem>
  );
}

export function PayPricing() {
  return (
    <section id="pricing" className="bg-[#080808] py-24 sm:py-28">
      <Container size="lg">
        <Reveal>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#444]">
              Pricing
            </p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-[60px] md:leading-[1.02]">
              Own the card. Choose the plan.
            </h2>
            <p className="mt-3 text-base text-[#555]">
              Tap-to-pay and profile sharing are free with every card. Upgrade
              only if you want more.
            </p>
          </div>
        </Reveal>

        <Stagger className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.eyebrow} plan={plan} />
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <p className="mt-8 text-center text-[13px] text-[#444]">
            All plans include free shipping on your card. 30-day returns. No
            hidden fees.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
