import type { ReactElement } from "react";

import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <Skeleton className="aspect-square w-full rounded-none" />

      <div className="p-5 sm:p-6">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-3 w-24 rounded-full" />
        </div>

        <Skeleton className="mt-5 h-7 w-3/4 rounded-lg" />
        <Skeleton className="mt-4 h-4 w-full rounded-full" />
        <Skeleton className="mt-2 h-4 w-4/5 rounded-full" />

        <div className="mt-8 flex items-end justify-between gap-4">
          <Skeleton className="h-7 w-28 rounded-lg" />
          <Skeleton className="h-11 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
