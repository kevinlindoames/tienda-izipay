export type CartCurrency = "PEN";

export interface CartMoney {
  minorAmount: number;
  currency: CartCurrency;
}

export interface CartImageSnapshot {
  desktopSrc: string | null;
  mobileSrc?: string | null;
  alt: string;
  width?: number;
  height?: number;
}

export interface CartProductSnapshot {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  unitPrice: CartMoney;
  image: CartImageSnapshot | null;
}

export interface CartItem extends CartProductSnapshot {
  quantity: number;
}
