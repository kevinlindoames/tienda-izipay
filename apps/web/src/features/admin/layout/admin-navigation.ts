import type { AdminNavigationItem } from "./admin-navigation.types";

export const ADMIN_NAVIGATION: readonly AdminNavigationItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    shortLabel: "Inicio",
  },
  {
    href: "/admin/productos",
    label: "Productos",
    shortLabel: "Productos",
  },
  {
    href: "/admin/inventario",
    label: "Inventario",
    shortLabel: "Stock",
  },
  {
    href: "/admin/pedidos",
    label: "Pedidos",
    shortLabel: "Pedidos",
  },
];
