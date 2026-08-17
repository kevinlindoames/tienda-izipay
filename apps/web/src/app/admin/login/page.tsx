import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/features/admin/auth/admin-auth.server";
import { AdminLoginForm } from "@/features/admin/auth/admin-login-form";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-16">
      <section className="w-full rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <p className="mb-2 text-sm uppercase tracking-[0.18em] text-black/60">
          Administración
        </p>

        <h1 className="mb-2 text-2xl font-semibold">Iniciar sesión</h1>

        <p className="mb-8 text-sm text-black/60">
          Acceso exclusivo para administradores autorizados.
        </p>

        <AdminLoginForm />
      </section>
    </main>
  );
}
