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
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { QuizzesService } from './quizzes.service';
import { Prisma, UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';

@ApiTags('academy')
@Controller('academy/quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiBearerAuth()
  createQuiz(@Body() createQuizDto: Prisma.QuizCreateInput) {
    return this.quizzesService.createQuiz(createQuizDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  findAll(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.quizzesService.findAllQuizzes({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
  }

  @Get('lesson/:lessonId')
  findByLesson(@Param('lessonId') lessonId: string) {
    return this.quizzesService.findQuizzesByLesson(lessonId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesService.findQuiz(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateQuizDto: Prisma.QuizUpdateInput,
  ) {
    return this.quizzesService.updateQuiz(id, updateQuizDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.quizzesService.removeQuiz(id);
  }

  // Quiz Attempts
  @Post(':quizId/attempt')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  submitAttempt(
    @Param('quizId') quizId: string,
    @Body('studentId') studentId: string,
    @Body('answers') answers: any,
  ) {
    return this.quizzesService.submitQuizAttempt(quizId, studentId, answers);
  }

  @Get('attempts/student/:studentId')
  getStudentAttempts(@Param('studentId') studentId: string) {
    return this.quizzesService.findAttemptsByStudent(studentId);
  }

  @Get(':quizId/attempts')
  getQuizAttempts(@Param('quizId') quizId: string) {
    return this.quizzesService.findAttemptsByQuiz(quizId);
  }

  @Get(':quizId/progress/:studentId')
  getProgress(
    @Param('quizId') quizId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.quizzesService.getStudentQuizProgress(studentId, quizId);
  }
}
