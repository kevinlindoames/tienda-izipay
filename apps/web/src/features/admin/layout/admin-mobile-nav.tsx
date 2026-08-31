import type { ReactElement } from "react";

import { AdminNav } from "./admin-nav";

export function AdminMobileNav(): ReactElement {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 md:hidden">
      <div className="overflow-x-auto pb-1">
        <AdminNav variant="mobile" />
      </div>
    </div>
  );
}
