import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { EmailTemplateType } from './create-email-template.dto';

export class FilterEmailTemplateDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: EmailTemplateType })
  @IsEnum(EmailTemplateType)
  @IsOptional()
  type?: EmailTemplateType;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
