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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { Prisma } from '@prisma/client';

@ApiTags('academy')
@Controller('academy/courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  create(@Body() createCourseDto: Prisma.CourseCreateInput) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('tier') tier?: string,
    @Query('search') search?: string,
  ) {
    if (search) {
      return this.coursesService.searchCourses(search);
    }

    const where: Prisma.CourseWhereInput = {};
    if (category) where.category = category as any;
    if (level) where.level = level as any;
    if (tier) where.tier = tier as any;

    return this.coursesService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('popular')
  getPopular(@Query('limit') limit?: string) {
    return this.coursesService.getPopularCourses(
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('featured')
  getFeatured(@Query('limit') limit?: string) {
    return this.coursesService.getFeaturedCourses(
      limit ? parseInt(limit) : 6,
    );
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: Prisma.CourseUpdateInput,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }

  @Post(':id/stats')
  updateStats(@Param('id') id: string) {
    return this.coursesService.updateCourseStats(id);
  }
}
