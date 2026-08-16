import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";
import type { FooterContent } from "@/content/site.types";

export interface SiteFooterProps {
  content: FooterContent;
}

export function SiteFooter({ content }: SiteFooterProps): ReactElement {
  return (
    <footer id="contact" className="bg-[var(--color-dark-deep)] text-white">
      <Container className="py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_2fr] lg:gap-16">
          <div>
            <p className="text-xl font-semibold tracking-[-0.03em]">
              {content.brandName}
            </p>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
              {content.summary}
            </p>

            <div
              id="purchase"
              className="mt-8 rounded-[var(--radius-card)] border border-white/15 bg-white/5 p-5"
            >
              <p className="text-sm font-semibold">Compra y contacto</p>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Flujo comercial pendiente de habilitaci\u00f3n.
              </p>

              {content.contactEmail ? (
                <p className="mt-4 text-sm text-white/80">
                  Correo provisional: {content.contactEmail}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
            {content.columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <p className="text-sm font-semibold">{column.title}</p>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-sm text-white/65 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <section aria-labelledby="footer-newsletter-title">
              <p id="footer-newsletter-title" className="text-sm font-semibold">
                {content.newsletter.title}
              </p>
              <p className="mt-4 text-sm leading-6 text-white/65">
                {content.newsletter.description}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-brand)]">
                {content.newsletter.statusLabel}
              </p>
            </section>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Redes provisionales
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {content.socialLabels.map((label) => (
                  <li
                    key={label}
                    className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/60"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs leading-5 text-white/50">
              {content.copyright}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
