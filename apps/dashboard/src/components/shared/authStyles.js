/**
 * Shared class strings for the auth pages so Login / Sign up / Forgot / OTP look
 * identical. Theme is driven by explicit `dark:` variants (the dashboard toggles
 * the `.dark` class; the shared preset's auto light tokens need a `.light` class
 * it doesn't set). `accent` is theme-independent (#4f7cff) so it's safe to use.
 */
export const authInputClass =
  "w-full h-12 rounded-xl border border-black/10 bg-black/[0.03] text-neutral-900 placeholder:text-neutral-400 px-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100 dark:placeholder:text-neutral-500";

/** Single OTP box. */
export const authOtpClass =
  "w-11 h-12 text-center text-[18px] rounded-xl border border-black/10 bg-black/[0.03] text-neutral-900 focus:outline-none focus:ring-2 focus:ring-accent transition-all dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-100";

/** Primary pill CTA — rainbow-hairline button that contrasts with the theme
    (black on light, white on dark). */
export const authBtnClass =
  "btn-auth h-[52px] w-full rounded-full text-[16px] font-medium tracking-[0.01em] active:scale-[0.99] disabled:opacity-60";

/** Password show/hide toggle. A <span> (so the global button rule doesn't hit
    it), vertically centered inside its `relative` input wrapper. */
export const authEyeClass =
  "absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors dark:text-neutral-500 dark:hover:text-neutral-300";

export const authHeadingClass =
  "font-display text-[30px] md:text-[34px] font-semibold tracking-tight leading-tight";

export const authMutedClass = "text-sm text-neutral-500 dark:text-neutral-400";

export const authLinkClass = "font-medium text-accent hover:underline";
