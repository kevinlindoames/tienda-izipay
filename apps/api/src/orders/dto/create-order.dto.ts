import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { DeliveryMode } from '../../generated/prisma/client';

import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(80)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(80)
  lastName!: string;

  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^(?=(?:\D*\d){7,11}\D*$).+$/, {
    message: 'phone must contain between 7 and 11 digits',
  })
  phone!: string;

  @IsEnum(DeliveryMode)
  deliveryMode!: DeliveryMode;

  @ValidateIf(
    (value: CreateOrderDto) => value.deliveryMode === DeliveryMode.DELIVERY,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  department?: string;

  @ValidateIf(
    (value: CreateOrderDto) => value.deliveryMode === DeliveryMode.DELIVERY,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  province?: string;

  @ValidateIf(
    (value: CreateOrderDto) => value.deliveryMode === DeliveryMode.DELIVERY,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  district?: string;

  @ValidateIf(
    (value: CreateOrderDto) => value.deliveryMode === DeliveryMode.DELIVERY,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  reference?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
