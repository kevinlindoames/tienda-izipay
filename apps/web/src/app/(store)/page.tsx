import type { ReactElement } from "react";

import { ProductSubnav } from "@/components/layout/product-subnav";
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
    </>
  );
}
