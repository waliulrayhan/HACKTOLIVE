import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}
