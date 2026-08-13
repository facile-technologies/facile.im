import type { ReactNode } from "react";
import { Container } from "@/app/components/ui/Container";
import { Media } from "@/app/components/ui/Media";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";
import { Float, Tilt } from "@/app/components/motion/Float";

function Icon({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.03]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </span>
  );
}

const ITEMS: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <><path d="M12 3 3 8l9 5 9-5-9-5z" /><path d="m3 13 9 5 9-5" /></>,
    title: "Profile layout",
    body: "Four clean templates to start from",
  },
  {
    icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h7v7h-7z" /></>,
    title: "Custom URL",
    body: "Claim your own facile.me/handle",
  },
  {
    icon: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></>,
    title: "Card finish",
    body: "Matte PVC or brushed metal",
  },
  {
    icon: <><circle cx="13.5" cy="6.5" r="1.5" /><circle cx="17.5" cy="10.5" r="1.5" /><circle cx="8.5" cy="7.5" r="1.5" /><circle cx="6.5" cy="12.5" r="1.5" /><path d="M12 2a10 10 0 0 0 0 20 2.5 2.5 0 0 0 2.5-2.5c0-.7-.3-1.3-.7-1.8-.4-.5-.7-1-.7-1.7a2.5 2.5 0 0 1 2.5-2.5H18a4 4 0 0 0 4-4 10 10 0 0 0-10-7.5z" /></>,
    title: "Accent colour",
    body: "Any colour for your profile links",
  },
  {
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" /></>,
    title: "Avatar",
    body: "Upload your photo or company logo",
  },
  {
    icon: <><path d="M21 12a9 9 0 1 1-3-6.7" /><path d="M21 4v4h-4" /></>,
    title: "Bio",
    body: "A line that says exactly who you are",
  },
];

function FinishVisual() {
  return (
    <Float amount={10} duration={7}>
      <Tilt
        max={8}
        className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] ring-1 ring-white/[0.08]"
      >
        <Media
          src="/images/card-2.png"
          alt="A matte black Facile smart card with laser-engraved logo and QR fallback"
          fill
          sizes="(min-width: 1024px) 32vw, 100vw"
          className="object-contain p-6"
        />
        <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2.5">
          <span className="size-7 rounded-full bg-[#2a2a2a] ring-1 ring-white/10" />
          <span className="size-7 rounded-full bg-gradient-to-b from-[#d0d0d0] to-[#8a8a8a] ring-1 ring-white/20" />
          <span className="size-7 rounded-full bg-[#ececec] ring-1 ring-white/20" />
          <span className="ml-1 text-[11px] tracking-[0.18em] text-[#777]">
            MATTE / METAL
          </span>
        </div>
      </Tilt>
    </Float>
  );
}

export function Customisation() {
  return (
    <section className="bg-[#080808] py-24">
      <Container size="lg">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a7a7a]">
            Customisation
          </p>
          <h2 className="font-display mt-4 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[56px]">
            Make it <span className="text-gradient">unmistakably</span> yours.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#9a9a9a]">
            From the finish in your hand to the colour of every link — tune the
            details until the whole thing feels like your brand.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <Stagger className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {ITEMS.map((it) => (
              <StaggerItem key={it.title}>
                <div className="flex items-start gap-4">
                  <Icon>{it.icon}</Icon>
                  <div>
                    <p className="text-[15px] font-bold text-white">{it.title}</p>
                    <p className="mt-1 text-sm text-[#8a8a8a]">{it.body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1}>
            <FinishVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
