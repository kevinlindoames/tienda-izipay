import type { ReactElement } from "react";

import { AdminSectionPlaceholder } from "@/features/admin/layout/admin-section-placeholder";

export default function AdminOrdersPage(): ReactElement {
  return (
    <AdminSectionPlaceholder
      eyebrow="Operaciones"
      title="Pedidos"
      description="Revisa y administra los pedidos registrados por los clientes de la tienda."
      milestone="J.6"
    />
  );
}
