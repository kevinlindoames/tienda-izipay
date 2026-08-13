import type { ReactElement } from "react";

import { cn } from "@/lib/cn";

export type SectionHeadingAlign = "left" | "center";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: SectionHeadingAlign;
  inverse?: boolean;
  className?: string;
}

const alignClasses: Record<SectionHeadingAlign, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  inverse = false,
  className,
}: SectionHeadingProps): ReactElement {
  return (
    <div className={cn("flex flex-col gap-4", alignClasses[align], className)}>
      {eyebrow ? (
        <p
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em]",
            inverse ? "text-white/70" : "text-[var(--color-text-muted)]",
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={cn(
          "max-w-4xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl",
          inverse ? "text-white" : "text-[var(--color-text)]",
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            "max-w-3xl text-base leading-7 sm:text-lg",
            inverse ? "text-white/75" : "text-[var(--color-text-muted)]",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
