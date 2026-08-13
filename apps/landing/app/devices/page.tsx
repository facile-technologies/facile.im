import { DevicesHero } from "@/app/components/sections/devices/DevicesHero";
import { MetalCards } from "@/app/components/sections/devices/MetalCards";
import { BusinessCards } from "@/app/components/sections/devices/BusinessCards";
import { ProductShowcase } from "@/app/components/sections/devices/ProductShowcase";
import { HowItWorks } from "@/app/components/sections/devices/HowItWorks";
import { ComparePlans } from "@/app/components/sections/devices/ComparePlans";
import { Testimonials } from "@/app/components/sections/devices/Testimonials";
import { FAQ } from "@/app/components/sections/devices/FAQ";
import { CTA } from "@/app/components/sections/devices/CTA";

export const metadata = { title: "Devices" };

export default function DevicesPage() {
  return (
    <>
      <DevicesHero />
      <MetalCards />
      <BusinessCards />
      <ProductShowcase />
      <HowItWorks />
      <ComparePlans />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
