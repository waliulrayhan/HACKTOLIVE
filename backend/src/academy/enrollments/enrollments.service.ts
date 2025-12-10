import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Enrollment, EnrollmentStatus, Prisma } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.EnrollmentCreateInput): Promise<Enrollment> {
    // Check if student is already enrolled
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: data.student.connect?.id,
        courseId: data.course.connect?.id,
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Student is already enrolled in this course');
    }

    const enrollment = await this.prisma.enrollment.create({
      data,
      include: {
        course: true,
        student: true,
      },
    });

    // Update course enrolled students count
    await this.prisma.course.update({
      where: { id: enrollment.courseId },
      data: {
        enrolledStudents: {
          increment: 1,
        },
      },
    });

    // Update student enrolled courses count
    await this.prisma.student.update({
      where: { id: enrollment.studentId },
      data: {
        enrolledCourses: {
          increment: 1,
        },
      },
    });

    return enrollment;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.EnrollmentWhereInput;
    orderBy?: Prisma.EnrollmentOrderByWithRelationInput;
  }): Promise<Enrollment[]> {
    const { skip, take, where, orderBy } = params || {};
    return this.prisma.enrollment.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
        student: true,
      },
    });
  }

  async findOne(id: string): Promise<Enrollment | null> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            instructor: true,
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
        student: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return enrollment;
  }

  async findByStudent(studentId: string): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });
  }

  async findByCourse(courseId: string): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        student: true,
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });
  }

  async update(
    id: string,
    data: Prisma.EnrollmentUpdateInput,
  ): Promise<Enrollment> {
    return this.prisma.enrollment.update({
      where: { id },
      data,
      include: {
        course: true,
        student: true,
      },
    });
  }

  async updateProgress(
    enrollmentId: string,
    progress: number,
  ): Promise<Enrollment> {
    const enrollment = await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress,
        status:
          progress >= 100 ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
        completedAt: progress >= 100 ? new Date() : null,
      },
    });

    // If completed, update student stats
    if (progress >= 100) {
      await this.prisma.student.update({
        where: { id: enrollment.studentId },
        data: {
          completedCourses: {
            increment: 1,
          },
        },
      });
    }

    return enrollment;
  }

  async remove(id: string): Promise<Enrollment> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    await this.prisma.enrollment.delete({
      where: { id },
    });

    // Update course enrolled students count
    await this.prisma.course.update({
      where: { id: enrollment.courseId },
      data: {
        enrolledStudents: {
          decrement: 1,
        },
      },
    });

    // Update student enrolled courses count
    await this.prisma.student.update({
      where: { id: enrollment.studentId },
      data: {
        enrolledCourses: {
          decrement: 1,
        },
      },
    });

    return enrollment;
  }

  async getEnrollmentProgress(enrollmentId: string): Promise<{
    enrollment: Enrollment;
    completedLessons: number;
    totalLessons: number;
    progress: number;
  }> {
    const enrollment = await this.findOne(enrollmentId);
    
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${enrollmentId} not found`);
    }

    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        studentId: enrollment.studentId,
        completed: true,
        lesson: {
          module: {
            courseId: enrollment.courseId,
          },
        },
      },
    });

    const totalLessons = await this.prisma.lesson.count({
      where: {
        module: {
          courseId: enrollment.courseId,
        },
      },
    });

    const progress =
      totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return {
      enrollment,
      completedLessons,
      totalLessons,
      progress,
    };
  }
}
