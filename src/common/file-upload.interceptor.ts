import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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

    const result = filesInterceptor.intercept(context, next);

    if (result instanceof Observable) {
      return result;
    }

    return from(result).pipe(switchMap((obs: Observable<any>) => obs));
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

    const result = fileInterceptor.intercept(context, next);

    if (result instanceof Observable) {
      return result;
    }

    return from(result).pipe(switchMap((obs: Observable<any>) => obs));
  }
}
