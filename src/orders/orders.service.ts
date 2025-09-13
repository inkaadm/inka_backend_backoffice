import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepository.create({
      ...createOrderDto,
      orderCreated: new Date(),
      orderStatus: OrderStatus.PENDING,
    });
    return await this.ordersRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.ordersRepository.find({
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    return await this.ordersRepository.find({
      where: { orderStatus: status },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    Object.assign(order, updateOrderDto);

    return await this.ordersRepository.save(order);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findOne(id);
    order.orderStatus = status;
    return await this.ordersRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.ordersRepository.remove(order);
  }

  async getOrderStats(): Promise<any> {
    const totalOrders = await this.ordersRepository.count();
    const pendingOrders = await this.ordersRepository.count({
      where: { orderStatus: OrderStatus.PENDING },
    });
    const confirmedOrders = await this.ordersRepository.count({
      where: { orderStatus: OrderStatus.CONFIRMED },
    });
    const deliveredOrders = await this.ordersRepository.count({
      where: { orderStatus: OrderStatus.DELIVERED },
    });

    return {
      total: totalOrders,
      pending: pendingOrders,
      confirmed: confirmedOrders,
      delivered: deliveredOrders,
    };
  }
}
