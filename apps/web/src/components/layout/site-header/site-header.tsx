import type { ReactElement } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { SiteHeaderContent } from "@/content/site.types";
import { CartIndicator } from "@/features/cart/components/cart-indicator";

import { MobileMenu } from "./mobile-menu";

export interface SiteHeaderProps {
  content: SiteHeaderContent;
}

export function SiteHeader({ content }: SiteHeaderProps): ReactElement {
  const desktopAction =
    content.navigation.length > 0
      ? content.navigation[content.navigation.length - 1]
      : undefined;

  const desktopNavigation = desktopAction
    ? content.navigation.slice(0, -1)
    : content.navigation;

  return (
    <header className="sticky top-0 z-50 h-[var(--header-height)] border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-xl">
      <Container className="grid h-full grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <a
          href={content.brandHref ?? "#overview"}
          className="justify-self-start text-base font-semibold tracking-[-0.02em] text-[var(--color-text)] focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
        >
          {content.brandName}
        </a>

        <nav
          aria-label="Navegacion principal"
          className="hidden items-center gap-1 md:flex"
        >
          {desktopNavigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-1">
          <CartIndicator />

          {desktopAction ? (
            <div className="hidden md:block">
              <Button href={desktopAction.href} variant="ghost">
                {desktopAction.label}
              </Button>
            </div>
          ) : null}

          <MobileMenu navigation={content.navigation} />
        </div>
      </Container>
    </header>
  );
}
