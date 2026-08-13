import { PayHero } from "@/app/components/sections/pay/PayHero";
import { PayMarquee } from "@/app/components/sections/pay/PayMarquee";
import { PayOneTap } from "@/app/components/sections/pay/PayOneTap";
import { PayHowItWorks } from "@/app/components/sections/pay/PayHowItWorks";
import { PaySecurity } from "@/app/components/sections/pay/PaySecurity";
import { PayComparison } from "@/app/components/sections/pay/PayComparison";
import { PayPricing } from "@/app/components/sections/pay/PayPricing";
import { PayProof } from "@/app/components/sections/pay/PayProof";
import { PayFinalCTA } from "@/app/components/sections/pay/PayFinalCTA";

export const metadata = { title: "Facile Pay" };

export default function PayPage() {
  return (
    <>
      {/* 1. Hero (dark) */}
      <PayHero />
      {/* thin divider strip */}
      <PayMarquee />
      {/* 2. One-tap story — pay + share (dark) */}
      <PayOneTap />
      {/* 3. How it works (light) */}
      <PayHowItWorks />
      {/* 4a. Security band (dark) → 4b. Comparison table (light) */}
      <PaySecurity />
      <PayComparison />
      {/* 5. Pricing (dark) */}
      <PayPricing />
      {/* 6. Proof — stats + testimonials (dark) */}
      <PayProof />
      {/* 7. Final CTA (dark) */}
      <PayFinalCTA />
    </>
  );
}
