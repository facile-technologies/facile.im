"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "@/app/components/ui/Container";
import { CategoryTabs } from "@/app/components/ui/CategoryTabs";
import { cn } from "@/app/lib/cn";
import { Stagger, StaggerItem } from "@/app/components/motion/Stagger";
import { ProductCard } from "./ProductCard";
import {
  categoryInfo,
  categoryTabs,
  products,
  type CategoryTab,
} from "./products-data";

/**
 * Interactive products browser: a dark category filter strip + info bar, then a
 * light-panel grid of premium product tiles. The featured product opens the
 * grid as a wide tile. Filtering animates the count and re-staggers the grid.
 */
export function ProductGrid() {
  const [active, setActive] = useState<CategoryTab["id"]>("all");
  const reduce = useReducedMotion();
  const searchParams = useSearchParams();
  const catParam = searchParams.get("cat");

  // Preselect a category when arriving from the navbar mega-menu (/products?cat=).
  useEffect(() => {
    const match = categoryTabs.find((t) => t.id === catParam);
    setActive(match ? match.id : "all");
  }, [catParam]);

  const visible = useMemo(() => {
    const list =
      active === "all"
        ? products
        : products.filter((p) => p.category === active);
    // Featured tile always opens the grid.
    return [...list].sort(
      (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
    );
  }, [active]);

  const info = categoryInfo[active];

  return (
    <>
      {/* Category filter strip — airy Apple-style sub-nav, sticky under navbar */}
      <section
        id="collection"
        className="sticky top-16 z-30 scroll-mt-20 border-b border-white/[0.07] bg-background/90 text-foreground backdrop-blur-xl"
      >
        <Container size="xl">
          <CategoryTabs
            ariaLabel="Product categories"
            className="py-5 sm:py-6"
            activeId={active}
            onSelect={(id) => setActive(id as CategoryTab["id"])}
            items={categoryTabs.map((t) => ({
              id: t.id,
              label: t.label,
              thumb: t.thumb,
              contain: t.id === "bands",
            }))}
          />
        </Container>
      </section>

      {/* Product grid — light panel */}
      <section className="bg-panel text-panel-foreground">
        <Container size="xl" className="py-14 sm:py-20 lg:py-24">
          {/* Quiet single-line info: category title + count */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="mb-10 flex items-baseline justify-between gap-4 sm:mb-14"
            >
              <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {info.title}
              </h2>
              <p className="shrink-0 text-[13px] tabular-nums text-panel-muted">
                {visible.length} {visible.length === 1 ? "product" : "products"}
              </p>
            </motion.div>
          </AnimatePresence>

          <Stagger
            key={active}
            className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4"
          >
            {visible.map((product) => (
              <StaggerItem
                key={product.id}
                className={cn(
                  "h-full",
                  product.featured &&
                    "sm:col-span-2 lg:col-span-2 lg:row-span-2"
                )}
              >
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
