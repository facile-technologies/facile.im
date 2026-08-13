import { FeaturesHero } from "@/app/components/sections/features/FeaturesHero";
import { DigitalProfile } from "@/app/components/sections/features/DigitalProfile";
import { LinkInBio } from "@/app/components/sections/features/LinkInBio";
import { Analytics } from "@/app/components/sections/features/Analytics";
import { Customisation } from "@/app/components/sections/features/Customisation";
import { ShareYourWay } from "@/app/components/sections/features/ShareYourWay";
import { FeaturesCta } from "@/app/components/sections/features/FeaturesCta";

export const metadata = { title: "Features" };

export default function FeaturesPage() {
  return (
    <>
      <FeaturesHero />
      <DigitalProfile />
      <LinkInBio />
      <Analytics />
      <Customisation />
      <ShareYourWay />
      <FeaturesCta />
    </>
  );
}
