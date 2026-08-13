import { Container } from "@/app/components/ui/Container";
import { Reveal } from "@/app/components/motion/Reveal";

const GRADIENT =
  "linear-gradient(155deg, #c4b5fd 0%, #7dd3fc 50%, #6ee7b7 100%)";

function LockIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e5e5e5" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

const facts: { label: string; value: string }[] = [
  { label: "Encryption", value: "256-bit AES" },
  { label: "Card data stored", value: "Never" },
  { label: "Certification", value: "ISO 14443" },
];

export function PaySecurity() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.04] bg-[#080808] py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-0 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c4b5fd]/[0.05] blur-[150px]"
      />

      <Container size="lg">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <div className="max-w-xl">
              <div className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-[14px] border border-white/[0.07] bg-white/[0.04]">
                  <LockIcon />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#444]">
                  Security
                </p>
              </div>
              <h2 className="mt-6 font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-5xl md:text-[54px] md:leading-[1.02]">
                Bank-level encryption on
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: GRADIENT }}
                >
                  {" "}
                  every tap.
                </span>
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-[#888]">
                256-bit AES encryption. Your card data is never stored —
                cryptographically signed and transmitted once, per tap, at any
                NFC terminal worldwide.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid grid-cols-1 divide-y divide-white/[0.06] overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.02]">
              {facts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center justify-between px-7 py-6"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#555]">
                    {f.label}
                  </span>
                  <span className="text-xl font-bold tracking-tight text-white">
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
