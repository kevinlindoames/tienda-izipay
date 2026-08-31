import type { ReactElement } from "react";

import type { CurrentAdmin } from "@/features/admin/auth/admin-auth.types";
import { AdminLogoutButton } from "@/features/admin/auth/admin-logout-button";

interface AdminTopbarProps {
  admin: CurrentAdmin;
}

export function AdminTopbar({ admin }: AdminTopbarProps): ReactElement {
  const fullName = `${admin.firstName} ${admin.lastName}`.trim();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-text)]">
            {fullName}
          </p>

          <p className="mt-1 truncate text-xs text-[var(--color-text-muted)]">
            {admin.email} · {admin.role}
          </p>
        </div>

        <AdminLogoutButton />
      </div>
    </header>
  );
}
