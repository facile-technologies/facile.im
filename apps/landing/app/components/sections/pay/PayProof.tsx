import { Container } from "@/app/components/ui/Container";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";

const stats: { value: string; label: string }[] = [
  { value: "0.3s", label: "Tap-to-pay confirmation" },
  { value: "150+", label: "Countries accepted" },
  { value: "0 apps", label: "Required to pay" },
];

const testimonials: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "I walked into a meeting, paid for coffee with a tap of my business card. Everyone in the room asked what it was.",
    name: "David R.",
    role: "Partner, Kline Ventures",
  },
  {
    quote:
      "Traveling across 8 countries for work. Facile Pay worked at every single terminal. Never had to think about it.",
    name: "Priya S.",
    role: "Global BD, Notion",
  },
  {
    quote:
      "One tap pays. The next tap hands them my whole portfolio. I retired my wallet and my business cards in the same week.",
    name: "Marcus T.",
    role: "Creative Director",
  },
];

export function PayProof() {
  return (
    <section className="border-t border-white/[0.04] bg-[#080808] py-24 sm:py-28">
      <Container size="lg">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#444]">
              The receipts
            </p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-[56px] md:leading-[1.04]">
              Loved by people who hate friction.
            </h2>
          </div>
        </Reveal>

        {/* stat strip */}
        <Reveal delay={0.06}>
          <div className="mt-14 grid grid-cols-1 divide-y divide-white/[0.06] overflow-hidden rounded-[20px] border border-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center px-6 py-10 text-center"
              >
                <p className="text-5xl font-extrabold leading-none tracking-tight text-white sm:text-[56px]">
                  {s.value}
                </p>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#555]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* testimonials */}
        <Stagger className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.name} className="h-full">
              <div className="flex h-full flex-col gap-4 rounded-[20px] border border-white/[0.08] bg-[#0e0e0e] p-7 transition-colors hover:border-white/[0.16]">
                <p className="text-[13px] tracking-[0.25em] text-[#fbbf24]">
                  ★★★★★
                </p>
                <p className="text-[15px] leading-relaxed text-[#cfcfcf]">
                  “{t.quote}”
                </p>
                <div className="mt-auto pt-2">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-[#666]">{t.role}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
