import type { ReactElement } from "react";

import { cn } from "@/lib/cn";

export type MediaAspectRatio = "16/9" | "4/3" | "3/2" | "1/1" | "portrait";

export type MediaPlaceholderTone = "light" | "dark" | "brand";

export interface MediaPlaceholderProps {
  label: string;
  aspectRatio?: MediaAspectRatio;
  tone?: MediaPlaceholderTone;
  className?: string;
}

const aspectRatioClasses: Record<MediaAspectRatio, string> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/2": "aspect-[3/2]",
  "1/1": "aspect-square",
  portrait: "aspect-[3/4]",
};

const toneClasses: Record<MediaPlaceholderTone, string> = {
  light:
    "border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]",
  dark: "border-white/20 bg-[var(--color-dark)] text-white/70",
  brand:
    "border-transparent bg-[var(--color-brand)] text-[var(--color-dark-deep)]",
};

export function MediaPlaceholder({
  label,
  aspectRatio = "16/9",
  tone = "light",
  className,
}: MediaPlaceholderProps): ReactElement {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "grid w-full place-items-center overflow-hidden rounded-[var(--radius-card)] border p-6 text-center",
        aspectRatioClasses[aspectRatio],
        toneClasses[tone],
        className,
      )}
    >
      <span className="max-w-72 text-xs font-medium uppercase tracking-[0.18em]">
        {label}
      </span>
    </div>
  );
}
