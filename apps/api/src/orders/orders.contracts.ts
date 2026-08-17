import type { DeliveryMode, OrderStatus } from '../generated/prisma/client';

export interface OrderItemResponse {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  unitPriceMinor: number;
  quantity: number;
  subtotalMinor: number;
}

export interface CreateOrderResponse {
  order: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    currency: string;
    deliveryMode: DeliveryMode;
    subtotalMinor: number;
    deliveryFeeMinor: number;
    totalMinor: number;
    items: OrderItemResponse[];
    createdAt: string;
  };
}
