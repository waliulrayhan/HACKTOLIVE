import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+880 1XXX-XXXXXX' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Inquiry about courses' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'I would like to know more about your web development courses...' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
