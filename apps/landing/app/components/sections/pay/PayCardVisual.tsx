import { Media } from "@/app/components/ui/Media";
import { cn } from "@/app/lib/cn";

/**
 * The Facile Pay card hero visual — the real matte-black render (two stacked
 * cards with the laser-etched wordmark + QR) instead of a CSS mock, so the
 * premium materials read instantly. `width` scales the whole visual; the
 * source render is square (transparent background) so it sits on any surface.
 */
export function PayCardVisual({
  width = 240,
  className,
  priority = false,
  glow = true,
}: {
  width?: number;
  className?: string;
  priority?: boolean;
  /** Heavy drop-shadow under the card — on for hero/CTA, off inside small cards. */
  glow?: boolean;
}) {
  return (
    <div
      className={cn("relative", className)}
      style={{ width, maxWidth: "100%" }}
    >
      <Media
        src="/images/card.png"
        alt="Facile Pay card — matte-black metal with laser-etched wordmark and contactless QR"
        width={640}
        height={640}
        priority={priority}
        sizes="(max-width: 640px) 80vw, 500px"
        className={cn(
          "h-auto w-full",
          glow && "drop-shadow-[0_40px_70px_rgba(0,0,0,0.6)]"
        )}
      />
    </div>
  );
}
