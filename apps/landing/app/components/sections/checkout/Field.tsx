"use client";

import type { InputHTMLAttributes, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/app/lib/cn";

const labelCls =
  "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground";

const inputCls =
  "h-11 w-full rounded-xl border bg-foreground/5 px-4 text-sm text-foreground placeholder:text-muted/70 transition-[border-color,box-shadow,background-color] duration-200 focus:bg-foreground/[0.07] focus:outline-none";

/**
 * Inline loading spinner for pending submit buttons. The spin is suppressed for
 * users who prefer reduced motion (the icon still reads as a pending affordance).
 */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 animate-spin motion-reduce:animate-none", className)}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path
        d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Labelled text input matching the checkout form frames. */
export function Field({
  label,
  id,
  className,
  error,
  valid,
  ...props
}: {
  label: string;
  className?: string;
  error?: string;
  /** Show a success affordance once the field passes validation. */
  valid?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            inputCls,
            valid && !error ? "pr-10" : null,
            error
              ? "border-red-500/70 focus:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/25"
              : "border-border focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/25"
          )}
          {...props}
        />
        <AnimatePresence>
          {valid && !error ? (
            <motion.span
              key="valid"
              initial={reduce ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500"
              aria-hidden="true"
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6.5L4.75 8.75L9.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
      <AnimatePresence initial={false}>
        {error ? (
          <motion.span
            key="error"
            id={`${id}-error`}
            role="alert"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden text-xs text-red-500"
          >
            {error}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** Labelled select for fields like Country. */
export function SelectField({
  label,
  id,
  className,
  children,
  value,
  defaultValue,
  onChange,
}: {
  label: string;
  id: string;
  className?: string;
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={cn(
          inputCls,
          "appearance-none border-border bg-no-repeat focus:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/25"
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%238a8a8a' stroke-width='1.3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          backgroundPosition: "right 1rem center",
        }}
      >
        {children}
      </select>
    </div>
  );
}
