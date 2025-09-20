import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { FileUploadService } from '../common/file-upload.service';
import { ProductWithBase64 } from './interfaces/product-with-base64.interface';

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
    const products = await this.productsRepository.find({
      relations: ['category', 'orders'],
    });

    // Convertir imágenes a base64
    return products.map((product) => ({
      ...product,
      imagesBase64: product.images
        ? this.fileUploadService.getImagesAsBase64(product.images)
        : [],
    }));
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'orders'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Convertir imágenes a base64
    return {
      ...product,
      imagesBase64: product.images
        ? this.fileUploadService.getImagesAsBase64(product.images)
        : [],
    } as Product;
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    const products = await this.productsRepository.find({
      where: { categoryId },
      relations: ['category', 'orders'],
    });

    // Convertir imágenes a base64
    return products.map((product) => ({
      ...product,
      imagesBase64: product.images
        ? this.fileUploadService.getImagesAsBase64(product.images)
        : [],
    }));
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
