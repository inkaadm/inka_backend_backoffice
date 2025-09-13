import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id' })
  id: number;

  @Column({ name: 'product_name', type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'text', array: true })
  features: string[];

  @Column({ type: 'integer' })
  stock: number;

  @Column({ type: 'text', array: true, default: '{}' })
  images: string[];

  @ManyToOne('Category', 'products')
  @JoinColumn({ name: 'category_id' })
  category: any;

  @OneToMany('Order', 'product')
  orders: any[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
