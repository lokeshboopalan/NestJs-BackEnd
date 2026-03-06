import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductVariant } from '../product/entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, ProductVariant])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
