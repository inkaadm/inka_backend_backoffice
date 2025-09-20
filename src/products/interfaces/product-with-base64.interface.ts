import { Product } from '../../entities/product.entity';

export interface ProductWithBase64 extends Product {
  imagesBase64?: string[];
}
