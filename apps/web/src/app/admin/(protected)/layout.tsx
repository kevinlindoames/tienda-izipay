import { redirect } from "next/navigation";
import type { ReactElement, ReactNode } from "react";

import { getCurrentAdmin } from "@/features/admin/auth/admin-auth.server";
import { AdminShell } from "@/features/admin/layout/admin-shell";

interface ProtectedAdminLayoutProps {
  children: ReactNode;
}

export default async function ProtectedAdminLayout({
  children,
}: ProtectedAdminLayoutProps): Promise<ReactElement> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
