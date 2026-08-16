import type { Money } from "../types/catalog.types";

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(money.minorAmount / 100);
}
