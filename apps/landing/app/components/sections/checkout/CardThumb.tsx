import { Media } from "@/app/components/ui/Media";
import { cn } from "@/app/lib/cn";

/**
 * Product photo shown in cart rows and order summaries. Renders the real card
 * image (from the catalog) on a subtle gradient tile via the Media wrapper, which
 * fades the bitmap in once it decodes — no jarring pop.
 */
export function CardThumb({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-foreground/[0.08] to-foreground/[0.02]",
        className
      )}
    >
      <Media
        src={src}
        alt={alt}
        fill
        sizes="64px"
        className="object-contain p-1"
      />
    </span>
  );
}
