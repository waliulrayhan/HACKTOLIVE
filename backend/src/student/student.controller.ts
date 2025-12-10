import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '@prisma/client';

@Controller('student')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.STUDENT)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get('dashboard')
  getDashboard(@Request() req: any) {
    return this.studentService.getDashboard(req.user.id);
  }

  @Get('courses')
  getEnrolledCourses(@Request() req: any) {
    return this.studentService.getEnrolledCourses(req.user.id);
  }

  @Get('courses/:courseId/progress')
  getCourseProgress(@Request() req: any, @Param('courseId') courseId: string) {
    return this.studentService.getCourseProgress(req.user.id, courseId);
  }

  @Post('lessons/:lessonId/complete')
  markLessonComplete(@Request() req: any, @Param('lessonId') lessonId: string) {
    return this.studentService.markLessonComplete(req.user.id, lessonId);
  }

  @Get('certificates')
  getCertificates(@Request() req: any) {
    return this.studentService.getCertificates(req.user.id);
  }

  @Get('quiz-attempts')
  getQuizAttempts(@Request() req: any) {
    return this.studentService.getQuizAttempts(req.user.id);
  }
}
