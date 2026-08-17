import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId!: string;

  @IsInt()
  @Min(1)
  @Max(99)
  quantity!: number;
}
