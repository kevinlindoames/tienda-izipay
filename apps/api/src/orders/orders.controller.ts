import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import type { CreateOrderResponse } from './orders.contracts';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(@Body() dto: CreateOrderDto): Promise<CreateOrderResponse> {
    return this.ordersService.createOrder(dto);
  }
}
