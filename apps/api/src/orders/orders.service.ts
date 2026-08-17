import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import {
  DeliveryMode,
  OrderStatus,
  ProductStatus,
} from '../generated/prisma/client';
import { PrismaService } from '../database/prisma.service';

import type { CreateOrderResponse } from './orders.contracts';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto): Promise<CreateOrderResponse> {
    this.assertNoDuplicateProducts(dto);

    return this.prisma.$transaction(async (tx) => {
      const productIds = dto.items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
        include: {
          inventory: true,
        },
      });

      if (products.length !== productIds.length) {
        const foundIds = new Set(products.map((product) => product.id));

        const missingId = productIds.find(
          (productId) => !foundIds.has(productId),
        );

        throw new NotFoundException(
          `Product '${missingId ?? 'unknown'}' was not found.`,
        );
      }

      const productById = new Map(
        products.map((product) => [product.id, product]),
      );

      const currencies = new Set(products.map((product) => product.currency));

      if (currencies.size !== 1) {
        throw new BadRequestException(
          'All products in an order must use the same currency.',
        );
      }

      const currency = products[0]?.currency;

      if (!currency) {
        throw new BadRequestException('The order does not contain products.');
      }

      const calculatedItems = dto.items.map((requestedItem) => {
        const product = productById.get(requestedItem.productId);

        if (!product) {
          throw new NotFoundException(
            `Product '${requestedItem.productId}' was not found.`,
          );
        }

        if (product.status !== ProductStatus.ACTIVE) {
          throw new ConflictException(
            `Product '${product.name}' is not available for purchase.`,
          );
        }

        const inventory = product.inventory;

        if (!inventory) {
          throw new ConflictException(
            `Product '${product.name}' does not have inventory configured.`,
          );
        }

        if (inventory.trackStock && !inventory.allowBackorder) {
          const availableStock = inventory.stockOnHand - inventory.reserved;

          if (availableStock < requestedItem.quantity) {
            throw new ConflictException(
              `Insufficient stock for product '${product.name}'.`,
            );
          }
        }

        const subtotalMinor = product.priceMinor * requestedItem.quantity;

        if (!Number.isSafeInteger(subtotalMinor)) {
          throw new BadRequestException(
            `Calculated subtotal is invalid for product '${product.name}'.`,
          );
        }

        return {
          productId: product.id,
          sku: product.sku,
          productName: product.name,
          unitPriceMinor: product.priceMinor,
          quantity: requestedItem.quantity,
          subtotalMinor,
        };
      });

      const subtotalMinor = calculatedItems.reduce(
        (total, item) => total + item.subtotalMinor,
        0,
      );

      if (!Number.isSafeInteger(subtotalMinor)) {
        throw new BadRequestException('Calculated order subtotal is invalid.');
      }

      const deliveryFeeMinor = 0;
      const totalMinor = subtotalMinor + deliveryFeeMinor;

      const order = await tx.order.create({
        data: {
          orderNumber: this.createOrderNumber(),
          status: OrderStatus.PENDING_PAYMENT,
          currency,

          customerFirstName: dto.firstName.trim(),
          customerLastName: dto.lastName.trim(),
          customerEmail: dto.email.trim().toLowerCase(),
          customerPhone: dto.phone.trim(),

          deliveryMode: dto.deliveryMode,

          department:
            dto.deliveryMode === DeliveryMode.DELIVERY
              ? dto.department?.trim()
              : null,

          province:
            dto.deliveryMode === DeliveryMode.DELIVERY
              ? dto.province?.trim()
              : null,

          district:
            dto.deliveryMode === DeliveryMode.DELIVERY
              ? dto.district?.trim()
              : null,

          address:
            dto.deliveryMode === DeliveryMode.DELIVERY
              ? dto.address?.trim()
              : null,

          reference: dto.reference?.trim() || null,

          subtotalMinor,
          deliveryFeeMinor,
          totalMinor,

          items: {
            create: calculatedItems,
          },
        },
        include: {
          items: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });

      return {
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          currency: order.currency,
          deliveryMode: order.deliveryMode,
          subtotalMinor: order.subtotalMinor,
          deliveryFeeMinor: order.deliveryFeeMinor,
          totalMinor: order.totalMinor,
          items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            sku: item.sku,
            productName: item.productName,
            unitPriceMinor: item.unitPriceMinor,
            quantity: item.quantity,
            subtotalMinor: item.subtotalMinor,
          })),
          createdAt: order.createdAt.toISOString(),
        },
      };
    });
  }

  private assertNoDuplicateProducts(dto: CreateOrderDto): void {
    const ids = dto.items.map((item) => item.productId);
    const uniqueIds = new Set(ids);

    if (uniqueIds.size !== ids.length) {
      throw new BadRequestException(
        'An order cannot contain duplicate productId entries.',
      );
    }
  }

  private createOrderNumber(): string {
    const datePart = new Date().toISOString().slice(0, 10).replaceAll('-', '');

    const randomPart = randomUUID()
      .replaceAll('-', '')
      .slice(0, 10)
      .toUpperCase();

    return `ORD-${datePart}-${randomPart}`;
  }
}
