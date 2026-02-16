import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CareerService } from './career.service';
import {
  CreateCareerDto,
  UpdateCareerDto,
  FilterCareerDto,
  CreateApplicationDto,
  UpdateApplicationDto,
  FilterApplicationDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('career')
@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  // Career Endpoints
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new career position (Admin only)' })
  @ApiResponse({ status: 201, description: 'Career created successfully' })
  @HttpCode(HttpStatus.CREATED)
  createCareer(@Body() createCareerDto: CreateCareerDto) {
    return this.careerService.createCareer(createCareerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all career positions with filters' })
  @ApiResponse({ status: 200, description: 'Returns all career positions' })
  findAllCareers(@Query() filterDto: FilterCareerDto) {
    return this.careerService.findAllCareers(filterDto);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get career statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns career statistics' })
  getCareerStats() {
    return this.careerService.getCareerStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get career position by ID' })
  @ApiResponse({ status: 200, description: 'Returns career position' })
  @ApiResponse({ status: 404, description: 'Career not found' })
  findOneCareer(@Param('id') id: string) {
    return this.careerService.findOneCareer(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update career position (Admin only)' })
  @ApiResponse({ status: 200, description: 'Career updated successfully' })
  @ApiResponse({ status: 404, description: 'Career not found' })
  updateCareer(
    @Param('id') id: string,
    @Body() updateCareerDto: UpdateCareerDto,
  ) {
    return this.careerService.updateCareer(id, updateCareerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete career position (Admin only)' })
  @ApiResponse({ status: 204, description: 'Career deleted successfully' })
  @ApiResponse({ status: 404, description: 'Career not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeCareer(@Param('id') id: string) {
    return this.careerService.removeCareer(id);
  }

  // Application Endpoints
  @Post('applications')
  @UseInterceptors(FileInterceptor('resume'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Submit a job application' })
  @ApiResponse({ status: 201, description: 'Application submitted successfully' })
  @ApiResponse({ status: 404, description: 'Career not found' })
  @HttpCode(HttpStatus.CREATED)
  createApplication(
    @Body('careerId') careerId: string,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('phone') phone: string,
    @Body('experience') experience: string,
    @Body('coverLetter') coverLetter: string,
    @UploadedFile() resume?: Express.Multer.File,
  ) {
    const createApplicationDto: CreateApplicationDto = {
      careerId,
      name,
      email,
      phone,
      experience,
      coverLetter,
    };
    return this.careerService.createApplication(createApplicationDto, resume);
  }

  @Get('applications/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all applications with filters (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all applications' })
  findAllApplications(@Query() filterDto: FilterApplicationDto) {
    return this.careerService.findAllApplications(filterDto);
  }

  @Get('applications/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get application statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns application statistics' })
  getApplicationStats() {
    return this.careerService.getApplicationStats();
  }

  @Get('applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get application by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns application' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  findOneApplication(@Param('id') id: string) {
    return this.careerService.findOneApplication(id);
  }

  @Patch('applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Application updated successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  updateApplication(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Request() req,
  ) {
    // Add reviewer info
    const updateData = {
      ...updateApplicationDto,
      reviewedBy: req.user?.userId || updateApplicationDto.reviewedBy,
    };
    return this.careerService.updateApplication(id, updateData);
  }

  @Delete('applications/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete application (Admin only)' })
  @ApiResponse({ status: 204, description: 'Application deleted successfully' })
  @ApiResponse({ status: 404, description: 'Application not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeApplication(@Param('id') id: string) {
    return this.careerService.removeApplication(id);
  }
}
