import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateConsultationDto {
  @ApiPropertyOptional({ enum: ['PENDING', 'IN_REVIEW', 'CONTACTED', 'WON', 'CLOSED', 'SPAM'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
