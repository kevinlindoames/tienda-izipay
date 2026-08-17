export const deliveryModeValues = ["delivery", "pickup"] as const;

export type DeliveryMode = (typeof deliveryModeValues)[number];

export interface CheckoutDraft {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  deliveryMode: DeliveryMode;
  department?: string;
  province?: string;
  district?: string;
  address?: string;
  reference?: string;
}
