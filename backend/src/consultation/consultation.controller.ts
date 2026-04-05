import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { ConsultationService } from './consultation.service';
import {
  CreateConsultationDto,
  FilterConsultationDto,
  UpdateConsultationDto,
} from './dto';

@ApiTags('consultation')
@Controller('consultation')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit a service consultation request' })
  @ApiResponse({ status: 201, description: 'Consultation request submitted successfully' })
  createConsultation(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationService.createConsultation(createConsultationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all consultation requests (Admin)' })
  @ApiResponse({ status: 200, description: 'Returns consultation requests' })
  findAllConsultations(@Query() filterDto: FilterConsultationDto) {
    return this.consultationService.findAllConsultations(filterDto);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get consultation statistics (Admin)' })
  @ApiResponse({ status: 200, description: 'Returns consultation statistics' })
  getConsultationStats() {
    return this.consultationService.getConsultationStats();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update consultation status/notes (Admin)' })
  @ApiResponse({ status: 200, description: 'Consultation request updated successfully' })
  updateConsultation(
    @Param('id') id: string,
    @Body() updateConsultationDto: UpdateConsultationDto,
  ) {
    return this.consultationService.updateConsultation(id, updateConsultationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete consultation request (Admin)' })
  @ApiResponse({ status: 204, description: 'Consultation request deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteConsultation(@Param('id') id: string) {
    return this.consultationService.deleteConsultation(id);
  }
}
