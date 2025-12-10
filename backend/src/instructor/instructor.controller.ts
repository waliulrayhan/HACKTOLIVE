import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@ApiTags('instructor')
@ApiBearerAuth()
@Controller('instructor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
export class InstructorController {
  constructor(private prisma: PrismaService) {}

  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
      include: {
        courses: {
          include: {
            _count: {
              select: {
                enrollments: true,
                reviews: true,
              },
            },
          },
        },
      },
    });

    const totalStudents = instructor?.courses.reduce(
      (sum, course) => sum + course.totalStudents,
      0,
    ) || 0;

    const totalReviews = instructor?.courses.reduce(
      (sum, course) => sum + course.totalRatings,
      0,
    ) || 0;

    return {
      instructor,
      stats: {
        totalCourses: instructor?.courses.length || 0,
        totalStudents,
        averageRating: instructor?.rating || 0,
        totalReviews,
      },
    };
  }

  @Get('courses')
  async getMyCourses(@Request() req: any) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    return this.prisma.course.findMany({
      where: { instructorId: instructor?.id },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Get('courses/:courseId')
  async getCourse(@Request() req: any, @Param('courseId') courseId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    return this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor?.id,
      },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
                quizzes: {
                  include: {
                    questions: true,
                  },
                },
              },
            },
          },
        },
        enrollments: {
          include: {
            student: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  @Post('courses')
  async createCourse(
    @Request() req: any,
    @Body() data: Prisma.CourseCreateInput,
  ) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    return this.prisma.course.create({
      data: {
        ...data,
        instructor: {
          connect: { id: instructor?.id },
        },
      },
    });
  }

  @Patch('courses/:courseId')
  async updateCourse(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Body() data: Prisma.CourseUpdateInput,
  ) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    // Verify ownership
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor?.id,
      },
    });

    if (!course) {
      throw new Error('Course not found or access denied');
    }

    return this.prisma.course.update({
      where: { id: courseId },
      data,
    });
  }

  @Delete('courses/:courseId')
  async deleteCourse(@Request() req: any, @Param('courseId') courseId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor?.id,
      },
    });

    if (!course) {
      throw new Error('Course not found or access denied');
    }

    await this.prisma.course.delete({
      where: { id: courseId },
    });

    return { message: 'Course deleted successfully' };
  }

  @Get('students')
  async getMyStudents(@Request() req: any) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
      include: {
        courses: true,
      },
    });

    const courseIds = instructor?.courses.map((c) => c.id) || [];

    return this.prisma.enrollment.findMany({
      where: {
        courseId: {
          in: courseIds,
        },
      },
      include: {
        student: true,
        course: true,
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });
  }

  @Get('analytics')
  async getAnalytics(@Request() req: any) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
      include: {
        courses: {
          include: {
            enrollments: true,
            reviews: true,
          },
        },
      },
    });

    const enrollmentsByMonth = instructor?.courses
      .flatMap((c) => c.enrollments)
      .reduce((acc, enrollment) => {
        const month = new Date(enrollment.enrolledAt).toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

    const coursePerformance = instructor?.courses.map((course) => ({
      courseId: course.id,
      title: course.title,
      enrollments: course.enrollments.length,
      rating: course.rating,
      reviews: course.reviews.length,
      revenue: course.enrollments.length * course.price,
    })) || [];

    return {
      enrollmentsByMonth,
      coursePerformance,
      totalRevenue: coursePerformance.reduce((sum, c) => sum + c.revenue, 0),
    };
  }
}
