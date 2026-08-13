import { ShopHero } from "@/app/components/sections/shops/ShopHero";
import { TrustRow } from "@/app/components/sections/shops/TrustRow";
import { Catalog } from "@/app/components/sections/shops/Catalog";
import { PopularRow } from "@/app/components/sections/shops/PopularRow";
import { ShopCta } from "@/app/components/sections/shops/ShopCta";

export const metadata = { title: "Shops" };

export default function ShopsPage() {
  return (
    <>
      <ShopHero />
      <TrustRow />
      <Catalog />
      <PopularRow />
      <ShopCta />
    </>
  );
}
