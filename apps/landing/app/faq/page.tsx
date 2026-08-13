import { FaqHero } from "@/app/components/sections/faq-page/FaqHero";
import { FaqProductStrip } from "@/app/components/sections/faq-page/FaqProductStrip";
import { FaqAccordion } from "@/app/components/sections/faq-page/FaqAccordion";
import { FaqContact } from "@/app/components/sections/faq-page/FaqContact";

export const metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <>
      <FaqHero />
      <FaqProductStrip />
      <FaqAccordion />
      <FaqContact />
    </>
  );
}
