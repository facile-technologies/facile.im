import { Container } from "./Container";
import { Skeleton } from "./Skeleton";

/**
 * Instant loading state shown while a route streams in. Mirrors the common
 * page rhythm: a dark hero band (centered headline + CTAs + media) followed by
 * a light card grid — so the swap to real content feels seamless.
 */
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      {/* Dark hero band */}
      <section className="bg-background pt-24 pb-20">
        <Container size="full" className="flex flex-col items-center gap-6">
          <Skeleton className="h-7 w-40 rounded-full" />
          <div className="flex w-full max-w-3xl flex-col items-center gap-4">
            <Skeleton className="h-12 w-11/12 rounded-2xl sm:h-16" />
            <Skeleton className="h-12 w-3/4 rounded-2xl sm:h-16" />
          </div>
          <Skeleton className="h-5 w-2/3 max-w-md rounded-full" />
          <div className="mt-2 flex gap-3">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
          <Skeleton className="mt-10 h-[320px] w-full max-w-4xl rounded-3xl" />
        </Container>
      </section>

      {/* Light card grid band */}
      <section className="bg-panel py-20">
        <Container size="full" className="flex flex-col gap-10">
          <Skeleton className="h-9 w-72 rounded-2xl" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-3xl" />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
