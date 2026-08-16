import type { MediaAsset } from "@/types/media.types";

interface CreateMockMediaOptions {
  id: string;
  seed: string;
  alt: string;
  desktopWidth?: number;
  desktopHeight?: number;
  mobileWidth?: number;
  mobileHeight?: number;
}

function picsumUrl(seed: string, width: number, height: number): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

export function createMockMedia({
  id,
  seed,
  alt,
  desktopWidth = 1600,
  desktopHeight = 900,
  mobileWidth = 900,
  mobileHeight = 1200,
}: CreateMockMediaOptions): MediaAsset {
  return {
    id,
    desktopSrc: picsumUrl(seed, desktopWidth, desktopHeight),
    mobileSrc: picsumUrl(`${seed}-mobile`, mobileWidth, mobileHeight),
    alt,
    width: desktopWidth,
    height: desktopHeight,
  };
}
