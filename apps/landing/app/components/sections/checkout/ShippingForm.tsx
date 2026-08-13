"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Reveal } from "@/app/components/motion/Reveal";
import { cn } from "@/app/lib/cn";
import { useCart, type ShippingDetails } from "@/app/components/cart/CartContext";
import { Field, SelectField, Spinner } from "./Field";
import { SHIPPING_METHODS, formatPrice } from "./checkout-data";

type Errors = Partial<Record<keyof ShippingDetails, string>>;

const REQUIRED: (keyof ShippingDetails)[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "address1",
  "city",
  "state",
  "zip",
];

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/**
 * Shipping information form (Figma 131:2402). Fields are bound to the cart
 * context so entries persist across Back/Continue; required fields are
 * validated before advancing to payment. Submit shows a brief pending state.
 */
export function ShippingForm() {
  const router = useRouter();
  const { shipping, updateShipping, shippingMethod, setShippingMethod } = useCart();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: Errors = {};
    for (const key of REQUIRED) {
      if (!shipping[key]?.trim()) next[key] = "Required";
    }
    if (shipping.email && !isEmail(shipping.email)) {
      next.email = "Enter a valid email";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) {
      // Bring the first invalid field into view.
      document
        .querySelector('[aria-invalid="true"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    // Brief perceptible transition before routing — feels considered, not instant.
    setTimeout(() => router.push("/checkout/payment"), 450);
  };

  // A field is "valid" once it has a non-empty (and, for email, well-formed)
  // value and no active error.
  const isValid = (key: keyof ShippingDetails) => {
    const v = shipping[key]?.trim();
    if (!v || errors[key]) return false;
    if (key === "email") return isEmail(shipping.email);
    return true;
  };

  const bind = (key: keyof ShippingDetails) => ({
    value: shipping[key],
    error: errors[key],
    valid: isValid(key),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      updateShipping({ [key]: e.target.value });
      if (errors[key]) setErrors((x) => ({ ...x, [key]: undefined }));
    },
  });

  return (
    <Reveal className="mx-auto flex max-w-2xl flex-col gap-7">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Where should we send it?
        </h1>
        <p className="text-sm text-muted-foreground">
          Your card ships free and arrives ready to tap. We&apos;ll email tracking
          the moment it leaves.
        </p>
      </header>

      <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="first-name" label="First Name" placeholder="Alex" autoComplete="given-name" {...bind("firstName")} />
          <Field id="last-name" label="Last Name" placeholder="Morgan" autoComplete="family-name" {...bind("lastName")} />
        </div>

        <Field id="email" label="Email Address" type="email" placeholder="alex@example.com" autoComplete="email" {...bind("email")} />
        <Field id="phone" label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" autoComplete="tel" {...bind("phone")} />
        <Field id="address1" label="Address Line 1" placeholder="123 Main Street" autoComplete="address-line1" {...bind("address1")} />
        <Field id="address2" label="Address Line 2 (Optional)" placeholder="Apt, Suite, Unit…" autoComplete="address-line2" {...bind("address2")} />

        <div className="grid gap-5 sm:grid-cols-[1fr_120px_140px]">
          <Field id="city" label="City" placeholder="New York" autoComplete="address-level2" {...bind("city")} />
          <Field id="state" label="State" placeholder="NY" autoComplete="address-level1" {...bind("state")} />
          <Field id="zip" label="ZIP" placeholder="10001" autoComplete="postal-code" {...bind("zip")} />
        </div>

        <SelectField
          id="country"
          label="Country"
          value={shipping.country}
          onChange={(e) => updateShipping({ country: e.target.value })}
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
        </SelectField>

        <fieldset className="flex flex-col gap-3">
          <legend className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Shipping Method
          </legend>
          {SHIPPING_METHODS.map((m) => {
            const selected = shippingMethod === m.id;
            return (
              <label
                key={m.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-200",
                  selected
                    ? "border-[var(--accent)] bg-[var(--accent)]/[0.06] shadow-[0_0_0_3px_rgba(79,124,255,0.1)]"
                    : "border-border hover:border-border-strong hover:bg-foreground/[0.03]"
                )}
              >
                <input
                  type="radio"
                  name="shipping-method"
                  value={m.id}
                  checked={selected}
                  onChange={() => setShippingMethod(m.id)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border transition-colors",
                    selected ? "border-[var(--accent)]" : "border-border-strong"
                  )}
                  aria-hidden="true"
                >
                  {selected ? <span className="h-2 w-2 rounded-full bg-[var(--accent)]" /> : null}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{m.title}</span>
                  <span className="block text-xs text-muted-foreground">{m.detail}</span>
                </span>
                <span className="text-sm font-medium tabular-nums">{formatPrice(m.price)}</span>
              </label>
            );
          })}
        </fieldset>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="mt-2 w-full"
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? (
            <>
              <Spinner /> Saving your details…
            </>
          ) : (
            "Continue to payment"
          )}
        </Button>
      </form>

      <Button href="/checkout" variant="ghost" size="sm" className="mx-auto">
        ‹ Back to cart
      </Button>
    </Reveal>
  );
}
