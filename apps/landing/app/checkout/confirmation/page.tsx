import { Container } from "@/app/components/ui/Container";
import { Confirmation } from "@/app/components/sections/checkout/Confirmation";

export const metadata = { title: "Order Confirmed · Checkout" };

export default function CheckoutConfirmationPage() {
  return (
    <section className="flex min-h-[70vh] items-center py-28 sm:py-32">
      <Container size="md">
        <Confirmation />
      </Container>
    </section>
  );
}
