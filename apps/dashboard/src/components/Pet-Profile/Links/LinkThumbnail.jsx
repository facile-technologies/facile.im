import { X } from "lucide-react";
import PlatformLinksAccordion from "../../shared/PlatformLinksAccordion";
export default function LinkThumbnail({ link }) {
  if (!link) return null;

  return (
    <div className="flex items-center gap-3 p-3 bg-white/10 rounded-2xl">
      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center overflow-hidden">
        {link.icon ? (
          <img
            src={link.icon}
            alt={link.name}
            className="w-7 h-7 object-contain"
          />
        ) : (
          <div className="w-7 h-7 bg-gray-500 rounded" />
        )}
      </div>
      <span className="text-sm font-medium truncate max-w-[140px]">
        {link.label || link.name}
      </span>
    </div>
  );
}
