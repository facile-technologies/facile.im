"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CATALOG,
  DEFAULT_PRODUCT_ID,
  getProduct,
  PROMOS,
  SHIPPING_METHODS,
  type CatalogProduct,
  type ShippingMethodId,
} from "@/app/components/sections/checkout/checkout-data";

export type ShippingDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type PaymentMethodId = "card" | "apple" | "paypal";

export type PaymentDetails = {
  method: PaymentMethodId;
  cardholder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

type CartState = {
  productId: string;
  qty: number;
  promo: string;
  shippingMethod: ShippingMethodId;
  shipping: ShippingDetails;
  payment: PaymentDetails;
};

const emptyShipping: ShippingDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

const emptyPayment: PaymentDetails = {
  method: "card",
  cardholder: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

const initial: CartState = {
  productId: DEFAULT_PRODUCT_ID,
  qty: 1,
  promo: "",
  shippingMethod: "standard",
  shipping: emptyShipping,
  payment: emptyPayment,
};

const STORAGE_KEY = "facile-cart";

type Totals = {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
};

type CartContextValue = {
  hydrated: boolean;
  product: CatalogProduct;
  qty: number;
  promo: string;
  shippingMethod: ShippingMethodId;
  shipping: ShippingDetails;
  payment: PaymentDetails;
  totals: Totals;
  setProduct: (id: string, qty?: number) => void;
  setQty: (qty: number) => void;
  applyPromo: (code: string) => { ok: boolean };
  setShippingMethod: (id: ShippingMethodId) => void;
  updateShipping: (patch: Partial<ShippingDetails>) => void;
  updatePayment: (patch: Partial<PaymentDetails>) => void;
  reset: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>(initial);
  const [hydrated, setHydrated] = useState(false);

  // Load any persisted cart once on mount (client only) to avoid SSR mismatch.
  // Intentional hydration sync from an external store (localStorage) — same
  // pattern as ThemeToggle's mount guard.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState((s) => ({ ...s, ...(JSON.parse(raw) as Partial<CartState>) }));
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const setProduct = useCallback(
    (id: string, qty = 1) =>
      setState((s) => ({
        ...s,
        productId: CATALOG[id] ? id : s.productId,
        qty: Math.max(1, qty),
      })),
    []
  );

  const setQty = useCallback(
    (qty: number) => setState((s) => ({ ...s, qty: Math.max(1, qty) })),
    []
  );

  const applyPromo = useCallback((code: string) => {
    const key = code.trim().toUpperCase();
    if (PROMOS[key]) {
      setState((s) => ({ ...s, promo: key }));
      return { ok: true };
    }
    setState((s) => ({ ...s, promo: "" }));
    return { ok: false };
  }, []);

  const setShippingMethod = useCallback(
    (id: ShippingMethodId) => setState((s) => ({ ...s, shippingMethod: id })),
    []
  );

  const updateShipping = useCallback(
    (patch: Partial<ShippingDetails>) =>
      setState((s) => ({ ...s, shipping: { ...s.shipping, ...patch } })),
    []
  );

  const updatePayment = useCallback(
    (patch: Partial<PaymentDetails>) =>
      setState((s) => ({ ...s, payment: { ...s.payment, ...patch } })),
    []
  );

  const reset = useCallback(() => setState(initial), []);

  const product = getProduct(state.productId);

  const totals = useMemo<Totals>(() => {
    const subtotal = product.price * state.qty;
    const discount =
      state.promo && PROMOS[state.promo] ? subtotal * PROMOS[state.promo] : 0;
    const shipping =
      SHIPPING_METHODS.find((m) => m.id === state.shippingMethod)?.price ?? 0;
    const total = Math.max(0, subtotal - discount) + shipping;
    return { subtotal, discount, shipping, total };
  }, [product.price, state.qty, state.promo, state.shippingMethod]);

  const value: CartContextValue = {
    hydrated,
    product,
    qty: state.qty,
    promo: state.promo,
    shippingMethod: state.shippingMethod,
    shipping: state.shipping,
    payment: state.payment,
    totals,
    setProduct,
    setQty,
    applyPromo,
    setShippingMethod,
    updateShipping,
    updatePayment,
    reset,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
