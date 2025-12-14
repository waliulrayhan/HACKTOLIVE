import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '@prisma/client';

@ApiTags('student')
@ApiBearerAuth()
@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get student dashboard with stats' })
  getDashboard(@Request() req: any) {
    return this.studentService.getDashboard(req.user.id);
  }

  @Get('browse')
  @ApiOperation({ summary: 'Browse all available courses' })
  browseCourses(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('level') level?: string,
    @Query('tier') tier?: string,
  ) {
    return this.studentService.browseCourses({ search, category, level, tier });
  }

  @Get('courses')
  @ApiOperation({ summary: 'Get enrolled courses' })
  getEnrolledCourses(@Request() req: any) {
    return this.studentService.getEnrolledCourses(req.user.id);
  }

  @Get('courses/:courseId')
  @ApiOperation({ summary: 'Get course details with modules and lessons' })
  getCourseDetail(@Request() req: any, @Param('courseId') courseId: string) {
    return this.studentService.getCourseDetail(req.user.id, courseId);
  }

  @Get('courses/:courseId/progress')
  @ApiOperation({ summary: 'Get course progress' })
  getCourseProgress(@Request() req: any, @Param('courseId') courseId: string) {
    return this.studentService.getCourseProgress(req.user.id, courseId);
  }

  @Post('courses/:courseId/enroll')
  @ApiOperation({ summary: 'Enroll in a course' })
  enrollInCourse(@Request() req: any, @Param('courseId') courseId: string) {
    return this.studentService.enrollInCourse(req.user.id, courseId);
  }

  @Get('lessons/:lessonId')
  @ApiOperation({ summary: 'Get lesson details and content' })
  getLessonDetail(@Request() req: any, @Param('lessonId') lessonId: string) {
    return this.studentService.getLessonDetail(req.user.id, lessonId);
  }

  @Post('lessons/:lessonId/complete')
  @ApiOperation({ summary: 'Mark lesson as complete' })
  markLessonComplete(@Request() req: any, @Param('lessonId') lessonId: string) {
    return this.studentService.markLessonComplete(req.user.id, lessonId);
  }

  @Get('quizzes/:quizId')
  @ApiOperation({ summary: 'Get quiz with questions' })
  getQuiz(@Request() req: any, @Param('quizId') quizId: string) {
    return this.studentService.getQuiz(req.user.id, quizId);
  }

  @Post('quizzes/:quizId/submit')
  @ApiOperation({ summary: 'Submit quiz answers' })
  submitQuiz(
    @Request() req: any,
    @Param('quizId') quizId: string,
    @Body() answers: Record<string, string>,
  ) {
    return this.studentService.submitQuiz(req.user.id, quizId, answers);
  }

  @Get('quiz-attempts')
  @ApiOperation({ summary: 'Get all quiz attempts' })
  getQuizAttempts(@Request() req: any) {
    return this.studentService.getQuizAttempts(req.user.id);
  }

  @Get('assignments')
  @ApiOperation({ summary: 'Get all assignments for student' })
  getAllAssignments(@Request() req: any) {
    return this.studentService.getAllAssignments(req.user.id);
  }

  @Get('assignments/:assignmentId')
  @ApiOperation({ summary: 'Get assignment details' })
  getAssignment(
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.studentService.getAssignment(req.user.id, assignmentId);
  }

  @Get('assignments/:assignmentId/submission')
  @ApiOperation({ summary: 'Get assignment submission' })
  getAssignmentSubmission(
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.studentService.getAssignmentSubmission(req.user.id, assignmentId);
  }

  @Post('assignments/:assignmentId/submit')
  @ApiOperation({ summary: 'Submit assignment' })
  submitAssignment(
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
    @Body()
    data: {
      submissionText?: string;
      submissionUrl?: string;
    },
  ) {
    return this.studentService.submitAssignment(
      req.user.id,
      assignmentId,
      data,
    );
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get overall progress across all courses' })
  getOverallProgress(@Request() req: any) {
    return this.studentService.getOverallProgress(req.user.id);
  }

  @Get('certificates')
  @ApiOperation({ summary: 'Get earned certificates' })
  getCertificates(@Request() req: any) {
    return this.studentService.getCertificates(req.user.id);
  }

  @Post('courses/:courseId/review')
  @ApiOperation({ summary: 'Add review to a course' })
  addReview(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Body() data: { rating: number; comment?: string },
  ) {
    return this.studentService.addReview(
      req.user.id,
      courseId,
      data.rating,
      data.comment,
    );
  }
}
