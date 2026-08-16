import Image, { getImageProps } from "next/image";
import type { ReactElement } from "react";

import { cn } from "@/lib/cn";

import { MediaPlaceholder } from "./media-placeholder";

export interface ResponsiveMediaProps {
  desktopSrc?: string | null;
  mobileSrc?: string | null;
  alt: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  sizes: string;
  className?: string;
}

export function ResponsiveMedia({
  desktopSrc = null,
  mobileSrc = null,
  alt,
  priority = false,
  loading,
  sizes,
  className,
}: ResponsiveMediaProps): ReactElement {
  const fallbackSrc = desktopSrc ?? mobileSrc;

  if (!fallbackSrc) {
    return <MediaPlaceholder label={alt} className={className} />;
  }

  const mediaClassName = cn(
    "relative aspect-video w-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface-soft)]",
    className,
  );

  const image = (
    <Image
      src={fallbackSrc}
      alt={alt}
      fill
      sizes={sizes}
      preload={priority}
      loading={priority ? undefined : loading}
      className="object-cover"
    />
  );

  if (!mobileSrc || mobileSrc === fallbackSrc) {
    return <div className={mediaClassName}>{image}</div>;
  }

  const {
    props: { srcSet: mobileSrcSet, sizes: mobileSizes },
  } = getImageProps({
    src: mobileSrc,
    alt,
    width: 900,
    height: 1200,
    sizes,
  });

  return (
    <div className={mediaClassName}>
      <picture className="relative block h-full w-full">
        <source
          media="(max-width: 767px)"
          srcSet={mobileSrcSet}
          sizes={mobileSizes}
        />
        {image}
      </picture>
    </div>
  );
}
