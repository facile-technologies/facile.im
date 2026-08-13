import { Container } from "@/app/components/ui/Container";
import { Reveal } from "@/app/components/motion/Reveal";

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 18V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1" />
      <path d="M14 9h4l3 3v5a1 1 0 0 1-1 1h-1" />
      <circle cx="7.5" cy="18.5" r="1.5" />
      <circle cx="17.5" cy="18.5" r="1.5" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
    </svg>
  );
}

function SealIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m9 12 2 2 4-4" />
      <path d="M12 3 4 7v6c0 5 3.5 7.5 8 8 4.5-.5 8-3 8-8V7l-8-4Z" />
    </svg>
  );
}

const ITEMS = [
  {
    icon: <ShieldIcon />,
    title: "Secure checkout",
    desc: "Payments handled by Shopify",
  },
  {
    icon: <TruckIcon />,
    title: "Fast, free shipping",
    desc: "On every order over $50",
  },
  {
    icon: <ReturnIcon />,
    title: "30-day returns",
    desc: "Don't love it? Send it back",
  },
  {
    icon: <SealIcon />,
    title: "2-year warranty",
    desc: "Built to last, covered if not",
  },
];

/** Premium trust strip below the hero — the reassurance before the catalog. */
export function TrustRow() {
  return (
    <section className="border-y border-border bg-background py-10 text-foreground sm:py-12">
      <Container size="xl">
        <Reveal>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {ITEMS.map((item) => (
              <li key={item.title} className="flex items-start gap-3.5">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-strong bg-foreground/[0.04] text-accent">
                  {item.icon}
                </span>
                <div>
                  <p className="text-[14px] font-semibold tracking-tight text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
