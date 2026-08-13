import { ProductFeature } from "./ProductFeature";

/** Business Cards feature section (dark) — per Figma. */
export function BusinessCards() {
  return (
    <ProductFeature
      theme="dark"
      eyebrow="Sleek, minimalist designs that make a lasting impression"
      title="Business Cards"
      subtitle="Your Business Identity"
      price="$49"
      href="/checkout?product=business"
      image={{
        src: "/devices/business-cards.png",
        alt: "Facile branded business NFC plate on a desk stand",
      }}
    />
  );
}
