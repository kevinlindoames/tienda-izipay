import type { ReactElement } from "react";

import { ProductSubnav } from "@/components/layout/product-subnav";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  CompatibilitySection,
  DarkHighlightSection,
  EditorialGridSection,
  FeatureGridSection,
  HeroSection,
  IntroductionSection,
  MediaTextSection,
} from "@/features/home";
import { homeMock } from "@/features/home/content/home.mock";

export default function HomePage(): ReactElement {
  return (
    <>
      <SiteHeader content={homeMock.header} />
      <ProductSubnav content={homeMock.productNavigation} />

      <main>
        <HeroSection content={homeMock.hero} />
        <IntroductionSection content={homeMock.introduction} />
        <FeatureGridSection
          heading={homeMock.featuresHeading}
          items={homeMock.features}
        />
        <EditorialGridSection content={homeMock.editorialGrid} />
        <DarkHighlightSection content={homeMock.highlight} />

        {homeMock.editorialBlocks.map((block) => (
          <MediaTextSection key={block.id} content={block} />
        ))}

        <CompatibilitySection content={homeMock.compatibility} />
      </main>

      <SiteFooter content={homeMock.footer} />
    </>
  );
}
