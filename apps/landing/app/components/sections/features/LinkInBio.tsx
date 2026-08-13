import type { ReactNode } from "react";
import { Container } from "@/app/components/ui/Container";
import { Reveal } from "@/app/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";

const BRAND_GRADIENT = "linear-gradient(135deg, #c4b5fd 0%, #7dd3fc 100%)";

const eyebrow =
  "text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a7a7a]";
const cardTitle =
  "font-display mt-4 text-[22px] font-extrabold leading-tight tracking-tight text-white";
const cardBody = "mt-3 text-sm leading-relaxed text-[#9a9a9a]";

function FeatureCard({
  className,
  label,
  title,
  body,
  children,
}: {
  className?: string;
  label: string;
  title: ReactNode;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={`group flex flex-col rounded-3xl border border-white/[0.06] bg-white/[0.025] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:bg-white/[0.04] ${className ?? ""}`}
    >
      <div className="flex flex-col">
        <p className={eyebrow}>{label}</p>
        <h3 className={cardTitle}>{title}</h3>
        <p className={cardBody}>{body}</p>
      </div>
      {children}
    </div>
  );
}

function LinkRows() {
  const links = [
    "linkedin.com/alexmorgan",
    "dribbble.com/alex",
    "calendly.com/alexmorgan",
    "paypal.me/alex",
  ];
  return (
    <div className="mt-6 flex flex-col gap-2.5">
      {links.map((l) => (
        <div
          key={l}
          className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-[#0d0d0d] px-3.5 py-2.5"
        >
          <span className="size-1.5 shrink-0 rounded-full bg-[#555]" />
          <span className="font-mono text-xs text-[#8a8a8a]">{l}</span>
        </div>
      ))}
    </div>
  );
}

function DomainPill() {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-[#0d0d0d] px-4 py-3">
        <span className="size-2 shrink-0 rounded-full bg-[#6ee7b7]" />
        <span className="font-mono text-sm text-[#8a8a8a]">
          facile.me/
          <span
            className="bg-clip-text font-bold text-transparent"
            style={{ backgroundImage: BRAND_GRADIENT }}
          >
            alexmorgan
          </span>
        </span>
      </div>
    </div>
  );
}

function SyncRows() {
  return (
    <div className="mt-6 flex flex-col gap-2.5">
      <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0d0d0d] px-3.5 py-2.5">
        <span className="text-xs text-[#9a9a9a]">Profile saved</span>
        <span className="font-mono text-[11px] text-[#4a4a4a]">14:32:01</span>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-[#6ee7b7]/20 bg-[#0d0d0d] px-3.5 py-2.5">
        <span className="text-xs text-[#6ee7b7]">Change live</span>
        <span className="font-mono text-[11px] text-[#4a4a4a]">14:32:03</span>
      </div>
    </div>
  );
}

function ThemeSwatches() {
  const themes = [
    ["#3a3550", "#4a4565", "#2a2740"],
    ["#2a4a55", "#356070", "#1f3a45"],
    ["#2a4a3a", "#356b50", "#1f3a2d"],
  ];
  return (
    <div className="mt-auto flex items-end gap-3 pt-6">
      {themes.map((t, i) => (
        <div
          key={i}
          className="flex w-[68px] flex-col gap-2 rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-2.5"
        >
          <span className="h-3 rounded" style={{ backgroundColor: t[0] }} />
          <span className="h-3 rounded" style={{ backgroundColor: t[1] }} />
          <span className="h-3 rounded" style={{ backgroundColor: t[2] }} />
        </div>
      ))}
    </div>
  );
}

function ContactIcon() {
  return (
    <span className="flex size-9 items-center justify-center rounded-xl border border-white/[0.06] bg-[#0d0d0d]">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#bbb"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a7 7 0 0 1 14 0v1" />
      </svg>
    </span>
  );
}

export function LinkInBio() {
  return (
    <section className="bg-[#080808] py-24">
      <Container size="lg">
        <Reveal>
          <p className={eyebrow}>The Profile</p>
          <h2 className="font-display mt-4 max-w-2xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-[56px]">
            Your link in bio, <span className="text-gradient">evolved.</span>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[#9a9a9a]">
            Every link, social and detail on one page that actually looks like
            you. Built in minutes, updated in seconds.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-5 lg:grid-cols-3">
          <StaggerItem className="lg:row-span-1">
            <FeatureCard
              className="h-full"
              label="Unlimited Links"
              title="Add anything."
              body="Social media, portfolio, Calendly, payment links, Spotify, YouTube — no limit on links or link types."
            >
              <LinkRows />
            </FeatureCard>
          </StaggerItem>

          <StaggerItem>
            <FeatureCard
              className="h-full"
              label="Custom Domain"
              title={
                <>
                  facile.me/
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: BRAND_GRADIENT }}
                  >
                    you
                  </span>
                </>
              }
              body="Every profile gets a clean facile.me/yourname URL. Upgrade for a fully custom domain."
            >
              <DomainPill />
            </FeatureCard>
          </StaggerItem>

          <StaggerItem>
            <FeatureCard
              className="h-full"
              label="Instant Updates"
              title="Change anything. Instantly."
              body="Edit your profile from your dashboard. Changes go live in under 2 seconds. Your physical card never goes out of date."
            >
              <SyncRows />
            </FeatureCard>
          </StaggerItem>

          <StaggerItem className="lg:col-span-2">
            <FeatureCard
              className="h-full lg:flex-row lg:items-center lg:justify-between lg:gap-10"
              label="Profile Builder"
              title="Beautiful by default."
              body="Choose from multiple layout themes, set your accent color, add your avatar, bio, and social icons. No design skills needed — every profile looks polished."
            >
              <ThemeSwatches />
            </FeatureCard>
          </StaggerItem>

          <StaggerItem>
            <FeatureCard
              className="h-full"
              label="Contact Save"
              title="One-tap contact save."
              body="Recipients can save your number, email, and socials to their contacts in one tap."
            >
              <div className="mt-6">
                <ContactIcon />
              </div>
            </FeatureCard>
          </StaggerItem>
        </Stagger>
      </Container>
    </section>
  );
}
