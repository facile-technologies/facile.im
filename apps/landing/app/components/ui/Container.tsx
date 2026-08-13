import type { ReactNode } from "react";
import { cn } from "@/app/lib/cn";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /**
   * Content max-width. sm/md/lg keep a readable measure; `xl`/`full` open up so
   * big and ultra-wide screens fill out instead of stranding a center column.
   * `bleed` removes the max-width entirely (true edge-to-edge).
   */
  size?: "sm" | "md" | "lg" | "xl" | "full" | "bleed";
  as?: "div" | "section" | "header" | "footer" | "nav";
};

const sizes = {
  sm: "max-w-[920px]",
  md: "max-w-[1120px]",
  lg: "max-w-[1280px]",
  xl: "max-w-[1440px]",
  full: "max-w-[1680px]",
  bleed: "max-w-none",
} as const;

export function Container({
  children,
  className,
  size = "md",
  as: Tag = "div",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12 2xl:px-20",
        sizes[size],
        className
      )}
    >
      {children}
    </Tag>
  );
}
