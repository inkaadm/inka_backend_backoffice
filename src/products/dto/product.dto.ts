import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'iPhone 15 Pro',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Smartphone Apple iPhone 15 Pro con tecnología avanzada',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'ID de la categoría a la que pertenece',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  categoryId: number;

  @ApiProperty({
    description: 'Precio del producto en la moneda base',
    example: 999,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Lista de características del producto',
    example: ['128GB', 'Cámara Pro', '5G'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({
    description: 'Cantidad disponible en stock',
    example: 50,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    description: 'URLs o nombres de las imágenes del producto',
    example: ['iphone15_1.jpg', 'iphone15_2.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nombre del producto',
    example: 'iPhone 15 Pro Max',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del producto',
    example: 'Smartphone Apple iPhone 15 Pro Max con pantalla más grande',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'ID de la categoría a la que pertenece',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Precio del producto en la moneda base',
    example: 1199,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiPropertyOptional({
    description: 'Lista de características del producto',
    example: ['256GB', 'Cámara Pro Max', '5G', 'Titanio'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({
    description: 'Cantidad disponible en stock',
    example: 25,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'URLs o nombres de las imágenes del producto',
    example: ['iphone15pro_1.jpg', 'iphone15pro_2.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
