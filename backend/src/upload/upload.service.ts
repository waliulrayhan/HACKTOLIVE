import { Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { Multer } from 'multer';

@Injectable()
export class UploadService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    // Ensure upload directories exist
    this.ensureUploadDirs();
  }

  private ensureUploadDirs() {
    const dirs = [
      this.uploadPath,
      path.join(this.uploadPath, 'avatars'),
      path.join(this.uploadPath, 'images'),
      path.join(this.uploadPath, 'documents'),
    ];

    dirs.forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  validateImageFile(file: any): void {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new BadRequestException('File size must not exceed 5MB');
    }

    // Check file type
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files (JPEG, PNG, GIF, WebP) are allowed');
    }
  }

  generateFileName(file: any, prefix = ''): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const ext = extname(file.originalname);
    return `${prefix}${timestamp}-${random}${ext}`;
  }

  getFileUrl(filename: string, folder = 'images'): string {
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? (process.env.API_URL || 'https://api.hacktolive.io')
      : '';
    
    return `${baseUrl}/uploads/${folder}/${filename}`;
  }

  deleteFile(filePath: string): boolean {
    try {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async uploadAvatar(file: any): Promise<string> {
    this.validateImageFile(file);
    const filename = this.generateFileName(file, 'avatar-');
    const filepath = path.join(this.uploadPath, 'avatars', filename);
    
    // Save file
    fs.writeFileSync(filepath, file.buffer);
    
    return this.getFileUrl(filename, 'avatars');
  }

  async uploadImage(file: any): Promise<string> {
    this.validateImageFile(file);
    const filename = this.generateFileName(file, 'img-');
    const filepath = path.join(this.uploadPath, 'images', filename);
    
    // Save file
    fs.writeFileSync(filepath, file.buffer);
    
    return this.getFileUrl(filename, 'images');
  }
}
