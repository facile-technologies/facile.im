export type ProductCategory = "nfc" | "metal" | "bands" | "bundles";

export type Product = {
  /** Maps to a CATALOG id in checkout-data.ts for the cart. */
  id: string;
  name: string;
  tagline: string;
  price: string;
  features: string[];
  category: ProductCategory;
  image: { src: string; alt: string };
  /** Short material/finish label shown as a chip on the card. */
  material: string;
  /** Lifts one product into the featured hero tile of the grid. */
  featured?: boolean;
  /** A short marketing badge ("Best seller", "New"). Optional. */
  badge?: string;
  /**
   * Some renders are shot on pure black; on the light panel they read best
   * inside a matching dark inset rather than the default light frame.
   */
  darkShot?: boolean;
};

export type CategoryTab = {
  id: "all" | ProductCategory;
  label: string;
  thumb: string;
};

export const categoryTabs: CategoryTab[] = [
  { id: "all", label: "All Products", thumb: "/products/tab-all.png" },
  { id: "nfc", label: "NFC Cards", thumb: "/products/tab-nfc.png" },
  { id: "metal", label: "Metal Cards", thumb: "/products/tab-metal.png" },
  { id: "bands", label: "Smart Bands", thumb: "/products/tab-bands.png" },
  { id: "bundles", label: "Bundles", thumb: "/products/tab-all.png" },
];

export const categoryInfo: Record<
  CategoryTab["id"],
  { title: string; description: string }
> = {
  all: {
    title: "The full lineup",
    description:
      "Every card, band, and bundle Facile makes — tap-ready out of the box.",
  },
  nfc: {
    title: "NFC cards",
    description:
      "Matte and recycled finishes that share your whole profile in one tap.",
  },
  metal: {
    title: "Metal cards",
    description:
      "Brushed and blacked-out metal, laser-engraved to last a career.",
  },
  bands: {
    title: "Smart bands",
    description:
      "Wear your profile. Built for conferences, gyms, and the show floor.",
  },
  bundles: {
    title: "Bundles",
    description: "Mix finishes, save more — made for teams, gifts, and growth.",
  },
};

export const products: Product[] = [
  {
    id: "metal",
    name: "Metal Card",
    tagline: "Brushed metal that lands with weight.",
    price: "From $49",
    category: "metal",
    material: "Brushed aluminum",
    featured: true,
    badge: "Best seller",
    features: [
      "Aerospace-grade brushed aluminum",
      "Laser-engraved QR, never fades",
      "Unlimited profile edits, forever",
    ],
    image: { src: "/images/card.png", alt: "Brushed metal Facile NFC card, front and back" },
  },
  {
    id: "standard",
    name: "Standard Card",
    tagline: "Matte PVC. One tap. Done.",
    price: "From $29",
    category: "nfc",
    material: "Matte PVC",
    features: [
      "Embedded NFC — works on any phone",
      "Laser QR backup on the reverse",
      "Free digital profile included",
    ],
    image: { src: "/images/card-2.png", alt: "Matte PVC Facile NFC card, front and back" },
  },
  {
    id: "eco",
    name: "Eco Card",
    tagline: "Recycled stock, identical tap.",
    price: "From $34",
    category: "nfc",
    material: "100% recycled",
    features: [
      "100% recycled, soft-touch PVC",
      "Same embedded NFC chip",
      "Carbon-neutral shipping",
    ],
    image: { src: "/images/business-plate.png", alt: "Recycled Facile NFC card on a desk stand" },
  },
  {
    id: "black-metal",
    name: "Black Metal Card",
    tagline: "Matte black. Quietly serious.",
    price: "From $59",
    category: "metal",
    material: "PVD black",
    badge: "New",
    features: [
      "PVD black coating, scratch-resistant",
      "Laser-engraved QR fallback",
      "Weighted, with a satin edge",
    ],
    image: { src: "/images/phone-card.png", alt: "Matte black Facile metal card on the back of a phone" },
    darkShot: true,
  },
  {
    id: "band",
    name: "Smart Band",
    tagline: "Your profile, on your wrist.",
    price: "From $39",
    category: "bands",
    material: "Soft silicone",
    features: [
      "All-day silicone comfort fit",
      "Tap-to-share NFC built in",
      "Laser-engraved QR code",
    ],
    image: { src: "/products/band.png", alt: "Black silicone Facile NFC smart band" },
    darkShot: true,
  },
  {
    id: "premium-band",
    name: "Premium Band",
    tagline: "Brushed steel, made to last.",
    price: "From $79",
    category: "bands",
    material: "Brushed steel",
    features: [
      "Brushed-steel link bracelet",
      "Weighted and weatherproof",
      "Laser-engraved QR code",
    ],
    image: { src: "/products/band.png", alt: "Brushed steel Facile NFC smart band" },
    darkShot: true,
  },
  {
    id: "premium-bundle",
    name: "Premium Bundle",
    tagline: "Two cards, every finish.",
    price: "From $79",
    category: "bundles",
    material: "Mix & match",
    features: [
      "Two cards, any finish you like",
      "Matching engraved QR codes",
      "Priority support included",
    ],
    image: { src: "/products/premium-bundle.png", alt: "Premium bundle of two Facile metal cards" },
  },
  {
    id: "team-pack",
    name: "Team Pack",
    tagline: "Five cards. One shared hub.",
    price: "From $129",
    category: "bundles",
    material: "For teams",
    features: [
      "Five cards, branded together",
      "Shared team dashboard",
      "Bulk QR engraving",
    ],
    image: { src: "/products/premium-bundle.png", alt: "Team pack of five Facile cards" },
  },
];
