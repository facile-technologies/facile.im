import { Media } from "@/app/components/ui/Media";
import { cn } from "@/app/lib/cn";

type Tone = "dark" | "steel" | "white";

/** Real product photo per tone. All ship on transparent/neutral backgrounds. */
const tonePhoto: Record<Tone, { src: string; alt: string }> = {
  dark: { src: "/images/card.png", alt: "Facile NFC smart card, matte black" },
  steel: {
    src: "/cards/hero-card.png",
    alt: "Facile Metal card, brushed steel finish",
  },
  white: {
    src: "/images/card-2.png",
    alt: "Facile NFC card, clean matte finish",
  },
};

/**
 * Floating product photo used across the shop tiles. Defaults to a per-tone
 * card render, but any `src`/`alt` can be passed for bands, plates, etc.
 * Hover-zoom lives on the parent `.group`.
 */
export function CardVisual({
  tone = "dark",
  src,
  alt,
  className,
  priority,
}: {
  tone?: Tone;
  src?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  const photo = tonePhoto[tone];
  return (
    <div
      className={cn(
        "relative aspect-square w-full select-none",
        className
      )}
    >
      <Media
        src={src ?? photo.src}
        alt={alt ?? photo.alt}
        fill
        priority={priority}
        sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 320px"
        className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.4)] transition-transform duration-500 ease-out group-hover:scale-[1.06]"
      />
    </div>
  );
}
