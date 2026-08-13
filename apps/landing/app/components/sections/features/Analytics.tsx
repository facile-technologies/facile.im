import type { ReactNode } from "react";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";
import { Tilt } from "@/app/components/motion/Float";

function CursorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3l7.5 18 2.3-7.2L20 11.5 3 3z" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 15l6-6" />
      <path d="M11 7l1-1a4 4 0 0 1 6 6l-1 1" />
      <path d="M13 17l-1 1a4 4 0 0 1-6-6l1-1" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function InfoCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <Card
      tone="panel"
      className="h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.18)]"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-black/[0.05]">
        {icon}
      </span>
      <h3 className="mt-5 text-[15px] font-bold text-[#0a0a0a]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#777]">{body}</p>
    </Card>
  );
}

const BARS = [28, 36, 30, 44, 38, 52, 46, 60, 54, 72, 80, 96];

function DashboardMock() {
  const countries = [
    ["United States", "48%", 48],
    ["United Kingdom", "22%", 22],
    ["Germany", "14%", 14],
    ["Canada", "10%", 10],
  ] as const;
  return (
    <Tilt
      max={5}
      className="mx-auto w-full max-w-md rounded-[24px] bg-[#0d0d0d] p-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.04]"
    >
      <div className="grid grid-cols-3 gap-4 border-b border-white/[0.06] pb-6">
        {[
          ["384", "TOTAL TAPS"],
          ["247", "LINK CLICKS"],
          ["12", "COUNTRIES"],
        ].map(([v, k]) => (
          <div key={k}>
            <p className="font-display text-3xl font-extrabold text-white">{v}</p>
            <p className="mt-1 text-[10px] tracking-[0.1em] text-[#666]">{k}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-[10px] tracking-[0.1em] text-[#666]">TAPS OVER 12 WEEKS</p>
          <div className="mt-4 flex h-24 items-end gap-1.5">
            {BARS.map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: i >= BARS.length - 2 ? "#6ee7b7" : "#2a2a2a",
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] tracking-[0.1em] text-[#666]">TOP COUNTRIES</p>
          <div className="mt-4 flex flex-col gap-3">
            {countries.map(([name, pct, w]) => (
              <div key={name}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#bbb]">{name}</span>
                  <span className="text-[11px] text-[#666]">{pct}</span>
                </div>
                <div className="mt-1.5 h-1 w-full rounded-full bg-[#222]">
                  <span
                    className="block h-full rounded-full bg-[#6ee7b7]"
                    style={{ width: `${w * 2}%`, maxWidth: "100%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Tilt>
  );
}

export function Analytics() {
  return (
    <section className="bg-[#f2f1ee] py-24 text-[#0a0a0a]">
      <Container size="lg">
        <Reveal className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#999]">
            Analytics
          </p>
          <h2 className="font-display mx-auto mt-4 max-w-2xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-[56px]">
            See every tap land.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#777]">
            A real-time dashboard that turns each tap into insight — who
            connected, what they clicked, and where in the world they are.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          <StaggerItem>
            <InfoCard icon={<CursorIcon />} title="Tap Tracking" body="See every tap with timestamp and location data. Know when and where your card is working." />
          </StaggerItem>
          <StaggerItem>
            <InfoCard icon={<LinkIcon />} title="Link Clicks" body="Track which links on your profile get clicked, by how many people, and when." />
          </StaggerItem>
          <StaggerItem>
            <InfoCard icon={<GlobeIcon />} title="Countries & Devices" body="Geographic heatmap of where your card is being tapped worldwide." />
          </StaggerItem>
        </Stagger>

        <Reveal delay={0.1} className="mt-12">
          <DashboardMock />
        </Reveal>
      </Container>
    </section>
  );
}
