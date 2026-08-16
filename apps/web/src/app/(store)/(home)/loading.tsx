import type { ReactElement } from "react";

import { HomeSkeleton } from "@/features/home";

export default function HomeLoading(): ReactElement {
  return <HomeSkeleton />;
}
