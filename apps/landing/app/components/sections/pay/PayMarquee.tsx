const items = [
  "TAP TO PAY",
  "TAP TO SHARE",
  "0.3S VERIFICATION",
  "WORKS EVERYWHERE",
  "NFC ENCRYPTED",
  "BRUSHED METAL",
  "NO APP NEEDED",
  "ISO 14443 CERTIFIED",
  "BANK-LEVEL SECURITY",
];

function Track() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {items.map((label) => (
        <span key={label} className="flex items-center">
          <span className="px-6 text-[11px] font-medium uppercase tracking-[0.13em] text-[#3a3a3a]">
            {label}
          </span>
          <span className="text-[10px] text-[#282828]">✦</span>
        </span>
      ))}
    </div>
  );
}

export function PayMarquee() {
  return (
    <div className="overflow-hidden border-y border-white/[0.06] bg-[#111]">
      <div className="flex w-max animate-marquee py-3">
        <Track />
        <Track />
      </div>
    </div>
  );
}
