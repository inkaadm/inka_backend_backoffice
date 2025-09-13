import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { FileUploadService } from './file-upload.service';

@Injectable()
export class ProductImageInterceptor implements NestInterceptor {
  constructor(private readonly fileUploadService: FileUploadService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const filesInterceptor = new (FilesInterceptor(
      'images',
      5,
      this.fileUploadService.getMulterOptions(),
    ))();
    return filesInterceptor.intercept(context, next);
  }
}

@Injectable()
export class SingleProductImageInterceptor implements NestInterceptor {
  constructor(private readonly fileUploadService: FileUploadService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const fileInterceptor = new (FileInterceptor(
      'image',
      this.fileUploadService.getMulterOptions(),
    ))();
    return fileInterceptor.intercept(context, next);
  }
}
