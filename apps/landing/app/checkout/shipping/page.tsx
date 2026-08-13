import { CheckoutShell } from "@/app/components/sections/checkout/CheckoutShell";
import { ShippingForm } from "@/app/components/sections/checkout/ShippingForm";

export const metadata = { title: "Shipping · Checkout" };

export default function CheckoutShippingPage() {
  return (
    <CheckoutShell current="shipping" size="md">
      <ShippingForm />
    </CheckoutShell>
  );
}
