import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Instructor, Prisma } from '@prisma/client';

@Injectable()
export class InstructorsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.InstructorCreateInput): Promise<Instructor> {
    return this.prisma.instructor.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.InstructorOrderByWithRelationInput;
  }): Promise<Instructor[]> {
    const { skip, take, orderBy } = params || {};
    return this.prisma.instructor.findMany({
      skip,
      take,
      orderBy,
      include: {
        courses: {
          where: {
            status: 'PUBLISHED',
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Instructor | null> {
    const instructor = await this.prisma.instructor.findUnique({
      where: { id },
      include: {
        courses: {
          where: {
            status: 'PUBLISHED',
          },
          include: {
            modules: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!instructor) {
      throw new NotFoundException(`Instructor with ID ${id} not found`);
    }

    return instructor;
  }

  async findByUserId(userId: number): Promise<Instructor | null> {
    return this.prisma.instructor.findUnique({
      where: { userId },
      include: {
        courses: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.InstructorUpdateInput,
  ): Promise<Instructor> {
    return this.prisma.instructor.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Instructor> {
    return this.prisma.instructor.delete({
      where: { id },
    });
  }

  async getTopInstructors(limit: number = 10): Promise<Instructor[]> {
    return this.prisma.instructor.findMany({
      take: limit,
      orderBy: [{ rating: 'desc' }, { totalStudents: 'desc' }],
      include: {
        courses: {
          where: {
            status: 'PUBLISHED',
          },
        },
      },
    });
  }

  async updateInstructorStats(instructorId: string): Promise<void> {
    const courses = await this.prisma.course.findMany({
      where: { instructorId },
    });

    const totalStudents = courses.reduce(
      (sum, course) => sum + course.totalStudents,
      0,
    );
    const totalCourses = courses.length;
    const averageRating =
      courses.length > 0
        ? courses.reduce((sum, course) => sum + course.rating, 0) /
          courses.length
        : 0;

    await this.prisma.instructor.update({
      where: { id: instructorId },
      data: {
        totalStudents,
        totalCourses,
        rating: averageRating,
      },
    });
  }
}
