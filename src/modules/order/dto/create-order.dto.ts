import {
  IsArray,
  ValidateNested,
  IsInt,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsInt()
  productId!: number;

  @IsInt()
  variantId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsInt()
  userId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}