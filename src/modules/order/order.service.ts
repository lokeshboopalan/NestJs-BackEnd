import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from './enums/order-status.enum';
import { ProductVariant } from './../product/entities/product-variant.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

   @InjectRepository(ProductVariant)
   private variantRepo: Repository<ProductVariant>,

    @InjectRepository(OrderItem)
    private itemRepo: Repository<OrderItem>,
  ) {}

async create(dto: CreateOrderDto) {
  const orderNumber = `ORD-${Date.now()}`;
  let totalAmount = 0;
  const orderItems = [];

  for (const item of dto.items) {

    const variant = await this.variantRepo.findOne({
      where: { id: item.variantId },
    });

    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    const price = Number(variant.price); // convert decimal
    const subtotal = price * item.quantity;
    totalAmount += subtotal;

    const orderItem = this.itemRepo.create({
      productId: variant.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      price,
      subtotal,
    });

    orderItems.push(orderItem);
  }

  const order = this.orderRepo.create({
    orderNumber,
    userId: dto.userId,
    totalAmount,
    items: orderItems,
  });
console.log('Savingorder:', order);
  await this.orderRepo.save(order);

  const check = await this.orderRepo.find({
  relations: ['items'],
});
console.log('All orders after save:', check);

  return order;
}

  findAll() {
    return this.orderRepo.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) throw new NotFoundException('Order not found');

    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.findOne(id);
    order.status = dto.status;
    return this.orderRepo.save(order);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return this.orderRepo.remove(order);
  }
}