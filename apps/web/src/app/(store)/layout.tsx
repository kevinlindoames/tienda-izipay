import type { ReactNode } from "react";

interface StoreLayoutProps {
  children: ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps): ReactNode {
  return children;
}
