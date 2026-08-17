import type { ReactElement, ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteMock } from "@/content/site.mock";
import { CartHydrator } from "@/features/cart/components/cart-hydrator";

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({
  children,
}: StoreLayoutProps): ReactElement {
  return (
    <>
      <SiteHeader content={siteMock.header} />
      <CartHydrator />
      {children}
      <SiteFooter content={siteMock.footer} />
    </>
  );
}
