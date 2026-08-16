export interface MediaAsset {
  id: string;
  desktopSrc: string | null;
  mobileSrc?: string | null;
  alt: string;
  width?: number;
  height?: number;
}

export interface OrderedMediaAsset extends MediaAsset {
  position: number;
  isPrimary: boolean;
}
