import { Hero } from "./components/sections/Hero";
import { MarqueeStrip } from "./components/sections/MarqueeStrip";
import { Bento } from "./components/sections/Bento";
import { HowItWorks } from "./components/sections/HowItWorks";
import { Pricing } from "./components/sections/Pricing";
import { Testimonials } from "./components/sections/Testimonials";
import { FAQ } from "./components/sections/FAQ";
import { FinalCTA } from "./components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeStrip />
      <Bento />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}
