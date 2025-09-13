import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid', { name: 'order_id' })
  id: string;

  @Column({
    name: 'orderstatus',
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  orderStatus: OrderStatus;

  @Column({ name: 'order_created', type: 'timestamp' })
  orderCreated: Date;

  @Column({ name: 'products' })
  productId: number;

  @Column({ type: 'text', unique: true })
  phone: string;

  @Column({ name: 'addres', type: 'text' })
  address: string;

  @Column({ type: 'text' })
  city: string;

  @Column({ name: 'state_addres', type: 'text' })
  stateAddress: string;

  @Column({ name: 'user_name', type: 'text' })
  userName: string;

  @Column({ name: 'final_price', type: 'text' })
  finalPrice: string;

  @ManyToOne('Product', 'orders')
  @JoinColumn({ name: 'products' })
  product: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
