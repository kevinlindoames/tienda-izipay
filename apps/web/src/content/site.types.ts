export interface NavigationItem {
  label: string;
  href: string;
}

export interface SiteHeaderContent {
  brandName: string;
  brandHref?: string;
  navigation: NavigationItem[];
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
