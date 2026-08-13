import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import AuthShell from "./AuthShell";

/**
 * Persistent auth surface. AuthShell (wordmark, theme toggle, dark showcase)
 * stays mounted across /login, /signup, /forgot-password, /verify-otp; only the
 * form (the child route Outlet) crossfades + blurs in on route change. Keeping a
 * single mounted shell is why the showcase carousel never restarts when you
 * switch between forms.
 */
export default function AuthLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();

  const variants = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, filter: "blur(8px)", y: 8 },
        animate: { opacity: 1, filter: "blur(0px)", y: 0 },
        exit: { opacity: 0, filter: "blur(8px)", y: -8 },
      };

  return (
    <AuthShell>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </AuthShell>
  );
}
