import {
  BadRequestException,
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
import { getCourseFinalPrice } from '../utils/transform.util';
import {
  CreateCourseCouponDto,
  UpdateCourseCouponDto,
} from './dto/course-coupon.dto';

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

  private normalizeAndValidateCoursePricing(input: any, existingCourse?: any) {
    const normalized = { ...input };

    if (normalized.price !== undefined) {
      normalized.price = parseFloat(normalized.price as any) || 0;
    }
    if (normalized.discountedPrice !== undefined) {
      if (normalized.discountedPrice === null || normalized.discountedPrice === '') {
        normalized.discountedPrice = null;
      } else {
        normalized.discountedPrice = parseFloat(normalized.discountedPrice as any);
      }
    }
    if (normalized.discountPercentage !== undefined) {
      if (normalized.discountPercentage === null || normalized.discountPercentage === '') {
        normalized.discountPercentage = 0;
      } else {
        normalized.discountPercentage = parseFloat(normalized.discountPercentage as any) || 0;
      }
    }

    const effectiveTier = (normalized.tier ?? existingCourse?.tier ?? '').toUpperCase();
    const effectivePrice =
      normalized.price !== undefined
        ? normalized.price
        : Number(existingCourse?.price || 0);

    if (effectiveTier === 'FREE') {
      normalized.price = 0;
      normalized.discountedPrice = null;
      normalized.discountPercentage = 0;
      return normalized;
    }

    if (effectivePrice < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    if (effectiveTier === 'PREMIUM' && effectivePrice <= 0) {
      throw new BadRequestException('Premium courses must have a price greater than 0');
    }

    const effectiveDiscountPercentage =
      normalized.discountPercentage !== undefined
        ? Number(normalized.discountPercentage)
        : Number(existingCourse?.discountPercentage || 0);

    if (effectiveDiscountPercentage < 0 || effectiveDiscountPercentage > 100) {
      throw new BadRequestException('Discount percentage must be between 0 and 100');
    }

    const effectiveDiscountedPrice =
      normalized.discountedPrice !== undefined
        ? normalized.discountedPrice
        : existingCourse?.discountedPrice;

    if (effectiveDiscountedPrice !== null && effectiveDiscountedPrice !== undefined) {
      const numericDiscountedPrice = Number(effectiveDiscountedPrice);
      if (!Number.isFinite(numericDiscountedPrice) || numericDiscountedPrice < 0) {
        throw new BadRequestException('Discounted price must be a valid positive number');
      }
      if (numericDiscountedPrice > effectivePrice) {
        throw new BadRequestException('Discounted price cannot be greater than original price');
      }
    }

    return normalized;
  }

  private normalizeCourseCtaText(input: any, existingCourse?: any) {
    const normalized = { ...input };
    const allowedCta = new Set(['ENROLL_NOW', 'COMING_SOON']);

    const rawValue = (normalized.ctaText ?? existingCourse?.ctaText ?? 'ENROLL_NOW') as string;
    const ctaText = String(rawValue).toUpperCase().trim();

    if (!allowedCta.has(ctaText)) {
      throw new BadRequestException('Invalid CTA text. Allowed values: ENROLL_NOW, COMING_SOON');
    }

    normalized.ctaText = ctaText;
    return normalized;
  }

  private normalizeCouponPayload(payload: CreateCourseCouponDto | UpdateCourseCouponDto) {
    const normalized: any = { ...payload };

    const toNumberOrUndefined = (value: any) => {
      if (value === undefined) return undefined;
      if (value === null || value === '') return null;
      const num = Number(value);
      if (!Number.isFinite(num)) {
        throw new BadRequestException('Coupon numeric fields must be valid numbers');
      }
      return num;
    };

    if (normalized.code !== undefined) {
      normalized.code = String(normalized.code).trim().toUpperCase();
    }

    if (normalized.description !== undefined) {
      const description = String(normalized.description || '').trim();
      normalized.description = description.length > 0 ? description : null;
    }

    if (normalized.maxDiscountAmount === null || normalized.maxDiscountAmount === '') {
      normalized.maxDiscountAmount = null;
    }

    if (normalized.discountValue !== undefined) {
      normalized.discountValue = toNumberOrUndefined(normalized.discountValue);
      if (normalized.discountValue === null || normalized.discountValue <= 0) {
        throw new BadRequestException('Discount value must be greater than 0');
      }
    }

    if (normalized.maxDiscountAmount !== undefined) {
      normalized.maxDiscountAmount = toNumberOrUndefined(normalized.maxDiscountAmount);
      if (normalized.maxDiscountAmount !== null && normalized.maxDiscountAmount < 0) {
        throw new BadRequestException('Discount cap cannot be negative');
      }
    }

    if (normalized.minOrderAmount !== undefined) {
      normalized.minOrderAmount = toNumberOrUndefined(normalized.minOrderAmount);
      if (normalized.minOrderAmount !== null && normalized.minOrderAmount < 0) {
        throw new BadRequestException('Minimum order amount cannot be negative');
      }
    }

    if (normalized.perStudentLimit !== undefined) {
      normalized.perStudentLimit = toNumberOrUndefined(normalized.perStudentLimit);
      if (normalized.perStudentLimit !== null && normalized.perStudentLimit < 1) {
        throw new BadRequestException('Per student limit must be at least 1');
      }
    }

    if (normalized.usageLimit !== undefined) {
      normalized.usageLimit = toNumberOrUndefined(normalized.usageLimit);
      if (normalized.usageLimit !== null && normalized.usageLimit < 1) {
        throw new BadRequestException('Usage limit must be at least 1');
      }
    }

    if (normalized.usageLimit === null || normalized.usageLimit === '') {
      normalized.usageLimit = null;
    }

    if (normalized.startsAt === null || normalized.startsAt === '') {
      normalized.startsAt = null;
    } else if (normalized.startsAt) {
      normalized.startsAt = new Date(normalized.startsAt).toISOString();
    }

    if (normalized.expiresAt === null || normalized.expiresAt === '') {
      normalized.expiresAt = null;
    } else if (normalized.expiresAt) {
      normalized.expiresAt = new Date(normalized.expiresAt).toISOString();
    }

    if (
      normalized.startsAt &&
      normalized.expiresAt &&
      new Date(normalized.expiresAt).getTime() <= new Date(normalized.startsAt).getTime()
    ) {
      throw new BadRequestException('Coupon expiry date must be after start date');
    }

    if (normalized.discountType === 'PERCENTAGE' && normalized.discountValue > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100');
    }

    return normalized;
  }

  private async verifyInstructorCourseOwnership(req: any, courseId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor?.id,
      },
      select: {
        id: true,
        instructorId: true,
        title: true,
        price: true,
        discountedPrice: true,
        discountPercentage: true,
      },
    });

    if (!instructor || !course) {
      throw new BadRequestException('Course not found or access denied');
    }

    return { instructor, course };
  }

  private async getInstructorOrThrow(req: any) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId: req.user.id },
    });

    if (!instructor) {
      throw new BadRequestException('Instructor profile not found');
    }

    return instructor;
  }

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

  @Get('courses/:courseId/coupons')
  async getCourseCoupons(@Request() req: any, @Param('courseId') courseId: string) {
    const { instructor, course } = await this.verifyInstructorCourseOwnership(req, courseId);

    const coupons = await this.prisma.courseCoupon.findMany({
      where: {
        instructorId: instructor.id,
        courseId: course.id,
      },
      include: {
        _count: {
          select: {
            usages: true,
          },
        },
      },
      orderBy: [
        { isActive: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return coupons;
  }

  @Get('coupons')
  async getAllInstructorCoupons(@Request() req: any) {
    const instructor = await this.getInstructorOrThrow(req);

    const coupons = await this.prisma.courseCoupon.findMany({
      where: { instructorId: instructor.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        _count: {
          select: {
            usages: true,
          },
        },
      },
      orderBy: [
        { isActive: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // For all-course coupons, course is an internal anchor only and should not be exposed as scope.
    return coupons.map((coupon) => ({
      ...coupon,
      course: (coupon as any).applyToAllCourses ? null : coupon.course,
    }));
  }

  @Post('coupons')
  async createInstructorCoupons(
    @Request() req: any,
    @Body() payload: CreateCourseCouponDto,
  ) {
    const instructor = await this.getInstructorOrThrow(req);
    const normalized = this.normalizeCouponPayload(payload);

    const courses = await this.prisma.course.findMany({
      where: {
        instructorId: instructor.id,
      },
      select: {
        id: true,
        title: true,
        price: true,
        discountedPrice: true,
        discountPercentage: true,
      },
    });

    const paidCourses = courses.filter((course) => getCourseFinalPrice(course) > 0);

    if (paidCourses.length === 0) {
      throw new BadRequestException('No paid courses found to apply this coupon');
    }

    const targetCourse = paidCourses[0];

    const existingCoupon = await this.prisma.courseCoupon.findFirst({
      where: {
        instructorId: instructor.id,
        code: normalized.code,
      },
      select: {
        id: true,
      },
    });

    if (existingCoupon) {
      throw new BadRequestException('Coupon code already exists for your instructor profile');
    }

    const createdCoupon = await this.prisma.courseCoupon.create({
      data: {
        courseId: targetCourse.id,
        instructorId: instructor.id,
        applyToAllCourses: Boolean(normalized.applyToAllCourses),
        code: normalized.code,
        description: normalized.description ?? null,
        discountType: normalized.discountType,
        discountValue: normalized.discountValue,
        maxDiscountAmount: normalized.maxDiscountAmount ?? null,
        minOrderAmount: normalized.minOrderAmount ?? 0,
        usageLimit: normalized.usageLimit ?? null,
        perStudentLimit: normalized.perStudentLimit ?? 1,
        startsAt: normalized.startsAt ? new Date(normalized.startsAt) : null,
        expiresAt: normalized.expiresAt ? new Date(normalized.expiresAt) : null,
        isActive: normalized.isActive ?? true,
      } as any,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return {
      createdCount: 1,
      skippedCount: normalized.applyToAllCourses ? Math.max(0, paidCourses.length - 1) : 0,
      coupons: [createdCoupon],
      mode: normalized.applyToAllCourses ? 'ALL_COURSES_SHARED' : 'FIRST_PAID_COURSE',
      note: normalized.applyToAllCourses
        ? `Coupon created once and available in all-courses management view.`
        : undefined,
    };
  }

  @Post('courses/:courseId/coupons')
  async createCourseCoupon(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Body() payload: CreateCourseCouponDto,
  ) {
    const { instructor, course } = await this.verifyInstructorCourseOwnership(req, courseId);
    const normalized = this.normalizeCouponPayload(payload);

    const courseFinalPrice = getCourseFinalPrice(course);
    if (courseFinalPrice <= 0) {
      throw new BadRequestException('Coupons can only be added to paid courses');
    }

    const existing = await this.prisma.courseCoupon.findFirst({
      where: {
        code: normalized.code,
      },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Coupon code already exists. Please use another code.');
    }

    const coupon = await this.prisma.courseCoupon.create({
      data: {
        courseId: course.id,
        instructorId: instructor.id,
        applyToAllCourses: false,
        code: normalized.code,
        description: normalized.description ?? null,
        discountType: normalized.discountType,
        discountValue: normalized.discountValue,
        maxDiscountAmount: normalized.maxDiscountAmount ?? null,
        minOrderAmount: normalized.minOrderAmount ?? 0,
        usageLimit: normalized.usageLimit ?? null,
        perStudentLimit: normalized.perStudentLimit ?? 1,
        startsAt: normalized.startsAt ? new Date(normalized.startsAt) : null,
        expiresAt: normalized.expiresAt ? new Date(normalized.expiresAt) : null,
        isActive: normalized.isActive ?? true,
      } as any,
    });

    return coupon;
  }

  @Patch('courses/:courseId/coupons/:couponId')
  async updateCourseCoupon(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Param('couponId') couponId: string,
    @Body() payload: UpdateCourseCouponDto,
  ) {
    const { instructor, course } = await this.verifyInstructorCourseOwnership(req, courseId);
    const normalized = this.normalizeCouponPayload(payload);

    const coupon = await this.prisma.courseCoupon.findFirst({
      where: {
        id: couponId,
        instructorId: instructor.id,
        courseId: course.id,
      },
    });

    if (!coupon) {
      throw new BadRequestException('Coupon not found for this course');
    }

    if (normalized.code && normalized.code !== coupon.code) {
      const existing = await this.prisma.courseCoupon.findFirst({
        where: {
          code: normalized.code,
          id: { not: coupon.id },
        },
        select: { id: true },
      });

      if (existing) {
        throw new BadRequestException('Coupon code already exists. Please use another code.');
      }
    }

    if (normalized.discountType === 'PERCENTAGE' && normalized.discountValue && normalized.discountValue > 100) {
      throw new BadRequestException('Percentage discount cannot exceed 100');
    }

    return this.prisma.courseCoupon.update({
      where: { id: coupon.id },
      data: {
        ...(normalized.code !== undefined ? { code: normalized.code } : {}),
        ...(normalized.description !== undefined ? { description: normalized.description } : {}),
        ...(normalized.discountType !== undefined ? { discountType: normalized.discountType } : {}),
        ...(normalized.discountValue !== undefined ? { discountValue: normalized.discountValue } : {}),
        ...(normalized.maxDiscountAmount !== undefined ? { maxDiscountAmount: normalized.maxDiscountAmount } : {}),
        ...(normalized.minOrderAmount !== undefined ? { minOrderAmount: normalized.minOrderAmount } : {}),
        ...(normalized.usageLimit !== undefined ? { usageLimit: normalized.usageLimit } : {}),
        ...(normalized.perStudentLimit !== undefined ? { perStudentLimit: normalized.perStudentLimit } : {}),
        ...(normalized.startsAt !== undefined ? { startsAt: normalized.startsAt ? new Date(normalized.startsAt) : null } : {}),
        ...(normalized.expiresAt !== undefined ? { expiresAt: normalized.expiresAt ? new Date(normalized.expiresAt) : null } : {}),
        ...(normalized.isActive !== undefined ? { isActive: normalized.isActive } : {}),
      },
    });
  }

  @Delete('courses/:courseId/coupons/:couponId')
  async deleteCourseCoupon(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Param('couponId') couponId: string,
  ) {
    const { instructor, course } = await this.verifyInstructorCourseOwnership(req, courseId);

    const coupon = await this.prisma.courseCoupon.findFirst({
      where: {
        id: couponId,
        instructorId: instructor.id,
        courseId: course.id,
      },
      include: {
        _count: {
          select: { usages: true },
        },
      },
    });

    if (!coupon) {
      throw new BadRequestException('Coupon not found for this course');
    }

    if ((coupon._count?.usages || 0) > 0) {
      await this.prisma.courseCoupon.update({
        where: { id: coupon.id },
        data: { isActive: false },
      });

      return {
        message: 'Coupon has previous usage and was deactivated instead of deleted',
      };
    }

    await this.prisma.courseCoupon.delete({
      where: { id: coupon.id },
    });

    return { message: 'Coupon deleted successfully' };
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
    if (courseData.duration !== undefined) {
      courseData.duration = parseInt(courseData.duration as any) || 0;
    }
    if (courseData.maxStudents !== undefined && courseData.maxStudents !== null) {
      courseData.maxStudents = parseInt(courseData.maxStudents as any) || null;
    }

    const normalizedPricingData = this.normalizeAndValidateCoursePricing(courseData);
    const normalizedCourseData = this.normalizeCourseCtaText(normalizedPricingData);

    // Prepare the course creation data with proper nested structure
    const createData: any = {
      ...normalizedCourseData,
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
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
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
    if (processedData.duration !== undefined) {
      processedData.duration = parseInt(processedData.duration) || 0;
    }
    if (processedData.maxStudents !== undefined && processedData.maxStudents !== null) {
      processedData.maxStudents = parseInt(processedData.maxStudents) || null;
    }

    const normalizedPricingData = this.normalizeAndValidateCoursePricing(processedData, course);
    const normalizedCourseData = this.normalizeCourseCtaText(normalizedPricingData, course);

    return this.prisma.course.update({
      where: { id: courseId },
      data: normalizedCourseData,
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
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
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
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
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
      revenue: course.enrollments.length * getCourseFinalPrice(course),
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
        lessons: {
          orderBy: { order: 'asc' },
        },
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

  @Patch('courses/:courseId/modules/reorder')
  @ApiOperation({ summary: 'Reorder modules within a course' })
  async reorderModules(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Body() data: { moduleIds?: string[] },
  ) {
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

    const moduleIds = Array.isArray(data?.moduleIds)
      ? data.moduleIds.filter((moduleId) => typeof moduleId === 'string')
      : [];

    if (moduleIds.length === 0) {
      throw new BadRequestException('moduleIds is required');
    }

    const existingModules = await this.prisma.courseModule.findMany({
      where: { courseId },
      select: { id: true },
    });

    if (existingModules.length !== moduleIds.length) {
      throw new BadRequestException(
        'Module reorder payload must include every course module',
      );
    }

    const existingModuleIds = new Set(existingModules.map((module) => module.id));
    const uniqueModuleIds = new Set(moduleIds);

    if (
      uniqueModuleIds.size !== moduleIds.length ||
      moduleIds.some((moduleId) => !existingModuleIds.has(moduleId))
    ) {
      throw new BadRequestException('Invalid module ids provided');
    }

    await this.prisma.$transaction(
      moduleIds.map((moduleId, index) =>
        this.prisma.courseModule.update({
          where: { id: moduleId },
          data: { order: index + 1 },
        }),
      ),
    );

    return this.prisma.courseModule.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  @Patch('courses/:courseId/modules/:moduleId/lessons/reorder')
  @ApiOperation({ summary: 'Reorder lessons within a module' })
  async reorderLessons(
    @Request() req: any,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Body() data: { lessonIds?: string[] },
  ) {
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

    const module = await this.prisma.courseModule.findFirst({
      where: {
        id: moduleId,
        courseId,
      },
    });

    if (!module) {
      throw new Error('Module not found');
    }

    const lessonIds = Array.isArray(data?.lessonIds)
      ? data.lessonIds.filter((lessonId) => typeof lessonId === 'string')
      : [];

    if (lessonIds.length === 0) {
      throw new BadRequestException('lessonIds is required');
    }

    const existingLessons = await this.prisma.lesson.findMany({
      where: { moduleId },
      select: { id: true },
    });

    if (existingLessons.length !== lessonIds.length) {
      throw new BadRequestException(
        'Lesson reorder payload must include every lesson in the module',
      );
    }

    const existingLessonIds = new Set(existingLessons.map((lesson) => lesson.id));
    const uniqueLessonIds = new Set(lessonIds);

    if (
      uniqueLessonIds.size !== lessonIds.length ||
      lessonIds.some((lessonId) => !existingLessonIds.has(lessonId))
    ) {
      throw new BadRequestException('Invalid lesson ids provided');
    }

    // Updates order field for each lesson based on array position
    await this.prisma.$transaction(
      lessonIds.map((lessonId, index) =>
        this.prisma.lesson.update({
          where: { id: lessonId },
          data: { order: index + 1 },
        }),
      ),
    );

    return this.prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
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
        lessons: {
          orderBy: { order: 'asc' },
        },
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

    const remainingModules = await this.prisma.courseModule.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      select: { id: true },
    });

    if (remainingModules.length > 0) {
      await this.prisma.$transaction(
        remainingModules.map((module, index) =>
          this.prisma.courseModule.update({
            where: { id: module.id },
            data: { order: index + 1 },
          }),
        ),
      );
    }

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