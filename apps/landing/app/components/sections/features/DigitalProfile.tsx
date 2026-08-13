import type { ReactNode } from "react";
import { Container } from "@/app/components/ui/Container";
import { Reveal } from "@/app/components/motion/Reveal";
import { Tilt } from "@/app/components/motion/Float";

const BRAND_GRADIENT =
  "linear-gradient(135deg, #c4b5fd 0%, #7dd3fc 100%)";

function ProfileCardMock() {
  return (
    <Tilt
      max={7}
      className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#eceae5] to-[#dedcd6] p-6 ring-1 ring-black/[0.04]"
    >
      <div className="w-[260px] rounded-[20px] bg-[#0a0a0a] p-6 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-3">
          <div
            className="size-[52px] shrink-0 rounded-full"
            style={{ backgroundImage: BRAND_GRADIENT }}
          />
          <div>
            <p className="text-[15px] font-bold text-white">Alex Morgan</p>
            <p className="text-xs text-[#666]">Product Designer</p>
          </div>
        </div>
        <p className="mt-3.5 text-xs leading-snug text-[#777]">
          Designing digital products that feel inevitable.
        </p>
        <div className="mt-3.5 flex flex-col gap-2.5">
          {["linkedin.com/alexmorgan", "dribbble.com/alex", "calendly.com/alex"].map(
            (l) => (
              <div
                key={l}
                className="rounded-lg bg-[#1a1a1a] px-3 py-2 text-[11px] text-[#777]"
              >
                {l}
              </div>
            )
          )}
        </div>
      </div>
    </Tilt>
  );
}

function UrlBarMock() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#eceae5] to-[#dedcd6] p-6 ring-1 ring-black/[0.04]">
      <div className="w-[300px]">
        <div className="flex items-center gap-2.5 rounded-xl bg-[#0d0d0d] px-3.5 py-2.5">
          <span className="size-2 shrink-0 rounded bg-[#6ee7b7]" />
          <span className="font-mono text-xs text-[#888]">
            facile.me/
            <span
              className="bg-clip-text font-bold text-transparent"
              style={{ backgroundImage: BRAND_GRADIENT }}
            >
              alexmorgan
            </span>
          </span>
        </div>
        <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-[#0d0d0d] px-4 py-3.5">
          <span className="size-2 shrink-0 rounded bg-[#c4b5fd]" />
          <span className="font-mono text-xs text-[#888]">yourname.com</span>
        </div>
        <p className="mt-3 text-center text-[11px] tracking-[0.08em] text-[#888]">
          CUSTOM DOMAIN — PRO PLAN
        </p>
      </div>
    </div>
  );
}

function SyncMock() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#eceae5] to-[#dedcd6] p-6 ring-1 ring-black/[0.04]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-6 rounded-lg bg-[#0d0d0d] px-3 py-2">
          <span className="text-xs text-[#888]">Profile saved</span>
          <span className="font-mono text-[11px] text-[#444]">14:32:01</span>
        </div>
        <div className="flex items-center justify-between gap-6 rounded-lg bg-[#0d0d0d] px-3 py-2">
          <span className="text-xs text-[#6ee7b7]">Change live</span>
          <span className="font-mono text-[11px] text-[#444]">14:32:03</span>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-[10px] bg-black/[0.07]">
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#555"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

function SplitRow({
  reversed,
  visual,
  children,
}: {
  reversed?: boolean;
  visual: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <Reveal className={reversed ? "lg:order-2" : ""}>
        <div className="aspect-[664/380] w-full">{visual}</div>
      </Reveal>
      <Reveal delay={0.08} className={reversed ? "lg:order-1" : ""}>
        <div>{children}</div>
      </Reveal>
    </div>
  );
}

const label = "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#999]";
const h3 =
  "font-display mt-4 text-[32px] font-extrabold leading-[1.15] tracking-tight text-[#0a0a0a] sm:text-[36px]";
const body = "mt-4 max-w-md text-[15px] leading-relaxed text-[#666]";

export function DigitalProfile() {
  return (
    <section className="bg-[#f2f1ee] py-24 text-[#0a0a0a]">
      <Container size="lg">
        <Reveal>
          <p className={label}>Digital Profile</p>
          <h2 className="font-display mt-4 max-w-xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-[52px]">
            The profile behind the tap.
          </h2>
          <p className="mt-3 max-w-md text-base text-[#777]">
            One living page for everything you do — edit it from anywhere, and
            your card always shows the latest you.
          </p>
        </Reveal>

        <div className="mt-20 flex flex-col gap-24">
          <SplitRow visual={<ProfileCardMock />}>
            <p className={label}>Profile Builder</p>
            <h3 className={h3}>
              Set up in minutes.
              <br />
              Update in seconds.
            </h3>
            <p className={body}>
              Add your photo, bio, social links, portfolio, payment links, and
              contact details from your dashboard. Changes go live instantly — no
              republishing, no waiting.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-2.5">
              {[
                ["Unlimited", "LINKS SUPPORTED"],
                ["< 2 sec", "TIME TO GO LIVE"],
                ["Any device", "EDIT FROM ANYWHERE"],
                ["Free", "PROFILE INCLUDED"],
              ].map(([v, k]) => (
                <div key={k} className="rounded-[10px] bg-black/[0.06] px-4 py-3">
                  <p className="text-base font-bold text-[#0a0a0a]">{v}</p>
                  <p className="mt-0.5 text-[11px] tracking-[0.06em] text-[#888]">
                    {k}
                  </p>
                </div>
              ))}
            </div>
          </SplitRow>

          <SplitRow reversed visual={<UrlBarMock />}>
            <p className={label}>Custom Domain</p>
            <h3 className={h3}>
              A URL that&apos;s
              <br />
              yours forever.
            </h3>
            <p className={body}>
              Every profile gets a clean{" "}
              <span className="font-bold text-[#0a0a0a]">facile.me/yourname</span>{" "}
              URL the moment you sign up. Upgrade anytime to connect your own
              custom domain for a fully branded experience.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Instant URL", "Custom domain", "No expiry", "SEO-friendly"].map(
                (p) => (
                  <span
                    key={p}
                    className="rounded-full bg-[#0a0a0a] px-3.5 py-1.5 text-xs font-medium text-white"
                  >
                    {p}
                  </span>
                )
              )}
            </div>
          </SplitRow>

          <SplitRow visual={<SyncMock />}>
            <p className={label}>Real-time Sync</p>
            <h3 className={h3}>
              Edit once.
              <br />
              Live everywhere.
            </h3>
            <p className={body}>
              Your profile updates propagate globally in under 2 seconds. Change
              your job title, add a new link, or swap your photo — everyone sees
              the latest version immediately.
            </p>
            <ul className="mt-7 flex flex-col gap-3">
              {[
                "Changes push instantly, no cache delay",
                "Edit from mobile, tablet, or desktop",
                "Version history — restore any past profile",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm text-[#555]">
                  <CheckIcon />
                  {t}
                </li>
              ))}
            </ul>
          </SplitRow>
        </div>
      </Container>
    </section>
  );
}
