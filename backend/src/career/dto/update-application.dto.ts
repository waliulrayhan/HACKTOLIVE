import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateApplicationDto {
  @ApiPropertyOptional({ 
    example: 'REVIEWING', 
    enum: ['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED', 'REJECTED'] 
  })
  @IsEnum(['PENDING', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWED', 'ACCEPTED', 'REJECTED'])
  @IsOptional()
  status?: 'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'INTERVIEWED' | 'ACCEPTED' | 'REJECTED';

  @ApiPropertyOptional({ example: 'Great candidate, schedule for interview' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ example: 'admin-user-id' })
  @IsString()
  @IsOptional()
  reviewedBy?: string;
}
