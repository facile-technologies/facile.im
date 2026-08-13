"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/app/lib/cn";

export type CategoryTabItem = {
  id: string;
  label: string;
  /** Thumbnail photo (products / shops). */
  thumb?: string;
  /** Line icon node (faq topics, where a photo doesn't fit). */
  icon?: ReactNode;
  /** Small caption under the label (optional, used in the nav mega-menu). */
  caption?: string;
  /** When set, the tile is a link instead of a select button. */
  href?: string;
  /** object-contain for renders shot on transparent/edge backdrops. */
  contain?: boolean;
};

/**
 * Premium image/icon + name filter tiles. Surface-agnostic (uses the
 * `foreground` token), so it reads on the dark products strip and the light
 * panels alike. Renders buttons (with `onSelect`) or links (when items carry an
 * `href`, e.g. the navbar mega-menu). Horizontal scroll-rail by default,
 * vertical list when `orientation="vertical"`.
 */
export function CategoryTabs({
  items,
  activeId,
  onSelect,
  orientation = "horizontal",
  ariaLabel,
  className,
}: {
  items: CategoryTabItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  orientation?: "horizontal" | "vertical";
  ariaLabel?: string;
  className?: string;
}) {
  const horizontal = orientation === "horizontal";

  return (
    <div
      role={onSelect ? "tablist" : undefined}
      aria-label={ariaLabel}
      className={cn(
        horizontal
          ? "flex gap-2.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          : "flex flex-col gap-1.5",
        className
      )}
    >
      {items.map((item) => {
        const isActive = activeId === item.id;

        const inner = (
          <>
            <span
              className={cn(
                "relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-foreground/[0.05] transition-transform duration-300 group-hover/tab:scale-[1.04]",
                "size-11"
              )}
            >
              {item.thumb ? (
                <Image
                  src={item.thumb}
                  alt=""
                  fill
                  sizes="44px"
                  className={cn(
                    "object-cover",
                    item.contain && "object-contain p-1"
                  )}
                />
              ) : (
                <span className="text-foreground/70">{item.icon}</span>
              )}
            </span>
            <span className="min-w-0 text-left">
              <span
                className={cn(
                  "block truncate text-[13px] font-semibold leading-tight transition-colors",
                  isActive ? "text-foreground" : "text-foreground/65"
                )}
              >
                {item.label}
              </span>
              {item.caption && (
                <span className="mt-0.5 block truncate text-[11px] text-foreground/40">
                  {item.caption}
                </span>
              )}
            </span>
          </>
        );

        const tileClass = cn(
          "group/tab relative flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-200",
          horizontal ? "min-w-[176px] shrink-0" : "w-full",
          isActive
            ? "border-foreground/70 bg-foreground/[0.07] shadow-[0_0_0_1px_rgba(127,127,127,0.18),0_10px_28px_rgba(0,0,0,0.18)]"
            : "border-foreground/10 bg-foreground/[0.025] hover:-translate-y-0.5 hover:border-foreground/25 hover:bg-foreground/[0.06]"
        );

        if (item.href) {
          return (
            <Link key={item.id} href={item.href} className={tileClass}>
              {inner}
            </Link>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect?.(item.id)}
            className={tileClass}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}
