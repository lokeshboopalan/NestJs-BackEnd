import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  orderNumber!: string;

  @Column()
  userId!: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount!: number;

@Column({
  type: 'enum',
  enum: OrderStatus,
  enumName: 'order_status_enum', // 🔥 FIXED NAME
  default: OrderStatus.PENDING,
})
status!: OrderStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  items!: OrderItem[];
}