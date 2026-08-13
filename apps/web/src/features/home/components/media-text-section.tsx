import type { ReactElement } from "react";

import { Container } from "@/components/ui/container";
import { ResponsiveMedia } from "@/components/ui/responsive-media";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { MediaTextBlock } from "@/features/home/types/home.types";
import { cn } from "@/lib/cn";

export interface MediaTextSectionProps {
  content: MediaTextBlock;
}

const toneClasses: Record<NonNullable<MediaTextBlock["tone"]>, string> = {
  light: "bg-[var(--color-page)]",
  soft: "bg-[var(--color-surface-soft)]",
  dark: "bg-[var(--color-dark)]",
};

export function MediaTextSection({
  content,
}: MediaTextSectionProps): ReactElement {
  const tone = content.tone ?? "light";
  const inverse = tone === "dark";

  const textDesktopOrder =
    content.mediaPosition === "left" ? "lg:order-2" : "lg:order-1";

  const mediaDesktopOrder =
    content.mediaPosition === "left" ? "lg:order-1" : "lg:order-2";

  return (
    <section
      id={content.id}
      className={cn(
        "py-[var(--space-section-mobile)] lg:py-[var(--space-section-desktop)]",
        toneClasses[tone],
      )}
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className={cn("order-1", textDesktopOrder)}>
            <SectionHeading
              title={content.title}
              description={content.body}
              align="left"
              inverse={inverse}
            />
          </Reveal>

          <Reveal className={cn("order-2", mediaDesktopOrder)}>
            <ResponsiveMedia
              desktopSrc={content.media.desktopSrc}
              mobileSrc={content.media.mobileSrc}
              alt={content.media.alt}
              sizes="(max-width: 1023px) 100vw, 50vw"
              className={cn(
                "aspect-[4/3]",
                inverse &&
                  "border-white/15 bg-[var(--color-dark-deep)] text-white/65",
              )}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
