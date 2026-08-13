const items = [
  "NFC ENABLED",
  "NO APP REQUIRED",
  "SHIPS IN 2 DAYS",
  "10,000+ USERS",
  "INSTANT PROFILE UPDATES",
  "30-DAY RETURNS",
  "MATTE & METAL",
  "FREE PROFILE INCLUDED",
];

function Track() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((label) => (
        <span key={label} className="flex items-center">
          <span className="px-6 text-[11px] font-medium uppercase tracking-[0.13em] text-foreground/25">
            {label}
          </span>
          <span className="text-[10px] text-foreground/15">✦</span>
        </span>
      ))}
    </div>
  );
}

export function MarqueeStrip() {
  return (
    <div className="overflow-hidden border-y border-border bg-foreground/[0.02]">
      <div className="flex w-max animate-marquee py-3">
        <Track />
        <Track />
      </div>
    </div>
  );
}
