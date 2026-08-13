import Link from "next/link";
import { Wordmark } from "./Wordmark";

const columns = [
  {
    title: "PRODUCT",
    links: [
      { label: "Features", href: "/features" },
      { label: "Devices", href: "/devices" },
      { label: "Shops", href: "/shops" },
      { label: "Pay", href: "/pay" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Designs", href: "/products" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="light border-t border-black/[0.06] bg-panel text-[#0a0a0a]">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-16 sm:px-8 lg:px-20 lg:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="max-w-[260px]">
            <Link href="/" aria-label="Facile home">
              <Wordmark surface="light" />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-[#888]">
              The future of professional networking.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:gap-20">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-[11px] font-semibold tracking-[0.1em] text-[#999]">
                  {col.title}
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[13px] text-[#555] transition-colors hover:text-black"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-black/[0.07] pt-6">
          <p className="text-xs text-[#999]">© 2026 Facile. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
