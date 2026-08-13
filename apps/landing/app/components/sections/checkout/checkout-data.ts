/**
 * Checkout catalog + config. DESIGNED UI ONLY — no real payment or backend.
 * Product entry points link to `/checkout?product=<id>`; the cart context
 * (app/components/cart/CartContext.tsx) looks the id up here to build the order.
 */

export type CatalogProduct = {
  id: string;
  name: string;
  variant: string;
  price: number;
  /** Product photo in /public/images, with descriptive alt text. */
  image: string;
  alt: string;
};

// Available product photography (square, 2500×2500) lives in /public/images.
const IMG = {
  card: "/images/card.png",
  card2: "/images/card-2.png",
  plate: "/images/business-plate.png",
  band: "/images/band.png",
  phone: "/images/phone-card.png",
} as const;

export const CATALOG: Record<string, CatalogProduct> = {
  standard: { id: "standard", name: "Facile Standard Card", variant: "Matte Black — Single", price: 29, image: IMG.card, alt: "Facile matte black NFC smart card" },
  eco: { id: "eco", name: "Facile Eco Card", variant: "Recycled PVC", price: 34, image: IMG.card2, alt: "Facile eco card in recycled PVC" },
  white: { id: "white", name: "Facile White Card", variant: "Matte White", price: 29, image: IMG.card2, alt: "Facile matte white NFC smart card" },
  metal: { id: "metal", name: "Facile Metal Card", variant: "Brushed Steel", price: 49, image: IMG.plate, alt: "Facile brushed-steel metal smart card" },
  business: { id: "business", name: "Facile Business Card", variant: "Premium Metal", price: 49, image: IMG.plate, alt: "Facile premium metal business card" },
  phone: { id: "phone", name: "Facile Phone Card", variant: "Stick-on NFC", price: 39, image: IMG.phone, alt: "Facile stick-on NFC phone card" },
  "black-metal": { id: "black-metal", name: "Black Metal Card", variant: "PVD Black", price: 59, image: IMG.plate, alt: "Facile PVD black metal smart card" },
  band: { id: "band", name: "Smart Band", variant: "Silicone — Black", price: 39, image: IMG.band, alt: "Facile black silicone NFC smart band" },
  "premium-band": { id: "premium-band", name: "Premium Band", variant: "Brushed Steel", price: 79, image: IMG.band, alt: "Facile brushed-steel premium smart band" },
  sticker: { id: "sticker", name: "NFC Sticker (5-pack)", variant: "Tap anywhere", price: 14, image: IMG.phone, alt: "Facile tap-anywhere NFC stickers" },
  "standard-bundle": { id: "standard-bundle", name: "Standard Bundle", variant: "Card + accessories", price: 69, image: IMG.card, alt: "Facile standard bundle: card plus accessories" },
  "premium-bundle": { id: "premium-bundle", name: "Premium Bundle", variant: "Two cards", price: 79, image: IMG.card2, alt: "Facile premium bundle of two smart cards" },
  "metal-bundle": { id: "metal-bundle", name: "Metal Bundle", variant: "Premium, bundled", price: 89, image: IMG.plate, alt: "Facile metal bundle of premium cards" },
  "team-pack": { id: "team-pack", name: "Team Pack", variant: "Five cards", price: 129, image: IMG.card, alt: "Facile team pack of five smart cards" },
  gift: { id: "gift", name: "Gift Card", variant: "They choose", price: 29, image: IMG.card2, alt: "Facile digital gift card" },
};

export const DEFAULT_PRODUCT_ID = "standard";

export const getProduct = (id?: string | null): CatalogProduct =>
  (id && CATALOG[id]) || CATALOG[DEFAULT_PRODUCT_ID];

export type ShippingMethodId = "standard" | "express";

export const SHIPPING_METHODS: {
  id: ShippingMethodId;
  title: string;
  detail: string;
  price: number;
}[] = [
  { id: "standard", title: "Standard Shipping", detail: "5–7 business days", price: 0 },
  { id: "express", title: "Express Shipping", detail: "2–3 business days", price: 9.99 },
];

/** Mock promo codes → discount fraction. */
export const PROMOS: Record<string, number> = {
  FACILE10: 0.1,
  WELCOME15: 0.15,
};

export const ORDER_NUMBER = "#FCL-00421";

export const formatPrice = (value: number) =>
  value === 0 ? "Free" : `$${value.toFixed(2)}`;

export type Step = "cart" | "shipping" | "payment";

export const steps: { id: Step; label: string }[] = [
  { id: "cart", label: "Cart" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
];
