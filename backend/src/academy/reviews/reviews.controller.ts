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
import { ReviewsService } from './reviews.service';
import { Prisma } from '@prisma/client';

@ApiTags('academy')
@Controller('academy/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: Prisma.ReviewCreateInput) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.reviewsService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('course/:courseId')
  findByCourse(@Param('courseId') courseId: string) {
    return this.reviewsService.findByCourse(courseId);
  }

  @Get('course/:courseId/stats')
  getCourseStats(@Param('courseId') courseId: string) {
    return this.reviewsService.getCourseRatingStats(courseId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: Prisma.ReviewUpdateInput,
  ) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
