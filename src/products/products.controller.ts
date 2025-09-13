import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { FileUploadService } from '../common/file-upload.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req: any, file: any, cb: any) => {
          const extension = extname(file.originalname);
          const filename = `${uuidv4()}${extension}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        if (
          file.mimetype &&
          file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)
        ) {
          cb(null, true);
        } else {
          cb(new Error('Solo se permiten archivos de imagen'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @ApiOperation({ summary: 'Crear un nuevo producto con imágenes' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos del producto e imágenes',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'iPhone 15 Pro' },
        description: {
          type: 'string',
          example: 'Smartphone Apple iPhone 15 Pro con tecnología avanzada',
        },
        categoryId: { type: 'string', example: '1' },
        price: { type: 'string', example: '999' },
        features: {
          type: 'string',
          example: '["128GB", "Cámara Pro", "5G"]',
          description: 'JSON string del array de características',
        },
        stock: { type: 'string', example: '50' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Archivos de imagen del producto (máximo 5)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(
    @Body() createProductDto: any,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    try {
      // Validar y parsear datos del formulario
      const productData: CreateProductDto = {
        name: createProductDto.name as string,
        description: createProductDto.description as string,
        categoryId: parseInt(createProductDto.categoryId as string, 10),
        price: parseFloat(createProductDto.price as string),
        features: JSON.parse(
          (createProductDto.features as string) || '[]',
        ) as string[],
        stock: parseInt(createProductDto.stock as string, 10),
        images: [],
      };

      return await this.productsService.create(productData, images);
    } catch (error) {
      // Si hay error y se subieron archivos, eliminarlos
      if (images && images.length > 0) {
        this.fileUploadService.removeFiles(images.map((file) => file.filename));
      }
      throw new BadRequestException(
        'Error al crear el producto: ' + (error as Error).message,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filtrar por ID de categoría',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
  })
  findAll(@Query('categoryId') categoryId?: string) {
    if (categoryId) {
      return this.productsService.findByCategory(parseInt(categoryId));
    }
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 1 })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req: any, file: any, cb: any) => {
          const extension = extname(file.originalname);
          const filename = `${uuidv4()}${extension}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        if (
          file.mimetype &&
          file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)
        ) {
          cb(null, true);
        } else {
          cb(new Error('Solo se permiten archivos de imagen'), false);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @ApiOperation({ summary: 'Actualizar un producto con nuevas imágenes' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID del producto', example: 1 })
  @ApiBody({
    description: 'Datos del producto e imágenes opcionales',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'iPhone 15 Pro Max' },
        description: {
          type: 'string',
          example: 'Smartphone Apple iPhone 15 Pro Max con pantalla más grande',
        },
        categoryId: { type: 'string', example: '2' },
        price: { type: 'string', example: '1199' },
        features: {
          type: 'string',
          example: '["256GB", "Cámara Pro Max", "5G", "Titanio"]',
          description: 'JSON string del array de características',
        },
        stock: { type: 'string', example: '25' },
        images: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Nuevas imágenes del producto (opcional)',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: any,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    try {
      const productData: UpdateProductDto = {};

      if (updateProductDto.name) {
        productData.name = updateProductDto.name as string;
      }
      if (updateProductDto.description) {
        productData.description = updateProductDto.description as string;
      }
      if (updateProductDto.categoryId) {
        productData.categoryId = parseInt(
          updateProductDto.categoryId as string,
          10,
        );
      }
      if (updateProductDto.price) {
        productData.price = parseFloat(updateProductDto.price as string);
      }
      if (updateProductDto.features) {
        productData.features = JSON.parse(
          updateProductDto.features as string,
        ) as string[];
      }
      if (updateProductDto.stock) {
        productData.stock = parseInt(updateProductDto.stock as string, 10);
      }

      return await this.productsService.update(id, productData, images);
    } catch (error) {
      // Si hay error y se subieron archivos, eliminarlos
      if (images && images.length > 0) {
        this.fileUploadService.removeFiles(images.map((file) => file.filename));
      }
      throw new BadRequestException(
        'Error al actualizar el producto: ' + (error as Error).message,
      );
    }
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Actualizar stock de un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 1 })
  @ApiResponse({ status: 200, description: 'Stock actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity') quantity: number,
  ) {
    return this.productsService.updateStock(id, quantity);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto', example: 1 })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
