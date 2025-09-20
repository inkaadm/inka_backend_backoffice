import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class FileUploadService {
  private readonly uploadPath = 'uploads/products';

  constructor() {
    // Asegurar que el directorio de uploads existe
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists(): void {
    const fullPath = join(process.cwd(), this.uploadPath);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  }

  getMulterOptions() {
    return {
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          const uploadPath = join(process.cwd(), this.uploadPath);
          cb(null, uploadPath);
        },
        filename: (req: any, file: any, cb: any) => {
          // Generar un nombre único para el archivo
          const uniqueSuffix = uuidv4();
          const extension = extname(file.originalname);
          const filename = `${uniqueSuffix}${extension}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        // Validar que sea una imagen
        if (
          file.mimetype &&
          file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)
        ) {
          cb(null, true);
        } else {
          cb(
            new Error(
              'Solo se permiten archivos de imagen (jpg, jpeg, png, gif, webp)',
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
      },
    };
  }

  /**
   * Eliminar archivos de imagen del sistema de archivos
   */
  removeFiles(filenames: string[]): void {
    for (const filename of filenames) {
      try {
        const filePath = join(process.cwd(), this.uploadPath, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(`Error eliminando archivo ${filename}:`, error);
      }
    }
  }

  /**
   * Obtener la URL pública del archivo
   */
  getFileUrl(filename: string): string {
    return `/uploads/products/${filename}`;
  }

  /**
   * Verificar si un archivo existe
   */
  fileExists(filename: string): boolean {
    const filePath = join(process.cwd(), this.uploadPath, filename);
    return fs.existsSync(filePath);
  }

  /**
   * Obtener las URLs completas de las imágenes
   */
  getImageUrls(filenames: string[]): string[] {
    return filenames.map((filename) => this.getFileUrl(filename));
  }

  /**
   * Convertir imagen a base64
   */
  getImageAsBase64(filename: string): string | null {
    try {
      const filePath = join(process.cwd(), this.uploadPath, filename);
      if (fs.existsSync(filePath)) {
        const imageBuffer = fs.readFileSync(filePath);
        const base64 = imageBuffer.toString('base64');
        const extension = extname(filename).toLowerCase();

        // Determinar el MIME type basado en la extensión
        let mimeType = 'image/jpeg'; // default
        switch (extension) {
          case '.png':
            mimeType = 'image/png';
            break;
          case '.gif':
            mimeType = 'image/gif';
            break;
          case '.webp':
            mimeType = 'image/webp';
            break;
          case '.jpg':
          case '.jpeg':
            mimeType = 'image/jpeg';
            break;
        }

        return `data:${mimeType};base64,${base64}`;
      }
      return null;
    } catch (error) {
      console.error(`Error convirtiendo imagen ${filename} a base64:`, error);
      return null;
    }
  }

  /**
   * Convertir múltiples imágenes a base64
   */
  getImagesAsBase64(filenames: string[]): string[] {
    return filenames
      .map((filename) => this.getImageAsBase64(filename))
      .filter((base64) => base64 !== null);
  }
}
