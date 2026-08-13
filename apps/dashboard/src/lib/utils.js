import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getPlatformIcon = (platformLink, iconStyle) => {
  if (!platformLink) return null

  switch (iconStyle) {
    case "COLORED":
      return platformLink.colored_icon || platformLink.default_icon

    case "BLACK":
      return platformLink.black_icon || platformLink.default_icon

    case "WHITE":
      return platformLink.white_icon || platformLink.default_icon

    case "STROKED":
      return platformLink.stroked_icon || platformLink.default_icon

    default:
      return platformLink.default_icon
  }
}