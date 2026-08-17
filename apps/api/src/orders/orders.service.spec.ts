import { BadRequestException, ConflictException } from '@nestjs/common';

import {
  DeliveryMode,
  OrderStatus,
  ProductStatus,
} from '../generated/prisma/client';
import type { PrismaService } from '../database/prisma.service';

import type { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

interface CalculatedOrderItem {
  productId: string;
  sku: string;
  productName: string;
  unitPriceMinor: number;
  quantity: number;
  subtotalMinor: number;
}

interface OrderCreateData {
  orderNumber: string;
  status: OrderStatus;
  currency: string;

  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;

  deliveryMode: DeliveryMode;

  department: string | null | undefined;
  province: string | null | undefined;
  district: string | null | undefined;
  address: string | null | undefined;
  reference: string | null;

  subtotalMinor: number;
  deliveryFeeMinor: number;
  totalMinor: number;

  items: {
    create: CalculatedOrderItem[];
  };
}

interface OrderCreateArgs {
  data: OrderCreateData;
}

interface CreatedOrderItem extends CalculatedOrderItem {
  id: string;
}

interface CreatedOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  currency: string;
  deliveryMode: DeliveryMode;
  subtotalMinor: number;
  deliveryFeeMinor: number;
  totalMinor: number;
  createdAt: Date;
  items: CreatedOrderItem[];
}

interface TestProduct {
  id: string;
  sku: string;
  name: string;
  priceMinor: number;
  currency: string;
  status: ProductStatus;

  inventory: {
    stockOnHand: number;
    reserved: number;
    trackStock: boolean;
    allowBackorder: boolean;
  };
}

interface TestTransactionClient {
  product: {
    findMany: jest.Mock<Promise<TestProduct[]>, []>;
  };

  order: {
    create: jest.Mock<Promise<CreatedOrder>, [OrderCreateArgs]>;
  };
}

describe('OrdersService', () => {
  function createFixture(options?: { stockOnHand?: number }) {
    const stockOnHand = options?.stockOnHand ?? 10;

    const products: TestProduct[] = [
      {
        id: 'product-1',
        sku: 'SKU-001',
        name: 'Producto real',
        priceMinor: 12990,
        currency: 'PEN',
        status: ProductStatus.ACTIVE,

        inventory: {
          stockOnHand,
          reserved: 0,
          trackStock: true,
          allowBackorder: false,
        },
      },
    ];

    const findMany: jest.Mock<Promise<TestProduct[]>, []> = jest.fn(
      (): Promise<TestProduct[]> => Promise.resolve(products),
    );

    const create: jest.Mock<Promise<CreatedOrder>, [OrderCreateArgs]> = jest.fn(
      ({ data }: OrderCreateArgs): Promise<CreatedOrder> =>
        Promise.resolve({
          id: 'order-1',
          orderNumber: data.orderNumber,
          status: OrderStatus.PENDING_PAYMENT,
          currency: data.currency,
          deliveryMode: data.deliveryMode,
          subtotalMinor: data.subtotalMinor,
          deliveryFeeMinor: data.deliveryFeeMinor,
          totalMinor: data.totalMinor,
          createdAt: new Date('2026-08-17T00:00:00.000Z'),

          items: data.items.create.map((item, index): CreatedOrderItem => ({
            id: `item-${index + 1}`,
            ...item,
          })),
        }),
    );

    const tx: TestTransactionClient = {
      product: {
        findMany,
      },

      order: {
        create,
      },
    };

    const transaction = jest.fn(
      <T>(
        callback: (client: TestTransactionClient) => Promise<T>,
      ): Promise<T> => callback(tx),
    );

    const prisma = {
      $transaction: transaction,
    };

    const service = new OrdersService(prisma as unknown as PrismaService);

    return {
      service,
      tx,
    };
  }

  const dto: CreateOrderDto = {
    firstName: 'Kevin',
    lastName: 'Lindo',
    email: 'KEVIN@example.com',
    phone: '999 999 999',

    deliveryMode: DeliveryMode.DELIVERY,

    department: 'Lima',
    province: 'Lima',
    district: 'Lima',
    address: 'Av. Ejemplo 123',
    reference: 'Puerta negra',

    items: [
      {
        productId: 'product-1',
        quantity: 2,
      },
    ],
  };

  it('recalculates price from the database instead of trusting the browser', async () => {
    const { service, tx } = createFixture();

    const result = await service.createOrder(dto);

    expect(result.order.subtotalMinor).toBe(25980);
    expect(result.order.totalMinor).toBe(25980);

    expect(tx.order.create).toHaveBeenCalledTimes(1);

    const firstCreateCall = tx.order.create.mock.calls[0];

    expect(firstCreateCall).toBeDefined();

    if (!firstCreateCall) {
      throw new Error('Expected order.create to be called.');
    }

    const createArgs = firstCreateCall[0];

    expect(createArgs.data.subtotalMinor).toBe(25980);
    expect(createArgs.data.totalMinor).toBe(25980);
    expect(createArgs.data.customerEmail).toBe('kevin@example.com');
  });

  it('rejects an order when real stock is insufficient', async () => {
    const { service } = createFixture({
      stockOnHand: 1,
    });

    await expect(service.createOrder(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('rejects duplicate product ids', async () => {
    const { service } = createFixture();

    await expect(
      service.createOrder({
        ...dto,

        items: [
          {
            productId: 'product-1',
            quantity: 1,
          },
          {
            productId: 'product-1',
            quantity: 1,
          },
        ],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
