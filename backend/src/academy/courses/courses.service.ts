import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import {
  Course,
  CourseStatus,
  CourseLevel,
  CourseTier,
  CourseCategory,
  DeliveryMode,
  Prisma,
} from '@prisma/client';
import {
  transformCourse,
  instructorInclude,
} from '../../utils/transform.util';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CourseCreateInput): Promise<Course> {
    const course = await this.prisma.course.create({ data });
    
    // Update instructor's totalCourses
    if (course.instructorId) {
      await this.prisma.instructor.update({
        where: { id: course.instructorId },
        data: {
          totalCourses: { increment: 1 },
        },
      });
    }
    
    return course;
  }

  // Helper method to update course module and lesson counts
  private async updateModuleAndLessonCounts(courseId: string): Promise<void> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (course) {
      const totalModules = course.modules?.length || 0;
      const totalLessons = course.modules?.reduce(
        (sum, module) => sum + (module.lessons?.length || 0),
        0,
      ) || 0;

      await this.prisma.course.update({
        where: { id: courseId },
        data: {
          totalModules,
          totalLessons,
        },
      });
    }
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    category?: string;
    level?: string;
    tier?: string;
    minPrice?: number;
    maxPrice?: number;
    deliveryMode?: string;
    sortBy?: string;
  }): Promise<Course[]> {
    const { skip, take, search, category, level, tier, minPrice, maxPrice, deliveryMode, sortBy } = params || {};
    
    // Build where clause
    const where: Prisma.CourseWhereInput = {};
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }
    
    // Category filter
    if (category) {
      where.category = category.toUpperCase() as any;
    }
    
    // Level filter (support comma-separated values)
    if (level) {
      const levels = level.split(',').map(l => l.trim().toUpperCase());
      if (levels.length === 1) {
        where.level = levels[0] as any;
      } else {
        where.level = { in: levels as any[] };
      }
    }
    
    // Tier filter (support comma-separated values)
    if (tier) {
      const tiers = tier.split(',').map(t => t.trim().toUpperCase());
      if (tiers.length === 1) {
        where.tier = tiers[0] as any;
      } else {
        where.tier = { in: tiers as any[] };
      }
    }
    
    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }
    
    // Delivery mode filter (support comma-separated values)
    if (deliveryMode) {
      const modes = deliveryMode.split(',').map(m => m.trim().toUpperCase());
      if (modes.length === 1) {
        where.deliveryMode = modes[0] as any;
      } else {
        where.deliveryMode = { in: modes as any[] };
      }
    }
    
    // Build orderBy clause
    let orderBy: Prisma.CourseOrderByWithRelationInput = { createdAt: 'desc' };
    
    if (sortBy) {
      switch (sortBy) {
        case 'popular':
          orderBy = { totalStudents: 'desc' };
          break;
        case 'rating':
          orderBy = { rating: 'desc' };
          break;
        case 'price-low':
          orderBy = { price: 'asc' };
          break;
        case 'price-high':
          orderBy = { price: 'desc' };
          break;
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }
    }
    
    const courses = await this.prisma.course.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        instructor: {
          include: instructorInclude,
        },
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    // Calculate totalModules and totalLessons for each course and transform instructor
    return courses.map(course => transformCourse({
      ...course,
      totalModules: course.modules?.length || 0,
      totalLessons: course.modules?.reduce(
        (sum, module) => sum + (module.lessons?.length || 0),
        0,
      ) || 0,
    }));
  }

  async findOne(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          include: instructorInclude,
        },
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
                quizzes: true,
                assignments: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    // Calculate totalModules and totalLessons dynamically
    const totalModules = course.modules?.length || 0;
    const totalLessons = course.modules?.reduce(
      (sum, module) => sum + (module.lessons?.length || 0),
      0,
    ) || 0;

    // Update the database with the calculated values
    if (totalModules !== course.totalModules || totalLessons !== course.totalLessons) {
      await this.prisma.course.update({
        where: { id: course.id },
        data: {
          totalModules,
          totalLessons,
        },
      });
    }

    // Return the course with updated values and transformed instructor
    return transformCourse({
      ...course,
      totalModules,
      totalLessons,
    });
  }

  async findBySlug(slug: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: {
          include: instructorInclude,
        },
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with slug ${slug} not found`);
    }

    // Calculate totalModules and totalLessons dynamically
    const totalModules = course.modules?.length || 0;
    const totalLessons = course.modules?.reduce(
      (sum, module) => sum + (module.lessons?.length || 0),
      0,
    ) || 0;

    // Update the database with the calculated values
    if (totalModules !== course.totalModules || totalLessons !== course.totalLessons) {
      await this.prisma.course.update({
        where: { id: course.id },
        data: {
          totalModules,
          totalLessons,
        },
      });
    }

    // Return the course with updated values and transformed instructor
    return transformCourse({
      ...course,
      totalModules,
      totalLessons,
    });
  }

  async update(id: string, data: Prisma.CourseUpdateInput): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Course> {
    return this.prisma.course.delete({
      where: { id },
    });
  }

  async findByCategory(category: CourseCategory): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      where: { category },
      include: {
        instructor: {
          include: instructorInclude,
        },
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => transformCourse({
      ...course,
      totalModules: course.modules?.length || 0,
      totalLessons: course.modules?.reduce(
        (sum, module) => sum + (module.lessons?.length || 0),
        0,
      ) || 0,
    }));
  }

  async findByLevel(level: CourseLevel): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      where: { level },
      include: {
        instructor: {
          include: instructorInclude,
        },
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => transformCourse({
      ...course,
      totalModules: course.modules?.length || 0,
      totalLessons: course.modules?.reduce(
        (sum, module) => sum + (module.lessons?.length || 0),
        0,
      ) || 0,
    }));
  }

  async findByTier(tier: CourseTier): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      where: { tier },
      include: {
        instructor: {
          include: instructorInclude,
        },
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => transformCourse({
      ...course,
      totalModules: course.modules?.length || 0,
      totalLessons: course.modules?.reduce(
        (sum, module) => sum + (module.lessons?.length || 0),
        0,
      ) || 0,
    }));
  }

  async findByInstructor(instructorId: string): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
      include: {
        instructor: {
          include: instructorInclude,
        },
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => transformCourse({
      ...course,
      totalModules: course.modules?.length || 0,
      totalLessons: course.modules?.reduce(
        (sum, module) => sum + (module.lessons?.length || 0),
        0,
      ) || 0,
    }));
  }

  async searchCourses(query: string): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { shortDescription: { contains: query } },
        ],
      },
      include: {
        instructor: {
          include: instructorInclude,
        },
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => transformCourse({
      ...course,
      totalModules: course.modules?.length || 0,
      totalLessons: course.modules?.reduce(
        (sum, module) => sum + (module.lessons?.length || 0),
        0,
      ) || 0,
    }));
  }

  async getPopularCourses(limit: number = 10): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      take: limit,
      where: {
        status: CourseStatus.PUBLISHED,
      },
      orderBy: [
        { totalStudents: 'desc' },
        { rating: 'desc' },
      ],
      include: {
        instructor: {
          include: instructorInclude,
        },
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => transformCourse({
      ...course,
      totalModules: course.modules?.length || 0,
      totalLessons: course.modules?.reduce(
        (sum, module) => sum + (module.lessons?.length || 0),
        0,
      ) || 0,
    }));
  }

  async getFeaturedCourses(limit: number = 6): Promise<Course[]> {
    const courses = await this.prisma.course.findMany({
      take: limit,
      where: {
        status: CourseStatus.PUBLISHED,
        rating: {
          gte: 4.5,
        },
      },
      orderBy: {
        rating: 'desc',
      },
      include: {
        instructor: {
          include: instructorInclude,
        },
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => transformCourse({
      ...course,
      totalModules: course.modules?.length || 0,
      totalLessons: course.modules?.reduce(
        (sum, module) => sum + (module.lessons?.length || 0),
        0,
      ) || 0,
    }));
  }

  async updateCourseStats(courseId: string): Promise<void> {
    const enrollmentCount = await this.prisma.enrollment.count({
      where: { courseId },
    });

    const reviews = await this.prisma.review.findMany({
      where: { courseId },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : 0;

    // Get module and lesson counts
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    const totalModules = course?.modules?.length || 0;
    const totalLessons = course?.modules?.reduce(
      (sum, module) => sum + (module.lessons?.length || 0),
      0,
    ) || 0;

    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        totalStudents: enrollmentCount,
        totalRatings: reviews.length,
        rating: averageRating,
        totalModules,
        totalLessons,
      },
    });
  }
}
