import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Review, Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ReviewCreateInput): Promise<Review> {
    const review = await this.prisma.review.create({
      data,
      include: {
        course: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update course stats
    await this.updateCourseRating(review.courseId);

    return review;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.ReviewWhereInput;
    orderBy?: Prisma.ReviewOrderByWithRelationInput;
  }): Promise<Review[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.review.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Review | null> {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        course: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async findByCourse(courseId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByUser(userId: number): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, data: Prisma.ReviewUpdateInput): Promise<Review> {
    const review = await this.prisma.review.update({
      where: { id },
      data,
      include: {
        course: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update course stats
    await this.updateCourseRating(review.courseId);

    return review;
  }

  async remove(id: string): Promise<Review> {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    await this.prisma.review.delete({
      where: { id },
    });

    // Update course stats
    await this.updateCourseRating(review.courseId);

    return review;
  }

  async getCourseRatingStats(courseId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const reviews = await this.prisma.review.findMany({
      where: { courseId },
      select: {
        rating: true,
      },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

    const ratingDistribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
    };
  }

  private async updateCourseRating(courseId: string): Promise<void> {
    const stats = await this.getCourseRatingStats(courseId);

    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        rating: stats.averageRating,
        totalRatings: stats.totalReviews,
      },
    });
  }
}
