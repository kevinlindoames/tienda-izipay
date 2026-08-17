export type BackendDeliveryMode = "DELIVERY" | "PICKUP";

export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "CANCELLED" | "EXPIRED";

export interface CreateOrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryMode: BackendDeliveryMode;
  department?: string;
  province?: string;
  district?: string;
  address?: string;
  reference?: string;
  items: CreateOrderItemRequest[];
}

export interface CreatedOrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  currency: string;
  subtotalMinor: number;
  deliveryFeeMinor: number;
  totalMinor: number;
  createdAt: string;
}
