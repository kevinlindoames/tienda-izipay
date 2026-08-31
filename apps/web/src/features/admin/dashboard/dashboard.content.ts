export interface AdminDashboardAction {
  href: string;
  title: string;
  description: string;
  milestone: string;
}

export const ADMIN_DASHBOARD_ACTIONS: readonly AdminDashboardAction[] = [
  {
    href: "/admin/productos",
    title: "Productos",
    description:
      "Gestiona el catálogo, precios, estado comercial e información visible de los productos.",
    milestone: "J.4",
  },
  {
    href: "/admin/inventario",
    title: "Inventario",
    description:
      "Consulta y administra existencias y movimientos de stock de cada producto.",
    milestone: "J.5",
  },
  {
    href: "/admin/pedidos",
    title: "Pedidos",
    description:
      "Revisa los pedidos creados por clientes y su estado dentro del flujo comercial.",
    milestone: "J.6",
  },
];
