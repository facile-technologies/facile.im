import type { ReactNode } from "react";
import { cn } from "@/app/lib/cn";

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

/**
 * Consistent section header: optional eyebrow, large display title, supporting
 * copy. Colors inherit from the parent surface (currentColor / muted tokens).
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <span className="text-xs font-semibold uppercase tracking-[0.12em] opacity-60">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-[44px] md:leading-[1.05]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-xl text-pretty text-base leading-relaxed opacity-70">
          {description}
        </p>
      ) : null}
    </div>
  );
}
