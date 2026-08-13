import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";
import { ResponsiveMedia } from "@/components/ui/responsive-media";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { HomePageContent } from "@/features/home/types/home.types";

export interface DarkHighlightSectionProps {
  content: HomePageContent["highlight"];
}

export function DarkHighlightSection({
  content,
}: DarkHighlightSectionProps): ReactElement {
  return (
    <section
      id="highlight"
      className="scroll-mt-[calc(var(--header-height)_+_var(--product-nav-height)_+_1rem)] bg-[var(--color-dark)] py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]"
    >
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={content.eyebrow}
            title={content.title}
            description={content.body}
            inverse
          />
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-5xl lg:mt-14">
          <ResponsiveMedia
            desktopSrc={content.media.desktopSrc}
            mobileSrc={content.media.mobileSrc}
            alt={content.media.alt}
            sizes="(max-width: 1023px) 100vw, 1024px"
            className="aspect-video border-white/15 bg-[var(--color-dark-deep)] text-white/65"
          />
        </Reveal>
      </Container>
    </section>
  );
}
