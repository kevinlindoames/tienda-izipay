import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

const featurePlaceholders = Array.from({ length: 8 }, (_, index) => index);
const editorialPlaceholders = Array.from({ length: 2 }, (_, index) => index);
const mediaTextPlaceholders = Array.from({ length: 3 }, (_, index) => index);
const compatibilityPlaceholders = Array.from(
  { length: 4 },
  (_, index) => index,
);

function HeadingSkeleton({
  inverse = false,
}: {
  inverse?: boolean;
}): ReactElement {
  const inverseClass = inverse ? "bg-white/15" : undefined;

  return (
    <div className="space-y-4">
      <Skeleton className={`h-3 w-28 rounded-full ${inverseClass ?? ""}`} />
      <Skeleton
        className={`h-10 max-w-xl rounded-2xl sm:h-12 ${inverseClass ?? ""}`}
      />
      <Skeleton
        className={`h-4 max-w-2xl rounded-full ${inverseClass ?? ""}`}
      />
      <Skeleton className={`h-4 max-w-xl rounded-full ${inverseClass ?? ""}`} />
    </div>
  );
}

export function HomeSkeleton(): ReactElement {
  return (
    <>
      <div
        data-testid="home-skeleton-subnav"
        className="sticky top-[var(--header-height)] z-40 border-b border-[var(--color-border)] bg-[var(--color-page)]/90 backdrop-blur-xl"
      >
        <Container className="flex h-[var(--product-nav-height)] items-center gap-3 sm:gap-4">
          <div className="w-28 shrink-0 space-y-2">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="hidden h-3 w-20 rounded-full sm:block" />
          </div>

          <div className="flex min-w-0 flex-1 gap-2 overflow-hidden">
            <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
            <Skeleton className="h-9 w-28 shrink-0 rounded-full" />
            <Skeleton className="hidden h-9 w-20 shrink-0 rounded-full sm:block" />
          </div>

          <Skeleton className="h-10 w-24 shrink-0 rounded-full sm:w-28" />
        </Container>
      </div>

      <main
        data-testid="home-skeleton"
        aria-busy="true"
        aria-label={"Cargando p\u00e1gina de inicio"}
      >
        <div role="status" aria-live="polite">
          <span className="sr-only">{"Cargando p\u00e1gina de inicio"}</span>
        </div>

        <section data-testid="home-skeleton-hero" className="py-6 sm:py-8">
          <Container>
            <div className="relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-soft)]">
              <Skeleton className="aspect-[4/5] w-full rounded-[var(--radius-card)] sm:aspect-[4/3] lg:aspect-video" />

              <div className="absolute inset-x-0 bottom-0 space-y-4 p-6 sm:p-10 lg:p-14">
                <Skeleton className="h-3 w-32 rounded-full bg-white/20" />
                <Skeleton className="h-12 w-4/5 max-w-3xl rounded-2xl bg-white/20 sm:h-16" />
                <Skeleton className="h-5 w-3/5 max-w-2xl rounded-full bg-white/20" />
              </div>
            </div>
          </Container>
        </section>

        <section className="py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]">
          <Container>
            <div className="mx-auto max-w-3xl space-y-5">
              <Skeleton className="mx-auto h-10 w-4/5 rounded-2xl" />
              <Skeleton className="mx-auto h-4 w-full rounded-full" />
              <Skeleton className="mx-auto h-4 w-11/12 rounded-full" />
              <Skeleton className="mx-auto h-4 w-4/5 rounded-full" />
            </div>
          </Container>
        </section>

        <section
          data-testid="home-skeleton-features"
          className="bg-[var(--color-surface)] py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]"
        >
          <Container>
            <HeadingSkeleton />

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-6">
              {featurePlaceholders.map((item) => (
                <article
                  key={item}
                  data-testid="home-skeleton-feature-card"
                  className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-page)] p-6"
                >
                  <Skeleton className="mb-6 size-12 rounded-2xl" />
                  <Skeleton className="h-5 w-3/5 rounded-full" />
                  <Skeleton className="mt-4 h-4 w-full rounded-full" />
                  <Skeleton className="mt-2 h-4 w-4/5 rounded-full" />
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section
          data-testid="home-skeleton-editorial"
          className="py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]"
        >
          <Container>
            <HeadingSkeleton />

            <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2">
              {editorialPlaceholders.map((item) => (
                <article
                  key={item}
                  data-testid="home-skeleton-editorial-card"
                  className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]"
                >
                  <Skeleton className="aspect-[4/3] w-full rounded-none" />

                  <div className="space-y-4 p-6 sm:p-8">
                    <Skeleton className="h-7 w-3/5 rounded-xl" />
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-4 w-4/5 rounded-full" />
                  </div>
                </article>
              ))}
            </div>
          </Container>
        </section>

        <section className="bg-[var(--color-dark)] py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]">
          <Container>
            <HeadingSkeleton inverse />

            <Skeleton className="mx-auto mt-10 aspect-video max-w-5xl rounded-[var(--radius-card)] bg-white/15 lg:mt-14" />
          </Container>
        </section>

        {mediaTextPlaceholders.map((item) => {
          const mediaFirst = item % 2 === 0;

          return (
            <section
              key={item}
              data-testid="home-skeleton-media-text"
              className={
                item === 1
                  ? "bg-[var(--color-surface-soft)] py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]"
                  : "bg-[var(--color-page)] py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]"
              }
            >
              <Container>
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div
                    className={
                      mediaFirst
                        ? "order-1 space-y-4 lg:order-2"
                        : "order-1 space-y-4"
                    }
                  >
                    <Skeleton className="h-10 w-4/5 rounded-2xl" />
                    <Skeleton className="h-4 w-full rounded-full" />
                    <Skeleton className="h-4 w-5/6 rounded-full" />
                    <Skeleton className="h-4 w-3/4 rounded-full" />
                  </div>

                  <Skeleton
                    className={
                      mediaFirst
                        ? "order-2 aspect-[4/3] rounded-[var(--radius-card)] lg:order-1"
                        : "order-2 aspect-[4/3] rounded-[var(--radius-card)]"
                    }
                  />
                </div>
              </Container>
            </section>
          );
        })}

        <section
          data-testid="home-skeleton-compatibility"
          className="bg-[var(--color-surface)] py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]"
        >
          <Container>
            <HeadingSkeleton />

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
              {compatibilityPlaceholders.map((item) => (
                <article
                  key={item}
                  data-testid="home-skeleton-compatibility-card"
                  className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-page)] p-6"
                >
                  <Skeleton className="mb-5 size-12 rounded-2xl" />
                  <Skeleton className="h-5 w-3/5 rounded-full" />
                  <Skeleton className="mt-4 h-4 w-full rounded-full" />
                  <Skeleton className="mt-2 h-4 w-4/5 rounded-full" />
                </article>
              ))}
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
