import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { HomePageContent } from "@/features/home/types/home.types";

export interface ProductSubnavProps {
  content: HomePageContent["productNavigation"];
}

export function ProductSubnav({ content }: ProductSubnavProps): ReactElement {
  return (
    <div className="sticky top-[var(--header-height)] z-40 border-b border-[var(--color-border)] bg-[var(--color-page)]/90 backdrop-blur-xl">
      <Container className="flex h-[var(--product-nav-height)] items-center gap-2 sm:gap-4">
        <div className="max-w-28 shrink-0 sm:max-w-none">
          <p
            className="truncate text-sm font-semibold text-[var(--color-text)]"
            title={content.productName}
          >
            {content.productName}
          </p>

          {content.productCode ? (
            <p className="hidden text-xs text-[var(--color-text-muted)] sm:block">
              {content.productCode}
            </p>
          ) : null}
        </div>

        <nav
          aria-label="Navegacion del producto"
          className="min-w-0 flex-1 overflow-x-auto"
        >
          <div className="flex min-w-max items-center gap-1 px-1">
            {content.items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {content.secondaryAction ? (
            <Button
              href={content.secondaryAction.href}
              variant="secondary"
              className="hidden lg:inline-flex"
              target={content.secondaryAction.external ? "_blank" : undefined}
              rel={content.secondaryAction.external ? "noreferrer" : undefined}
            >
              {content.secondaryAction.label}
            </Button>
          ) : null}

          <Button
            href={content.primaryAction.href}
            className="shrink-0 px-4 sm:px-5"
            target={content.primaryAction.external ? "_blank" : undefined}
            rel={content.primaryAction.external ? "noreferrer" : undefined}
          >
            {content.primaryAction.label}
          </Button>
        </div>
      </Container>
    </div>
  );
}
