import Image from "next/image";
import { cn } from "@/app/lib/cn";

/**
 * Facile logo lockup, rendered from the real brand artwork.
 *
 * The source logo is dark text on light, so we ship two transparent variants
 * and pick the one that reads on the surface:
 *   - logo-full-dark.png  → dark text, for LIGHT surfaces
 *   - logo-full-light.png → white text, for DARK surfaces
 *
 * `surface`:
 *   - "auto"  → follow the active theme via CSS (`.dark`); use in the navbar.
 *   - "light" → force the dark-text logo (e.g. the white footer).
 *   - "dark"  → force the white-text logo (e.g. a hardcoded-dark section).
 */
export function Wordmark({
  className,
  surface = "auto",
  priority = false,
}: {
  className?: string;
  surface?: "auto" | "light" | "dark";
  priority?: boolean;
}) {
  // Intrinsic ratio of the artwork is 1600×416 (≈3.846:1).
  const w = 122;
  const h = 32;
  const common = "h-5 w-auto select-none";

  if (surface === "light") {
    return (
      <Image
        src="/brand/logo-full-dark.png"
        alt="Facile"
        width={w}
        height={h}
        priority={priority}
        className={cn(common, className)}
      />
    );
  }

  if (surface === "dark") {
    return (
      <Image
        src="/brand/logo-full-light.png"
        alt="Facile"
        width={w}
        height={h}
        priority={priority}
        className={cn(common, className)}
      />
    );
  }

  // auto — render both, toggle by theme class. (Tailwind `dark:` is wired to
  // the `.dark` class in globals.css.)
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src="/brand/logo-full-dark.png"
        alt="Facile"
        width={w}
        height={h}
        priority={priority}
        className={cn(common, "block dark:hidden")}
      />
      <Image
        src="/brand/logo-full-light.png"
        alt="Facile"
        width={w}
        height={h}
        priority={priority}
        className={cn(common, "hidden dark:block")}
      />
    </span>
  );
}
