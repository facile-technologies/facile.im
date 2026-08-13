import { CheckoutShell } from "@/app/components/sections/checkout/CheckoutShell";
import { CartReview } from "@/app/components/sections/checkout/CartReview";

export const metadata = { title: "Cart · Checkout" };

export default function CheckoutCartPage() {
  return (
    <CheckoutShell current="cart">
      <CartReview />
    </CheckoutShell>
  );
}
