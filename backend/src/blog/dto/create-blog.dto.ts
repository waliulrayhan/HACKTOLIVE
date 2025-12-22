import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, MaxLength, MinLength } from 'class-validator';
import { BlogCategory, BlogType, BlogStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateBlogDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  title: string;

  @IsString()
  @MinLength(3)
  slug: string;

  @IsOptional()
  @IsString()
  mainImage?: string;

  @IsString()
  @MinLength(10)
  metadata: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsEnum(BlogCategory)
  category: BlogCategory;

  @IsEnum(BlogType)
  blogType: BlogType;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : value)
  @IsString()
  authorName?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : value)
  @IsString()
  authorAvatar?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : value)
  @IsString()
  authorRole?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : value)
  @IsString()
  authorBio?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : value)
  @IsString()
  authorTwitter?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : value)
  @IsString()
  authorLinkedin?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null ? undefined : value)
  @IsString()
  authorGithub?: string;

  @IsOptional()
  @IsString()
  readTime?: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;
}
