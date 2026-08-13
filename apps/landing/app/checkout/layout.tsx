import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartProvider } from "@/app/components/cart/CartContext";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
