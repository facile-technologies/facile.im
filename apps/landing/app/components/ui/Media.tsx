"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/app/lib/cn";

/**
 * next/image wrapper that fades + settles in once the bitmap decodes, so the
 * product photos never pop. Pair with a sized parent; pass `fill` or
 * width/height like a normal next/image. Fade/transform live in `.media-fade`.
 */
export function Media({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    // `alt` is forwarded via ...props; the lint rule can't see it statically.
    // eslint-disable-next-line jsx-a11y/alt-text
    <Image
      {...props}
      data-loaded={loaded}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={cn("media-fade", className)}
    />
  );
}
