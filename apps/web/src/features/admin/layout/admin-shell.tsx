import type { ReactElement, ReactNode } from "react";

import type { CurrentAdmin } from "@/features/admin/auth/admin-auth.types";

import { AdminMobileNav } from "./admin-mobile-nav";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

interface AdminShellProps {
  admin: CurrentAdmin;
  children: ReactNode;
}

export function AdminShell({ admin, children }: AdminShellProps): ReactElement {
  return (
    <div className="min-h-screen bg-[var(--color-page)] text-[var(--color-text)]">
      <a
        href="#admin-main"
        className="sr-only z-50 rounded-md bg-[var(--color-dark)] px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido principal
      </a>

      <div className="md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
        <AdminSidebar />

        <div className="min-w-0">
          <AdminTopbar admin={admin} />
          <AdminMobileNav />

          <main
            id="admin-main"
            tabIndex={-1}
            className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
