import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";
import { ResponsiveMedia } from "@/components/ui/responsive-media";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { EditorialGridContent } from "@/features/home/types/home.types";

export interface EditorialGridSectionProps {
  content: EditorialGridContent;
}

export function EditorialGridSection({
  content,
}: EditorialGridSectionProps): ReactElement {
  return (
    <section
      id="use-cases"
      className="scroll-mt-[calc(var(--header-height)_+_var(--product-nav-height)_+_1rem)] py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.description}
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2">
          {content.items.map((item, index) => (
            <Reveal
              key={item.id}
              delay={Math.min(index * 0.08, 0.2)}
              className="h-full"
            >
              <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]">
                <div className="order-1 p-6 sm:p-8 lg:order-2">
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--color-text)]">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-[var(--color-text-muted)]">
                    {item.body}
                  </p>
                </div>

                <ResponsiveMedia
                  desktopSrc={item.media.desktopSrc}
                  mobileSrc={item.media.mobileSrc}
                  alt={item.media.alt}
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="order-2 aspect-[4/3] rounded-none border-0 lg:order-1"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
