import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

export class InitiatePaymentDto {
  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  productId?: string;

  @IsNotEmpty()
  @IsString()
  customerName: string;

  @IsNotEmpty()
  @IsEmail()
  customerEmail: string;

  @IsNotEmpty()
  @IsString()
  customerPhone: string;

  @IsOptional()
  @IsString()
  customerAddress?: string;

  @IsOptional()
  @IsString()
  customerCity?: string;

  @IsOptional()
  @IsString()
  customerCountry?: string;
}
