import type { ReactElement } from "react";

import { AdminSectionPlaceholder } from "@/features/admin/layout/admin-section-placeholder";

export default function AdminProductsPage(): ReactElement {
  return (
    <AdminSectionPlaceholder
      eyebrow="Catálogo"
      title="Productos"
      description="Gestiona los productos que forman parte del catálogo comercial de la tienda."
      milestone="J.4"
    />
  );
}
