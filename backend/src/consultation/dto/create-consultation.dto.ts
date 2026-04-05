import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConsultationDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@company.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Acme Security Ltd.' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: '+880 1XX-XXXXXXX' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Penetration Testing' })
  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @ApiPropertyOptional({ example: '100k-200k' })
  @IsString()
  @IsOptional()
  budget?: string;

  @ApiPropertyOptional({ example: '2-3-months' })
  @IsString()
  @IsOptional()
  timeline?: string;

  @ApiProperty({
    example:
      'We need an external and internal penetration test before compliance review in Q3.',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
