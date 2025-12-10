import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { Prisma } from '@prisma/client';

@ApiTags('academy')
@Controller('academy/enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(@Body() createEnrollmentDto: Prisma.EnrollmentCreateInput) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: string,
  ) {
    const where: Prisma.EnrollmentWhereInput = {};
    if (status) where.status = status as any;

    return this.enrollmentsService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      where,
      orderBy: { enrolledAt: 'desc' },
    });
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.enrollmentsService.findByStudent(studentId);
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.enrollmentsService.findByCourse(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Get(':id/progress')
  getProgress(@Param('id') id: string) {
    return this.enrollmentsService.getEnrollmentProgress(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnrollmentDto: Prisma.EnrollmentUpdateInput,
  ) {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @Patch(':id/progress')
  updateProgress(
    @Param('id') id: string,
    @Body('progress') progress: number,
  ) {
    return this.enrollmentsService.updateProgress(id, progress);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(id);
  }
}
