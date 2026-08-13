import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";
import { Reveal } from "@/app/components/motion/Reveal";

const columns = ["Facile Pay", "Traditional Card", "Phone Pay"] as const;

// per row: [Facile Pay, Traditional Card, Phone Pay]
const rows: { feature: string; values: boolean[] }[] = [
  { feature: "Tap to Pay", values: [true, false, true] },
  { feature: "Shares Your Profile", values: [true, false, false] },
  { feature: "No App Required", values: [true, false, true] },
  { feature: "Premium Metal Build", values: [true, false, false] },
  { feature: "NFC Encrypted", values: [true, false, true] },
  { feature: "Works Without a Phone", values: [true, true, false] },
];

function Check() {
  return (
    <span className="flex size-6 items-center justify-center rounded-xl bg-[#0a0a0a]">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m5 13 4 4L19 7" />
      </svg>
    </span>
  );
}

function Cross() {
  return (
    <span className="flex size-6 items-center justify-center rounded-xl bg-black/[0.05]">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </span>
  );
}

export function PayComparison() {
  return (
    <section className="bg-panel py-24 text-panel-foreground sm:py-28">
      <Container size="lg">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#999]">
            Compare
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-panel-foreground sm:text-5xl md:text-[60px] md:leading-[1.02]">
            It does more than your bank card.
          </h2>
          <p className="mt-3 text-base text-[#777]">
            Facile Pay vs. the card and the phone in your pocket right now.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Card tone="panel" className="mt-14 overflow-hidden rounded-[20px]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#f9f8f5]">
                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#aaa]">
                      Feature
                    </th>
                    {columns.map((col, i) => (
                      <th
                        key={col}
                        className={
                          "border-l border-[#e8e8e4] px-4 py-4 text-center text-xs font-bold uppercase tracking-[0.06em] " +
                          (i === 0
                            ? "bg-[#c4b5fd]/[0.08] text-[#0a0a0a]"
                            : "text-[#999]")
                        }
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.feature} className="border-t border-[#f0efeb]">
                      <td className="px-6 py-3.5 text-sm text-[#444]">
                        {row.feature}
                      </td>
                      {row.values.map((ok, i) => (
                        <td
                          key={i}
                          className={
                            "border-l border-[#f0efeb] px-4 py-3.5 " +
                            (i === 0 ? "bg-[#c4b5fd]/[0.04]" : "")
                          }
                        >
                          <span className="flex justify-center">
                            {ok ? <Check /> : <Cross />}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-7 text-center text-[13px] text-[#888]">
            Ready to upgrade?{" "}
            <a
              href="#pricing"
              className="text-[#555] underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              See pricing →
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
