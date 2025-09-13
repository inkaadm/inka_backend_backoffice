import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { FileUploadService } from '../common/file-upload.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private fileUploadService: FileUploadService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    imageFiles?: Express.Multer.File[],
  ): Promise<Product> {
    const productData = { ...createProductDto };

    // Si hay archivos de imagen, agregar sus nombres al producto
    if (imageFiles && imageFiles.length > 0) {
      productData.images = imageFiles.map((file) => file.filename);
    }

    const product = this.productsRepository.create(productData);
    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      relations: ['category', 'orders'],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'orders'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { categoryId },
      relations: ['category', 'orders'],
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    imageFiles?: Express.Multer.File[],
  ): Promise<Product> {
    const product = await this.findOne(id);
    const oldImages = [...(product.images || [])];

    // Actualizar los datos del producto
    Object.assign(product, updateProductDto);

    // Si hay nuevas imágenes, reemplazar las existentes
    if (imageFiles && imageFiles.length > 0) {
      product.images = imageFiles.map((file) => file.filename);

      // Eliminar las imágenes anteriores del sistema de archivos
      if (oldImages.length > 0) {
        this.fileUploadService.removeFiles(oldImages);
      }
    }

    return await this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);

    // Eliminar las imágenes del sistema de archivos
    if (product.images && product.images.length > 0) {
      this.fileUploadService.removeFiles(product.images);
    }

    await this.productsRepository.remove(product);
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock += quantity;
    return await this.productsRepository.save(product);
  }
}
