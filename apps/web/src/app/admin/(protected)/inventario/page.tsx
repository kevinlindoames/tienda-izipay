import type { ReactElement } from "react";

import { AdminSectionPlaceholder } from "@/features/admin/layout/admin-section-placeholder";

export default function AdminInventoryPage(): ReactElement {
  return (
    <AdminSectionPlaceholder
      eyebrow="Operaciones"
      title="Inventario"
      description="Consulta y administra el stock disponible de los productos de la tienda."
      milestone="J.5"
    />
  );
}
