import { useEffect, useState } from "react";

/**
 * Dark premium showcase column for the auth pages — mirrors the landing's dark
 * hero: brand conic-glow, a floating product image, a rotating feature carousel,
 * animated dots, and a subtle marquee of feature chips. Hidden below `lg`.
 *
 * Uses the landing design primitives ported into index.css (.facile-gradient,
 * .text-gradient, .animate-float, .animate-marquee) and shared tokens.
 */
const base = import.meta.env.BASE_URL;

const slides = [
  {
    image: `${base}images/card.png`,
    eyebrow: "The card",
    title: "Pick your style",
    description: "Choose a smart card, bracelet, or ring from the store.",
  },
  {
    image: `${base}images/phone-card.png`,
    eyebrow: "One tap",
    title: "Share with a tap",
    description: "Instantly share your profile — anytime, anywhere, no app.",
  },
  {
    image: `${base}images/band.png`,
    eyebrow: "Your profile",
    title: "Make it yours",
    description: "Add your details and customize your profile in seconds.",
  },
];

const chips = [
  "NFC ENABLED",
  "NO APP REQUIRED",
  "SHIPS IN 2 DAYS",
  "10,000+ USERS",
  "INSTANT UPDATES",
  "MATTE & METAL",
];

export default function AuthShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i === slides.length - 1 ? 0 : i + 1)),
      3500,
    );
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];

  return (
    <div className="hidden lg:flex lg:w-1/2 lg:sticky lg:top-0 lg:h-screen relative overflow-hidden bg-[#080808] text-white flex-col items-center justify-center p-12">
      {/* Brand conic glow */}
      <div
        aria-hidden
        className="facile-gradient pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[560px] w-[560px] rounded-full opacity-[0.18] blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_40%,rgba(0,0,0,0.6))]"
      />

      {/* Content — image + caption fade in together (keyed on index) so they
          never desync. */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[420px]">
        <div key={index} className="auth-fade flex flex-col items-center">
          <div className="flex h-[300px] w-[340px] items-center justify-center">
            <img
              src={slide.image}
              alt=""
              className="h-full w-auto object-contain animate-float drop-shadow-[0_40px_70px_rgba(0,0,0,0.55)]"
            />
          </div>

          <span className="text-gradient font-display mt-10 text-xs font-semibold uppercase tracking-[0.22em]">
            {slide.eyebrow}
          </span>
          <h3 className="font-display mt-3 text-[30px] font-semibold leading-tight">
            {slide.title}
          </h3>
          <p className="mt-3 max-w-[300px] text-sm leading-relaxed text-white/55">
            {slide.description}
          </p>
        </div>

        {/* Dots */}
        <div className="mt-7 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              style={{
                background:
                  i === index ? "#ffffff" : "rgba(255,255,255,0.25)",
              }}
              className={`h-[6px] rounded-full transition-all duration-300 ${
                i === index ? "w-7" : "w-[6px]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Marquee of feature chips */}
      <div className="absolute bottom-8 left-0 right-0 z-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-3 whitespace-nowrap">
          {[...chips, ...chips].map((chip, i) => (
            <span
              key={i}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/50"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
