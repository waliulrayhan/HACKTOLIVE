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
import { InstructorService } from './instructor.service';

@ApiTags('instructor')
@ApiBearerAuth()
@Controller('instructor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
export class InstructorController {
  constructor(
    private prisma: PrismaService,
    private instructorService: InstructorService,
  ) {}

  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    let instructor = await this.prisma.instructor.findUnique({
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

    // Auto-create instructor record if missing
    if (!instructor) {
      instructor = await this.prisma.instructor.create({
        data: {
          userId: req.user.id,
          skills: JSON.stringify([]),
        },
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
    }

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
    let instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    // Auto-create instructor record if missing
    if (!instructor) {
      instructor = await this.prisma.instructor.create({
        data: {
          userId: req.user.id,
          skills: JSON.stringify([]),
        },
      });
    }

    const courses = await this.prisma.course.findMany({
      where: { instructorId: instructor.id },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                _count: {
                  select: {
                    quizzes: true,
                    assignments: true,
                    resources: true,
                  },
                },
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
            modules: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate content statistics for each course
    return courses.map(course => {
      let totalLessons = 0;
      let totalQuizzes = 0;
      let totalAssignments = 0;
      let totalResources = 0;

      course.modules.forEach(module => {
        totalLessons += module.lessons.length;
        module.lessons.forEach(lesson => {
          totalQuizzes += lesson._count?.quizzes || 0;
          totalAssignments += lesson._count?.assignments || 0;
          totalResources += lesson._count?.resources || 0;
        });
      });

      return {
        ...course,
        contentStats: {
          lessons: totalLessons,
          quizzes: totalQuizzes,
          assignments: totalAssignments,
          resources: totalResources,
        },
      };
    });
  }

  @Get('courses/:courseId')
  async getCourse(@Request() req: any, @Param('courseId') courseId: string) {
    let instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    // Auto-create instructor record if missing
    if (!instructor) {
      instructor = await this.prisma.instructor.create({
        data: {
          userId: req.user.id,
          skills: JSON.stringify([]),
        },
      });
    }

    return this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor.id,
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
                assignments: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
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
    let instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    // Auto-create instructor record if missing
    if (!instructor) {
      instructor = await this.prisma.instructor.create({
        data: {
          userId: req.user.id,
          skills: JSON.stringify([]),
        },
      });
    }

    if (!instructor) {
      throw new Error('Instructor profile not found');
    }

    // Extract modules from data to handle separately
    const { modules, ...courseData } = data;

    // Convert date strings to ISO-8601 DateTime if present, or null if empty
    if (courseData.startDate !== undefined) {
      if (courseData.startDate && typeof courseData.startDate === 'string' && courseData.startDate.trim() !== '') {
        courseData.startDate = new Date(courseData.startDate).toISOString();
      } else {
        courseData.startDate = null;
      }
    }
    if (courseData.endDate !== undefined) {
      if (courseData.endDate && typeof courseData.endDate === 'string' && courseData.endDate.trim() !== '') {
        courseData.endDate = new Date(courseData.endDate).toISOString();
      } else {
        courseData.endDate = null;
      }
    }

    // Convert empty strings to null for optional fields
    if (courseData.liveSchedule === '') {
      courseData.liveSchedule = null;
    }
    if (courseData.meetingLink === '') {
      courseData.meetingLink = null;
    }

    // Convert numeric fields to proper types
    if (courseData.price !== undefined) {
      courseData.price = parseFloat(courseData.price as any) || 0;
    }
    if (courseData.duration !== undefined) {
      courseData.duration = parseInt(courseData.duration as any) || 0;
    }
    if (courseData.maxStudents !== undefined && courseData.maxStudents !== null) {
      courseData.maxStudents = parseInt(courseData.maxStudents as any) || null;
    }

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

    // Convert date strings to ISO-8601 DateTime and numeric fields to proper types
    const processedData: any = { ...data };
    
    // Handle date fields - convert valid dates to ISO-8601, empty strings to null
    if (processedData.startDate !== undefined) {
      if (processedData.startDate && typeof processedData.startDate === 'string' && processedData.startDate.trim() !== '') {
        processedData.startDate = new Date(processedData.startDate).toISOString();
      } else {
        processedData.startDate = null;
      }
    }
    if (processedData.endDate !== undefined) {
      if (processedData.endDate && typeof processedData.endDate === 'string' && processedData.endDate.trim() !== '') {
        processedData.endDate = new Date(processedData.endDate).toISOString();
      } else {
        processedData.endDate = null;
      }
    }

    // Handle optional string fields for live courses - convert empty strings to null
    if (processedData.liveSchedule !== undefined && (!processedData.liveSchedule || processedData.liveSchedule.trim() === '')) {
      processedData.liveSchedule = null;
    }
    if (processedData.meetingLink !== undefined && (!processedData.meetingLink || processedData.meetingLink.trim() === '')) {
      processedData.meetingLink = null;
    }

    // Convert numeric fields to proper types
    if (processedData.price !== undefined) {
      processedData.price = parseFloat(processedData.price) || 0;
    }
    if (processedData.duration !== undefined) {
      processedData.duration = parseInt(processedData.duration) || 0;
    }
    if (processedData.maxStudents !== undefined && processedData.maxStudents !== null) {
      processedData.maxStudents = parseInt(processedData.maxStudents) || null;
    }

    return this.prisma.course.update({
      where: { id: courseId },
      data: processedData,
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
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
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

    const module = await this.prisma.courseModule.create({
      data: {
        ...data,
        courseId,
      },
      include: {
        lessons: true,
      },
    });

    // Update course totalModules count
    const totalModules = await this.prisma.courseModule.count({
      where: { courseId },
    });
    await this.prisma.course.update({
      where: { id: courseId },
      data: { totalModules },
    });

    return module;
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

    // Update course totalModules and totalLessons counts
    const totalModules = await this.prisma.courseModule.count({
      where: { courseId },
    });
    const modules = await this.prisma.courseModule.findMany({
      where: { courseId },
      include: { lessons: true },
    });
    const totalLessons = modules.reduce(
      (sum, mod) => sum + mod.lessons.length,
      0,
    );
    await this.prisma.course.update({
      where: { id: courseId },
      data: { totalModules, totalLessons },
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

    const lesson = await this.prisma.lesson.create({
      data: {
        ...data,
        moduleId,
      },
    });

    // Update course totalLessons count
    const modules = await this.prisma.courseModule.findMany({
      where: { courseId },
      include: { lessons: true },
    });
    const totalLessons = modules.reduce(
      (sum, mod) => sum + mod.lessons.length,
      0,
    );
    await this.prisma.course.update({
      where: { id: courseId },
      data: { totalLessons },
    });

    return lesson;
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

    // Update course totalLessons count
    const modules = await this.prisma.courseModule.findMany({
      where: { courseId },
      include: { lessons: true },
    });
    const totalLessons = modules.reduce(
      (sum, mod) => sum + mod.lessons.length,
      0,
    );
    await this.prisma.course.update({
      where: { id: courseId },
      data: { totalLessons },
    });

    return { message: 'Lesson deleted successfully' };
  }

  // Profile Management
  @Get('profile')
  @ApiOperation({ summary: 'Get instructor profile' })
  async getProfile(@Request() req: any) {
    return this.instructorService.getProfile(req.user.id);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update instructor profile' })
  async updateProfile(@Request() req: any, @Body() data: Prisma.InstructorUpdateInput) {
    return this.instructorService.updateProfile(req.user.id, data);
  }

  // Quiz Management
  @Post('lessons/:lessonId/quizzes')
  @ApiOperation({ summary: 'Create a quiz for a lesson' })
  async createQuiz(
    @Request() req: any,
    @Param('lessonId') lessonId: string,
    @Body() data: any,
  ) {
    return this.instructorService.createQuiz(req.user.id, lessonId, data);
  }

  @Patch('quizzes/:quizId')
  @ApiOperation({ summary: 'Update a quiz' })
  async updateQuiz(
    @Request() req: any,
    @Param('quizId') quizId: string,
    @Body() data: any,
  ) {
    return this.instructorService.updateQuiz(req.user.id, quizId, data);
  }

  @Delete('quizzes/:quizId')
  @ApiOperation({ summary: 'Delete a quiz' })
  async deleteQuiz(@Request() req: any, @Param('quizId') quizId: string) {
    return this.instructorService.deleteQuiz(req.user.id, quizId);
  }

  @Post('quizzes/:quizId/questions')
  @ApiOperation({ summary: 'Add a question to a quiz' })
  async addQuizQuestion(
    @Request() req: any,
    @Param('quizId') quizId: string,
    @Body() data: any,
  ) {
    return this.instructorService.addQuizQuestion(req.user.id, quizId, data);
  }

  @Patch('quiz-questions/:questionId')
  @ApiOperation({ summary: 'Update a quiz question' })
  async updateQuizQuestion(
    @Request() req: any,
    @Param('questionId') questionId: string,
    @Body() data: any,
  ) {
    return this.instructorService.updateQuizQuestion(req.user.id, questionId, data);
  }

  @Delete('quiz-questions/:questionId')
  @ApiOperation({ summary: 'Delete a quiz question' })
  async deleteQuizQuestion(
    @Request() req: any,
    @Param('questionId') questionId: string,
  ) {
    return this.instructorService.deleteQuizQuestion(req.user.id, questionId);
  }

  // Assignment Management
  @Get('assignments')
  @ApiOperation({ summary: 'Get all assignments for instructor courses' })
  async getAllAssignments(@Request() req: any) {
    return this.instructorService.getAllAssignments(req.user.id);
  }

  @Get('assignments/pending')
  @ApiOperation({ summary: 'Get pending assignment submissions' })
  async getPendingSubmissions(@Request() req: any) {
    return this.instructorService.getPendingSubmissions(req.user.id);
  }

  @Post('lessons/:lessonId/assignments')
  @ApiOperation({ summary: 'Create an assignment for a lesson' })
  async createAssignment(
    @Request() req: any,
    @Param('lessonId') lessonId: string,
    @Body() data: any,
  ) {
    return this.instructorService.createAssignment(req.user.id, lessonId, data);
  }

  @Patch('assignments/:assignmentId')
  @ApiOperation({ summary: 'Update an assignment' })
  async updateAssignment(
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
    @Body() data: any,
  ) {
    return this.instructorService.updateAssignment(req.user.id, assignmentId, data);
  }

  @Delete('assignments/:assignmentId')
  @ApiOperation({ summary: 'Delete an assignment' })
  async deleteAssignment(
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.instructorService.deleteAssignment(req.user.id, assignmentId);
  }

  @Get('assignments/:assignmentId/submissions')
  @ApiOperation({ summary: 'Get all submissions for an assignment' })
  async getAssignmentSubmissions(
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.instructorService.getAssignmentSubmissions(req.user.id, assignmentId);
  }

  @Post('submissions/:submissionId/grade')
  @ApiOperation({ summary: 'Grade an assignment submission' })
  async gradeSubmission(
    @Request() req: any,
    @Param('submissionId') submissionId: string,
    @Body() data: { score: number; feedback?: string },
  ) {
    return this.instructorService.gradeSubmission(
      req.user.id,
      submissionId,
      data.score,
      data.feedback,
    );
  }

  // Lesson Resources
  @Post('lessons/:lessonId/resources')
  @ApiOperation({ summary: 'Add a resource to a lesson' })
  async addLessonResource(
    @Request() req: any,
    @Param('lessonId') lessonId: string,
    @Body() data: any,
  ) {
    return this.instructorService.addLessonResource(req.user.id, lessonId, data);
  }

  @Patch('resources/:resourceId')
  @ApiOperation({ summary: 'Update a lesson resource' })
  async updateLessonResource(
    @Request() req: any,
    @Param('resourceId') resourceId: string,
    @Body() data: any,
  ) {
    return this.instructorService.updateLessonResource(req.user.id, resourceId, data);
  }

  @Delete('resources/:resourceId')
  @ApiOperation({ summary: 'Delete a lesson resource' })
  async deleteLessonResource(
    @Request() req: any,
    @Param('resourceId') resourceId: string,
  ) {
    return this.instructorService.deleteLessonResource(req.user.id, resourceId);
  }

  // Certificate Management
  @Get('certificates/pending')
  @ApiOperation({ summary: 'Get pending certificate requests' })
  async getPendingCertificateRequests(@Request() req: any) {
    return this.instructorService.getPendingCertificateRequests(req.user.id);
  }

  @Get('certificates')
  @ApiOperation({ summary: 'Get all certificate requests' })
  async getAllCertificateRequests(@Request() req: any, @Param('status') status?: string) {
    return this.instructorService.getAllCertificateRequests(req.user.id, status);
  }

  @Get('certificates/:certificateId/performance')
  @ApiOperation({ summary: 'Get student performance for certificate review' })
  async getStudentPerformance(
    @Request() req: any,
    @Param('certificateId') certificateId: string,
  ) {
    return this.instructorService.getStudentPerformanceForCertificate(
      req.user.id,
      certificateId,
    );
  }

  @Post('certificates/:certificateId/issue')
  @ApiOperation({ summary: 'Issue a certificate' })
  async issueCertificate(
    @Request() req: any,
    @Param('certificateId') certificateId: string,
  ) {
    return this.instructorService.issueCertificate(req.user.id, certificateId);
  }

  @Post('certificates/:certificateId/reject')
  @ApiOperation({ summary: 'Reject a certificate request' })
  async rejectCertificate(
    @Request() req: any,
    @Param('certificateId') certificateId: string,
  ) {
    return this.instructorService.rejectCertificate(req.user.id, certificateId);
  }

  // Student Progress
  @Get('courses/:courseId/students/:studentId/progress')
  @ApiOperation({ summary: 'Get detailed student progress for a course' })
  async getStudentCourseProgress(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.instructorService.getStudentCourseProgress(
      req.user.id,
      courseId,
      studentId,
    );
  }
}