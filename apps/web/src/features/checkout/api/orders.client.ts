import type {
  CreateOrderRequest,
  CreatedOrderSummary,
  OrderStatus,
} from "../types/order.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    value === "PENDING_PAYMENT" ||
    value === "PAID" ||
    value === "CANCELLED" ||
    value === "EXPIRED"
  );
}

function isNonNegativeSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function parseCreatedOrder(value: unknown): CreatedOrderSummary {
  if (!isRecord(value) || !isRecord(value.order)) {
    throw new Error("La respuesta del pedido no tiene el formato esperado.");
  }

  const order = value.order;

  if (
    typeof order.id !== "string" ||
    typeof order.orderNumber !== "string" ||
    !isOrderStatus(order.status) ||
    typeof order.currency !== "string" ||
    !isNonNegativeSafeInteger(order.subtotalMinor) ||
    !isNonNegativeSafeInteger(order.deliveryFeeMinor) ||
    !isNonNegativeSafeInteger(order.totalMinor) ||
    typeof order.createdAt !== "string"
  ) {
    throw new Error("La respuesta del pedido no tiene el formato esperado.");
  }

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    currency: order.currency,
    subtotalMinor: order.subtotalMinor,
    deliveryFeeMinor: order.deliveryFeeMinor,
    totalMinor: order.totalMinor,
    createdAt: order.createdAt,
  };
}

async function readErrorMessage(response: Response): Promise<string> {
  if (response.status === 409) {
    return "Uno o mas productos ya no tienen stock suficiente.";
  }

  if (response.status === 404) {
    return "Uno de los productos ya no esta disponible.";
  }

  if (response.status === 400) {
    return "Los datos del pedido no son validos. Revisa la informacion ingresada.";
  }

  if (response.status === 502 || response.status === 503) {
    return "No pudimos comunicarnos con el servicio de pedidos.";
  }

  return "No pudimos crear el pedido. Intenta nuevamente.";
}

export async function createOrder(
  payload: CreateOrderRequest,
): Promise<CreatedOrderSummary> {
  let response: Response;

  try {
    response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("No pudimos comunicarnos con el servicio de pedidos.");
  }

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    throw new Error("La respuesta del pedido no es valida.");
  }

  return parseCreatedOrder(body);
}
