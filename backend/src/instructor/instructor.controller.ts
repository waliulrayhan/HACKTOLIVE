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
    @Body() data: any,
  ) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    if (!instructor) {
      throw new Error('Instructor profile not found');
    }

    // Extract modules from data to handle separately
    const { modules, ...courseData } = data;

    // Prepare the course creation data with proper nested structure
    const createData: any = {
      ...courseData,
      instructor: {
        connect: { id: instructor.id },
      },
    };

    // If modules are provided, format them for Prisma nested create
    if (modules && Array.isArray(modules) && modules.length > 0) {
      createData.modules = {
        create: modules.map((module: any) => {
          const { lessons, ...moduleData } = module;
          
          const moduleCreate: any = {
            ...moduleData,
          };

          // If lessons are provided for this module, add them
          if (lessons && Array.isArray(lessons) && lessons.length > 0) {
            moduleCreate.lessons = {
              create: lessons,
            };
          }

          return moduleCreate;
        }),
      };
    }

    console.log('Creating course with data:', JSON.stringify(createData, null, 2));

    return this.prisma.course.create({
      data: createData,
      include: {
        modules: {
          include: {
            lessons: true,
          },
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

  @Post('courses/:courseId/publish')
  @ApiOperation({ summary: 'Publish a course' })
  async publishCourse(
    @Request() req: any,
    @Param('courseId') courseId: string,
  ) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    // Verify ownership and get course with modules/lessons
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor?.id,
      },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      throw new Error('Course not found or access denied');
    }

    // Validate course has content before publishing
    if (!course.modules || course.modules.length === 0) {
      throw new Error('Cannot publish course without modules');
    }

    const hasLessons = course.modules.some(
      (module) => module.lessons && module.lessons.length > 0,
    );

    if (!hasLessons) {
      throw new Error('Cannot publish course without lessons');
    }

    // Update course status to PUBLISHED
    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        status: 'PUBLISHED',
      },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
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

  // Module Management
  @Post('courses/:courseId/modules')
  @ApiOperation({ summary: 'Add a module to a course' })
  async addModule(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Body() data: any,
  ) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    // Verify course ownership
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor?.id,
      },
    });

    if (!course) {
      throw new Error('Course not found or access denied');
    }

    return this.prisma.courseModule.create({
      data: {
        ...data,
        courseId,
      },
      include: {
        lessons: true,
      },
    });
  }

  @Patch('courses/:courseId/modules/:moduleId')
  @ApiOperation({ summary: 'Update a module' })
  async updateModule(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() data: any,
  ) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    // Verify course ownership
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor?.id,
      },
    });

    if (!course) {
      throw new Error('Course not found or access denied');
    }

    return this.prisma.courseModule.update({
      where: { id: moduleId },
      data,
      include: {
        lessons: true,
      },
    });
  }

  @Delete('courses/:courseId/modules/:moduleId')
  @ApiOperation({ summary: 'Delete a module' })
  async deleteModule(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    // Verify course ownership
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor?.id,
      },
    });

    if (!course) {
      throw new Error('Course not found or access denied');
    }

    await this.prisma.courseModule.delete({
      where: { id: moduleId },
    });

    return { message: 'Module deleted successfully' };
  }

  // Lesson Management
  @Post('courses/:courseId/modules/:moduleId/lessons')
  @ApiOperation({ summary: 'Add a lesson to a module' })
  async addLesson(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() data: any,
  ) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    // Verify course ownership
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor?.id,
      },
    });

    if (!course) {
      throw new Error('Course not found or access denied');
    }

    return this.prisma.lesson.create({
      data: {
        ...data,
        moduleId,
      },
    });
  }

  @Patch('courses/:courseId/modules/:moduleId/lessons/:lessonId')
  @ApiOperation({ summary: 'Update a lesson' })
  async updateLesson(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('lessonId') lessonId: string,
    @Body() data: any,
  ) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    // Verify course ownership
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor?.id,
      },
    });

    if (!course) {
      throw new Error('Course not found or access denied');
    }

    return this.prisma.lesson.update({
      where: { id: lessonId },
      data,
    });
  }

  @Delete('courses/:courseId/modules/:moduleId/lessons/:lessonId')
  @ApiOperation({ summary: 'Delete a lesson' })
  async deleteLesson(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('lessonId') lessonId: string,
  ) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    // Verify course ownership
    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor?.id,
      },
    });

    if (!course) {
      throw new Error('Course not found or access denied');
    }

    await this.prisma.lesson.delete({
      where: { id: lessonId },
    });

    return { message: 'Lesson deleted successfully' };
  }
}
