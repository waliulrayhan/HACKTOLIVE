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
import { InstructorsService } from './instructors.service';
import { Prisma } from '@prisma/client';

@Controller('academy/instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Post()
  create(@Body() createInstructorDto: Prisma.InstructorCreateInput) {
    return this.instructorsService.create(createInstructorDto);
  }

  @Get()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.instructorsService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      orderBy: { rating: 'desc' },
    });
  }

  @Get('top')
  getTop(@Query('limit') limit?: string) {
    return this.instructorsService.getTopInstructors(
      limit ? parseInt(limit) : 10,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.instructorsService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.instructorsService.findByUserId(parseInt(userId));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInstructorDto: Prisma.InstructorUpdateInput,
  ) {
    return this.instructorsService.update(id, updateInstructorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.instructorsService.remove(id);
  }

  @Post(':id/stats')
  updateStats(@Param('id') id: string) {
    return this.instructorsService.updateInstructorStats(id);
  }
}
