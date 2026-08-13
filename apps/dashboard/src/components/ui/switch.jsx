import * as React from "react";
import { cn } from "@/lib/utils";

function Switch({ className, checked, onCheckedChange, ...props }) {
  return (
    <a
      href="#"
      className={cn(
        "peer inline-flex h-[22px] w-[38px] items-center rounded-full transition-colors",
        checked ? "bg-black" : "bg-[#6B6B6B]",
        className
      )}
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        e.preventDefault();
        onCheckedChange(!checked);
      }}
      {...props}
    >
      <span
        className={cn(
          "block h-5 w-5 rounded-full bg-[#F5F5F5] transition-transform",
          checked ? "translate-x-[18px]" : "translate-x-0"
        )}
      />
    </a>
  );
}

export { Switch };
