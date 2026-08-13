export interface NavigationItem {
  label: string;
  href: string;
}

export interface CallToAction {
  label: string;
  href: string;
  external?: boolean;
}

export interface MediaContent {
  desktopSrc: string | null;
  mobileSrc?: string | null;
  alt: string;
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
  media: MediaContent;
  mediaPosition: "left" | "right";
  tone?: "light" | "soft" | "dark";
}

export interface EditorialGridContent {
  eyebrow?: string;
  title: string;
  description?: string;
  items: MediaTextBlock[];
}

export interface FooterContent {
  brandName: string;
  summary: string;
  columns: Array<{
    title: string;
    links: NavigationItem[];
  }>;
  contactEmail?: string;
  newsletter: {
    title: string;
    description: string;
    statusLabel: string;
  };
  socialLabels: string[];
  copyright: string;
}

export interface HomePageContent {
  header: {
    brandName: string;
    navigation: NavigationItem[];
  };
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
    media: MediaContent;
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
    media: MediaContent;
  };
  compatibility: {
    eyebrow?: string;
    title: string;
    paragraphs: string[];
    items: FeatureItem[];
  };
  footer: FooterContent;
}
