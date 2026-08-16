import type {
  FooterContent,
  NavigationItem,
  SiteHeaderContent,
} from "@/content/site.types";
import type { MediaAsset } from "@/types/media.types";

export type { FooterContent, NavigationItem } from "@/content/site.types";
export type MediaContent = MediaAsset;

export interface CallToAction {
  label: string;
  href: string;
  external?: boolean;
}

export interface FeatureItem {
  id: string;
  title: string;
  description?: string;
  iconKey: string;
}

export interface MediaTextBlock {
  id: string;
  title: string;
  body: string;
  media: MediaAsset;
  mediaPosition: "left" | "right";
  tone?: "light" | "soft" | "dark";
}

export interface EditorialGridContent {
  eyebrow?: string;
  title: string;
  description?: string;
  items: MediaTextBlock[];
}

export interface HomePageContent {
  header: SiteHeaderContent;
  productNavigation: {
    productName: string;
    productCode?: string;
    items: NavigationItem[];
    primaryAction: CallToAction;
    secondaryAction?: CallToAction;
  };
  hero: {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    media: MediaAsset;
  };
  introduction: {
    title: string;
    paragraphs: string[];
  };
  featuresHeading: {
    eyebrow?: string;
    title: string;
    description?: string;
  };
  features: FeatureItem[];
  editorialGrid: EditorialGridContent;
  editorialBlocks: MediaTextBlock[];
  highlight: {
    eyebrow?: string;
    title: string;
    body: string;
    media: MediaAsset;
  };
  compatibility: {
    eyebrow?: string;
    title: string;
    paragraphs: string[];
    items: FeatureItem[];
  };
  footer: FooterContent;
}
