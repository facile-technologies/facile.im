"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "@/app/components/ui/Container";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { cn } from "@/app/lib/cn";

type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Real questions are placeholders in Figma (repeated "What is AirCover?" with
 * Airbnb copy), so these are written for the Facile NFC smart-card product.
 */
const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How does NFC technology work?",
    answer:
      "Your Facile card has a tiny NFC chip embedded inside it. When someone holds their phone near the card, the chip wakes up and instantly opens your digital profile in their browser — no app, no pairing, and no battery required.",
  },
  {
    question: "Will it work with my phone?",
    answer:
      "Yes. Every iPhone from the iPhone 7 onward and virtually all modern Android phones have NFC built in and enabled by default. On most phones you simply tap the card to the top-back of the device to trigger the link.",
  },
  {
    question: "What if someone's phone doesn't support tapping?",
    answer:
      "Every Facile card also includes a unique QR code on the back. If a phone can't tap — or NFC is switched off — the other person can just open their camera and scan the code to reach the exact same profile.",
  },
  {
    question: "Can I update my profile after I receive the card?",
    answer:
      "Absolutely. Your card points to a profile you control from your dashboard. Change your links, contact details, socials, or photo any time and the card always shows your latest information — no reprinting needed.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Cards are printed and dispatched within 2–3 business days. Standard delivery typically arrives in 5–7 business days, and you'll get tracking by email the moment your order ships.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. The NFC chip only stores a link to your profile, never your personal data. You decide exactly which details are public, and you can pause or update your profile at any moment from your account.",
  },
];

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqRow({ item, isOpen, onToggle }: { item: FaqItem; isOpen: boolean; onToggle: () => void }) {
  const reduceMotion = useReducedMotion();
  const id = useId();
  const panelId = `${id}-panel`;
  const buttonId = `${id}-button`;

  return (
    <div className="border-b border-panel-border">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            "flex min-h-14 w-full items-center gap-4 py-5 text-left",
            "text-lg sm:text-xl",
            "transition-colors hover:opacity-80",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-panel-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-panel rounded-sm"
          )}
        >
          <span className="flex-1">{item.question}</span>
          <ChevronIcon
            className={cn(
              "size-4 shrink-0 transition-transform duration-300 text-panel-muted",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </h3>

      {reduceMotion ? (
        isOpen ? (
          <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-6 pr-8">
            <p className="text-base leading-relaxed text-panel-muted">{item.answer}</p>
          </div>
        ) : null
      ) : (
        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="pb-6 pr-8 text-base leading-relaxed text-panel-muted">
                {item.answer}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-panel text-panel-foreground py-24 sm:py-32">
      <Container size="lg">
        <div className="grid gap-12 lg:grid-cols-[minmax(260px,1fr)_minmax(0,1.4fr)] lg:gap-20">
          <div className="lg:pt-2">
            <SectionHeading
              align="left"
              title="Your questions, answered"
              className="font-display"
            />
            <p className="mt-6 text-base text-panel-muted sm:text-lg">
              Can&apos;t find what you&apos;re looking for? Visit our{" "}
              <a
                href="#help"
                className="font-medium text-panel-foreground underline decoration-from-font underline-offset-2 transition-opacity hover:opacity-70"
              >
                Help Center
              </a>
              .
            </p>
          </div>

          <div className="border-t border-panel-border">
            {FAQ_ITEMS.map((item, index) => (
              <FaqRow
                key={item.question}
                item={item}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex((prev) => (prev === index ? null : index))}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
