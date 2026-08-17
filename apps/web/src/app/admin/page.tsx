import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/features/admin/auth/admin-auth.server";
import { AdminLogoutButton } from "@/features/admin/auth/admin-logout-button";

export default async function AdminPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.18em] text-black/60">
            Panel administrativo
          </p>

          <h1 className="text-3xl font-semibold">Hola, {admin.firstName}</h1>

          <p className="mt-2 text-black/60">
            {admin.email} · {admin.role}
          </p>
        </div>

        <AdminLogoutButton />
      </div>

      <section className="mt-12 rounded-2xl border border-black/10 p-6">
        <h2 className="text-xl font-semibold">
          Acceso administrativo verificado
        </h2>

        <p className="mt-2 text-black/60">
          La base visual completa del panel se implementará en J.3.
        </p>
      </section>
    </main>
  );
}
