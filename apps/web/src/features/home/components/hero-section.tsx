import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";
import { ResponsiveMedia } from "@/components/ui/responsive-media";
import { Reveal } from "@/components/ui/reveal";
import type { HomePageContent } from "@/features/home/types/home.types";

export interface HeroSectionProps {
  content: HomePageContent["hero"];
}

export function HeroSection({ content }: HeroSectionProps): ReactElement {
  return (
    <section
      id="overview"
      className="scroll-mt-[calc(var(--header-height)_+_var(--product-nav-height)_+_1rem)] py-6 sm:py-8"
    >
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-soft)]">
          <ResponsiveMedia
            desktopSrc={content.media.desktopSrc}
            mobileSrc={content.media.mobileSrc}
            alt={content.media.alt}
            priority
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) 92vw, 1280px"
            className="aspect-[4/5] border-0 bg-[var(--color-dark)] text-white/60 sm:aspect-[4/3] lg:aspect-video"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5"
          />

          <div className="absolute inset-0 flex items-end p-6 sm:p-10 lg:p-14">
            <Reveal className="max-w-3xl">
              {content.eyebrow ? (
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/75 sm:text-sm">
                  {content.eyebrow}
                </p>
              ) : null}

              <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white">
                {content.title}
              </h1>

              {content.subtitle ? (
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                  {content.subtitle}
                </p>
              ) : null}
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
