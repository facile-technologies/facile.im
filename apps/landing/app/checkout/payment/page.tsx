import { CheckoutShell } from "@/app/components/sections/checkout/CheckoutShell";
import { PaymentForm } from "@/app/components/sections/checkout/PaymentForm";

export const metadata = { title: "Payment · Checkout" };

export default function CheckoutPaymentPage() {
  return (
    <CheckoutShell current="payment">
      <PaymentForm />
    </CheckoutShell>
  );
}
