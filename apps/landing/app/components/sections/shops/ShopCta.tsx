import { Container } from "@/app/components/ui/Container";
import { Button } from "@/app/components/ui/Button";
import { Media } from "@/app/components/ui/Media";
import { Reveal } from "@/app/components/motion/Reveal";
import { Float } from "@/app/components/motion/Float";

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/** Dark closing CTA for /shops — redirect to the official Shopify store. */
export function ShopCta() {
  return (
    <section className="bg-background pb-24 pt-4 text-foreground sm:pb-28">
      <Container size="xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] border border-border-strong bg-card">
            {/* ambient glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-accent/15 blur-[140px]"
            />
            <div className="relative grid items-center gap-10 p-9 sm:p-14 lg:grid-cols-[1.1fr_0.9fr] lg:p-16">
              <div className="max-w-xl">
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Checkout on Shopify
                </span>
                <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl">
                  Ready when{" "}
                  <span className="text-gradient">you are.</span>
                </h2>
                <p className="mt-5 max-w-md text-balance text-[16px] leading-relaxed text-muted-foreground">
                  Head to our official store for secure checkout, fast shipping,
                  and live order tracking. Your profile is ready the moment your
                  card arrives.
                </p>
                <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <Button
                    href="https://shop.facile.me"
                    variant="primary"
                    size="lg"
                  >
                    Go to the Facile Store
                    <ArrowIcon />
                  </Button>
                  <span className="text-[13px] text-muted">
                    shop.facile.me · Secured by Shopify
                  </span>
                </div>
              </div>

              <Float amount={12} duration={7} className="hidden lg:block">
                <Media
                  src="/cards/hero-card.png"
                  alt="Facile Metal card, ready to order"
                  width={760}
                  height={760}
                  sizes="(max-width: 1024px) 0px, 420px"
                  className="mx-auto h-auto w-full max-w-[420px] object-contain drop-shadow-[0_36px_70px_rgba(0,0,0,0.6)]"
                />
              </Float>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
