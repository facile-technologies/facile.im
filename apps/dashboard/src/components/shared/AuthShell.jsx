import { ArrowLeft } from "lucide-react";
import { useLocation } from "react-router-dom";
import AuthThemeToggle from "./AuthThemeToggle";
import Wordmark from "./Wordmark";
import AuthShowcase from "./AuthShowcase";

// Landing site origin. Prod serves it same-domain at `/`; dev overrides via env.
const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? "/";

/**
 * Shared two-column shell for the auth surface (Login / Sign up / Forgot / OTP).
 * Left: theme-aware form column with the brand wordmark + theme toggle, a back
 * button (→ landing) and, on signup, the chosen-plan badge, then the animated
 * form (`children`). Right: the dark premium <AuthShowcase/> (hidden below `lg`).
 */
export default function AuthShell({ children, showBack = true }) {
  const location = useLocation();
  const isSignup = location.pathname.includes("signup");
  const selectedPlan = localStorage.getItem("selectedPlan") || "facile Basic";

  return (
    // Theme via explicit dark: variants (the dashboard toggles the `.dark`
    // class; the shared preset's auto light tokens need a `.light` class it
    // doesn't set, so we drive light/dark here directly).
    <div className="flex w-full min-h-screen bg-white text-neutral-900 dark:bg-[#0b0b0b] dark:text-neutral-100">
      {/* Form column */}
      <div className="flex w-full flex-col px-6 py-8 sm:px-10 md:px-16 md:py-10 lg:w-1/2 lg:px-20">
        <header className="flex items-center justify-between">
          <Wordmark />
          <AuthThemeToggle />
        </header>

        <main className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          {(showBack || isSignup) && (
            <div className="mb-7 flex items-center gap-3">
              {showBack && (
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = LANDING_URL;
                  }}
                  aria-label="Back to home"
                  className="auth-iconbtn inline-flex size-9 items-center justify-center rounded-full border border-black/10 text-neutral-700 dark:border-white/15 dark:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              {isSignup && (
                <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-3 py-1.5 text-xs font-medium dark:border-white/10 dark:bg-white/[0.04]">
                  Your chosen plan:&nbsp;
                  <span className="font-semibold text-accent">{selectedPlan}</span>
                </span>
              )}
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Showcase column */}
      <AuthShowcase />
    </div>
  );
}
