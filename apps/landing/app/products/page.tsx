import { Suspense } from "react";
import { ProductsHero } from "@/app/components/sections/products/ProductsHero";
import { ProductGrid } from "@/app/components/sections/products/ProductGrid";

export const metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <Suspense fallback={null}>
        <ProductGrid />
      </Suspense>
    </>
  );
}
