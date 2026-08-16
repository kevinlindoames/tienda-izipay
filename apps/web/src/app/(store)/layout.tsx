import type { ReactElement, ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { siteMock } from "@/content/site.mock";

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({
  children,
}: StoreLayoutProps): ReactElement {
  return (
    <>
      <SiteHeader content={siteMock.header} />
      {children}
      <SiteFooter content={siteMock.footer} />
    </>
  );
}
