import { Container } from "../components/ui/Container";
import { Skeleton } from "../components/ui/Skeleton";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading checkout" className="bg-background py-16">
      <Container size="lg" className="flex flex-col gap-8">
        <Skeleton className="h-6 w-72 rounded-full" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main form column */}
          <div className="flex flex-col gap-4">
            <Skeleton className="h-9 w-56 rounded-2xl" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-2xl" />
            ))}
            <Skeleton className="mt-2 h-12 w-44 rounded-full" />
          </div>
          {/* Order summary sidebar */}
          <Skeleton className="h-[360px] rounded-3xl" />
        </div>
      </Container>
    </div>
  );
}
