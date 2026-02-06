import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class CreateCareerDto {
  @ApiProperty({ example: 'Senior Penetration Tester' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Security Services' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({ example: 'Dhaka, Bangladesh' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 'Full-time' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '3-5 years' })
  @IsString()
  @IsNotEmpty()
  experience: string;

  @ApiProperty({ example: '80,000 - 120,000 BDT' })
  @IsString()
  @IsNotEmpty()
  salary: string;

  @ApiProperty({ example: 'Lead penetration testing engagements for web applications, mobile apps, and network infrastructure.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    example: '["Bachelor\'s degree in Computer Science", "OSCP, CEH, or equivalent certification"]',
    description: 'JSON string array of requirements'
  })
  @IsString()
  @IsNotEmpty()
  requirements: string;

  @ApiPropertyOptional({ 
    example: '["Conduct penetration tests", "Mentor junior team members"]',
    description: 'JSON string array of responsibilities'
  })
  @IsString()
  @IsOptional()
  responsibilities?: string;

  @ApiPropertyOptional({ 
    example: '["Competitive salary", "Health insurance", "Flexible hours"]',
    description: 'JSON string array of benefits'
  })
  @IsString()
  @IsOptional()
  benefits?: string;

  @ApiPropertyOptional({ example: 'FiShield' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 'ACTIVE', enum: ['ACTIVE', 'CLOSED', 'DRAFT'] })
  @IsEnum(['ACTIVE', 'CLOSED', 'DRAFT'])
  @IsOptional()
  status?: 'ACTIVE' | 'CLOSED' | 'DRAFT';

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}
