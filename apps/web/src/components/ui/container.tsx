import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface ContainerProps {
  as?: "div" | "section" | "nav";
  children: ReactNode;
  className?: string;
}

export function Container({
  as: Component = "div",
  children,
  className,
}: ContainerProps): ReactElement {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </Component>
  );
}
