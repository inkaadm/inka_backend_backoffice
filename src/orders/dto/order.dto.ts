import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../entities/order.entity';

export class CreateOrderDto {
  @ApiPropertyOptional({
    description: 'Estado de la orden',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus?: OrderStatus;

  @ApiPropertyOptional({
    description: 'Fecha de creación de la orden (se genera automáticamente)',
    example: '2025-09-13T16:07:32.290Z',
  })
  @IsOptional()
  @IsDateString()
  orderCreated?: Date;

  @ApiProperty({
    description: 'ID del producto que se está ordenando',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: 'Número de teléfono del cliente',
    example: '+51987654321',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'Dirección de entrega',
    example: 'Av. Principal 123, Miraflores',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Ciudad de entrega',
    example: 'Lima',
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Estado o región de entrega',
    example: 'Lima',
  })
  @IsNotEmpty()
  @IsString()
  stateAddress: string;

  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'Juan Pérez García',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'Precio final de la orden',
    example: '999.99',
  })
  @IsNotEmpty()
  @IsString()
  finalPrice: string;
}

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Estado de la orden',
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus?: OrderStatus;

  @ApiPropertyOptional({
    description: 'ID del producto que se está ordenando',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiPropertyOptional({
    description: 'Número de teléfono del cliente',
    example: '+51999888777',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Dirección de entrega',
    example: 'Av. Secundaria 456, San Isidro',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Ciudad de entrega',
    example: 'Arequipa',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'Estado o región de entrega',
    example: 'Arequipa',
  })
  @IsOptional()
  @IsString()
  stateAddress?: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del cliente',
    example: 'María García López',
  })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional({
    description: 'Precio final de la orden',
    example: '1299.50',
  })
  @IsOptional()
  @IsString()
  finalPrice?: string;
}
