"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "@/app/components/ui/Container";
import { CategoryTabs } from "@/app/components/ui/CategoryTabs";
import { cn } from "@/app/lib/cn";
import { FAQ_CATEGORIES, type FaqItem } from "./faq-data";

/** Minimal line icon per FAQ topic, drawn at 18px on currentColor. */
function I({ children }: { children: ReactNode }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const TOPIC_ICONS: Record<string, ReactNode> = {
  "getting-started": (
    <I>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    </I>
  ),
  "nfc-cards": (
    <I>
      <path d="M5 12.55a11 11 0 0 1 14 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </I>
  ),
  "profile-links": (
    <I>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </I>
  ),
  shipping: (
    <I>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </I>
  ),
  billing: (
    <I>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </I>
  ),
  technical: (
    <I>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </I>
  ),
};

/** Plus/minus toggle in a circular badge that morphs plus -> minus when open. */
function ToggleIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
        isOpen
          ? "bg-panel-foreground text-panel"
          : "bg-panel-foreground/[0.05] text-panel-foreground/70 group-hover:bg-panel-foreground/[0.09]"
      )}
    >
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-4">
        {/* horizontal bar (always shown) */}
        <path
          d="M3 8H13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* vertical bar rotates/fades out to morph plus -> minus */}
        <path
          d="M8 3V13"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={cn(
            "origin-center transition-all duration-300",
            isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
          )}
        />
      </svg>
    </span>
  );
}

function AccordionRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const id = useId();
  const panelId = `${id}-panel`;
  const buttonId = `${id}-button`;

  const panelBody = (
    <div className="px-6 pb-6 sm:px-7">
      <p className="max-w-2xl text-pretty text-[15px] leading-relaxed text-panel-muted">
        {item.answer}
      </p>
    </div>
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border transition-colors duration-300",
        isOpen
          ? "border-panel-foreground/15 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.07)]"
          : "border-panel-border bg-white/60 hover:border-panel-foreground/12 hover:bg-white"
      )}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            "group flex min-h-16 w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-7",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-panel-foreground/30 focus-visible:ring-inset rounded-2xl"
          )}
        >
          <span
            className={cn(
              "text-[15px] font-semibold tracking-tight transition-colors sm:text-base",
              isOpen ? "text-panel-foreground" : "text-panel-foreground/85"
            )}
          >
            {item.question}
          </span>
          <ToggleIcon isOpen={isOpen} />
        </button>
      </h3>

      {reduceMotion ? (
        isOpen ? (
          <div id={panelId} role="region" aria-labelledby={buttonId}>
            {panelBody}
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
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              {panelBody}
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  );
}

export function FaqAccordion() {
  const [activeCategory, setActiveCategory] = useState(0);
  // Single-open accordion; index is scoped to the active category.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const category = FAQ_CATEGORIES[activeCategory];

  return (
    <section className="bg-panel text-panel-foreground py-20 sm:py-28">
      <Container size="full">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          {/* Left intro + category nav (sticky on desktop) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-panel-muted">
              Browse by topic
            </span>
            <h2 className="font-display mt-4 text-balance text-3xl font-medium leading-[1.05] tracking-tight sm:text-4xl">
              Find your answer fast.
            </h2>
            <p className="mt-4 max-w-sm text-pretty text-[15px] leading-relaxed text-panel-muted">
              Pick a topic to jump straight to the questions that matter. Still
              stuck? Our team is one message away below.
            </p>

            {/* Category nav: icon + name tiles */}
            <CategoryTabs
              ariaLabel="FAQ categories"
              className="mt-8 lg:mt-9"
              orientation="vertical"
              activeId={category.id}
              onSelect={(id) => {
                setActiveCategory(FAQ_CATEGORIES.findIndex((c) => c.id === id));
                setOpenIndex(0);
              }}
              items={FAQ_CATEGORIES.map((cat) => ({
                id: cat.id,
                label: cat.label,
                icon: TOPIC_ICONS[cat.id],
              }))}
            />
          </div>

          {/* Accordion list */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-3"
              >
                {category.items.map((item, index) => (
                  <AccordionRow
                    key={`${category.id}-${item.question}`}
                    item={item}
                    isOpen={openIndex === index}
                    onToggle={() =>
                      setOpenIndex((prev) => (prev === index ? null : index))
                    }
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}
