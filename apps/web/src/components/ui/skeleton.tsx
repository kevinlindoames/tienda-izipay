import type { HTMLAttributes, ReactElement } from "react";

import { cn } from "@/lib/cn";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps): ReactElement {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-[var(--color-surface-soft)] motion-reduce:animate-none",
        className,
      )}
    />
  );
}
