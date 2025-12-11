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

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<Course[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.course.findMany({
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

    return course;
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

    return course;
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
    return this.prisma.course.findMany({
      where: { category },
      include: {
        instructor: true,
      },
    });
  }

  async findByLevel(level: CourseLevel): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { level },
      include: {
        instructor: true,
      },
    });
  }

  async findByTier(tier: CourseTier): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { tier },
      include: {
        instructor: true,
      },
    });
  }

  async findByInstructor(instructorId: string): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: { instructorId },
      include: {
        instructor: true,
      },
    });
  }

  async searchCourses(query: string): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
          { shortDescription: { contains: query } },
        ],
      },
      include: {
        instructor: true,
      },
    });
  }

  async getPopularCourses(limit: number = 10): Promise<Course[]> {
    return this.prisma.course.findMany({
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
      },
    });
  }

  async getFeaturedCourses(limit: number = 6): Promise<Course[]> {
    return this.prisma.course.findMany({
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
      },
    });
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

    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        totalStudents: enrollmentCount,
        totalRatings: reviews.length,
        rating: averageRating,
      },
    });
  }
}
