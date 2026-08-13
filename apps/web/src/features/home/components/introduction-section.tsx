import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HomePageContent } from "@/features/home/types/home.types";

export interface IntroductionSectionProps {
  content: HomePageContent["introduction"];
}

export function IntroductionSection({
  content,
}: IntroductionSectionProps): ReactElement {
  return (
    <section className="py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-3xl">
            <SectionHeading title={content.title} className="[&_h2]:mx-auto" />

            <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-4 text-center">
              {content.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base leading-7 text-[var(--color-text-muted)] sm:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
