import type { ReactElement } from "react";

import { FeatureIcon } from "@/components/icons/feature-icon";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HomePageContent } from "@/features/home/types/home.types";

export interface CompatibilitySectionProps {
  content: HomePageContent["compatibility"];
}

export function CompatibilitySection({
  content,
}: CompatibilitySectionProps): ReactElement {
  return (
    <section
      id="compatibility"
      className="scroll-mt-[calc(var(--header-height)_+_var(--product-nav-height)_+_1rem)] bg-[var(--color-surface)] py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.paragraphs.join(" ")}
          />
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {content.items.map((item, index) => (
            <Reveal
              key={item.id}
              delay={Math.min(index * 0.06, 0.24)}
              className="h-full"
            >
              <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-page)] p-6">
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-text)]">
                  <FeatureIcon iconKey={item.iconKey} />
                </div>

                <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-text)]">
                  {item.title}
                </h3>

                {item.description ? (
                  <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                    {item.description}
                  </p>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
