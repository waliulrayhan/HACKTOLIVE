import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ example: 'career-id-uuid' })
  @IsString()
  @IsNotEmpty()
  careerId: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+880 1XXX-XXXXXX' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional({ example: '3 years' })
  @IsString()
  @IsOptional()
  experience?: string;

  @ApiPropertyOptional({ example: '/uploads/resumes/resume.pdf' })
  @IsString()
  @IsOptional()
  resumeUrl?: string;

  @ApiProperty({ example: 'I am interested in this position because...' })
  @IsString()
  @IsNotEmpty()
  coverLetter: string;
}
