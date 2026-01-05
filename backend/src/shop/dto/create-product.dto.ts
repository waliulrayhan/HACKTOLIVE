import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, IsArray, Min } from 'class-validator';

export enum ProductType {
  COURSE_VOUCHER = 'COURSE_VOUCHER',
  TSHIRT = 'TSHIRT',
  MERCHANDISE = 'MERCHANDISE',
  TRAINING_BUNDLE = 'TRAINING_BUNDLE',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  categoryId: string;

  @IsEnum(ProductType)
  type: ProductType;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  compareAtPrice?: number;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsArray()
  images: string[];

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsNumber()
  @IsOptional()
  lowStockThreshold?: number;

  @IsBoolean()
  @IsOptional()
  trackInventory?: boolean;

  @IsBoolean()
  @IsOptional()
  allowBackorder?: boolean;

  @IsNumber()
  @IsOptional()
  weight?: number;

  @IsOptional()
  dimensions?: { length: number; width: number; height: number };

  // For course vouchers
  @IsString()
  @IsOptional()
  courseId?: string;

  @IsNumber()
  @IsOptional()
  voucherDuration?: number;

  // For merchandise
  @IsArray()
  @IsOptional()
  sizes?: string[];

  @IsArray()
  @IsOptional()
  colors?: string[];

  @IsString()
  @IsOptional()
  material?: string;

  // For bundles
  @IsArray()
  @IsOptional()
  bundleProducts?: string[];

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsString()
  @IsOptional()
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDescription?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
