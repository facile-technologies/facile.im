import { ProductFeature } from "./ProductFeature";

/** Metal Cards feature section (light) — per Figma. */
export function MetalCards() {
  return (
    <ProductFeature
      theme="light"
      eyebrow="Sleek, minimalist designs that make a lasting impression"
      title="Metal Cards"
      subtitle="Your Premium Identity"
      price="$49"
      href="/checkout?product=metal"
      image={{
        src: "/images/phone-card.png",
        alt: "Brushed metal Facile NFC card on the back of a phone",
      }}
    />
  );
}
