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

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CourseCreateInput): Promise<Course> {
    return this.prisma.course.create({ data });
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
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<Course[]> {
    const { skip, take, where, orderBy } = params || {};
    const courses = await this.prisma.course.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    // Calculate totalModules and totalLessons for each course
    return courses.map(course => ({
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
        instructor: true,
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

    // Return the course with updated values
    return {
      ...course,
      totalModules,
      totalLessons,
    };
  }

  async findBySlug(slug: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: true,
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

    // Return the course with updated values
    return {
      ...course,
      totalModules,
      totalLessons,
    };
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
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => ({
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
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => ({
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
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => ({
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
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => ({
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
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => ({
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
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => ({
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
        instructor: true,
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    return courses.map(course => ({
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
