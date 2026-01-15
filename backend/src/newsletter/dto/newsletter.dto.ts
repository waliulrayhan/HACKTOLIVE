import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class SubscribeNewsletterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ example: 'blog', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  source?: string;
}

export class UnsubscribeNewsletterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class CreateCampaignDto {
  @ApiProperty({ example: 'Monthly Security Update' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'Your Monthly Cybersecurity Digest' })
  @IsString()
  @MaxLength(500)
  subject: string;

  @ApiProperty({ example: '<html>...</html>' })
  @IsString()
  body: string;

  @ApiProperty({ example: ['cybersecurity', 'tutorials'], required: false })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  scheduledAt?: Date;
}

export class UpdateCampaignDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  subject?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  scheduledAt?: Date;
}
