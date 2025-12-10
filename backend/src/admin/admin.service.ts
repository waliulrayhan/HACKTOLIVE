import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserRole, CourseStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      totalCourses,
      publishedCourses,
      draftCourses,
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      totalCertificates,
      totalRevenue, // For premium courses
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.student.count(),
      this.prisma.instructor.count(),
      this.prisma.course.count(),
      this.prisma.course.count({ where: { status: CourseStatus.PUBLISHED } }),
      this.prisma.course.count({ where: { status: CourseStatus.DRAFT } }),
      this.prisma.enrollment.count(),
      this.prisma.enrollment.count({ where: { status: 'ACTIVE' } }),
      this.prisma.enrollment.count({ where: { status: 'COMPLETED' } }),
      this.prisma.certificate.count(),
      this.calculateTotalRevenue(),
    ]);

    // Get recent activities
    const recentEnrollments = await this.prisma.enrollment.findMany({
      take: 10,
      orderBy: { enrolledAt: 'desc' },
      include: {
        student: true,
        course: true,
      },
    });

    const recentCourses = await this.prisma.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: true,
      },
    });

    return {
      stats: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        draftCourses,
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        totalCertificates,
        totalRevenue,
      },
      recentEnrollments,
      recentCourses,
    };
  }

  async getAllUsers(params?: {
    skip?: number;
    take?: number;
    role?: UserRole;
  }) {
    const { skip, take, role } = params || {};
    const where = role ? { role } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        include: {
          student: true,
          instructor: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users.map((user) => {
        const { password, ...sanitized } = user;
        return sanitized;
      }),
      total,
    };
  }

  async createUser(data: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }) {
    const { email, password, name, role } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    // Create associated profile
    if (role === UserRole.STUDENT) {
      await this.prisma.student.create({
        data: {
          userId: user.id,
          name,
          email,
        },
      });
    } else if (role === UserRole.INSTRUCTOR) {
      await this.prisma.instructor.create({
        data: {
          userId: user.id,
          name,
        },
      });
    }

    const { password: _, ...sanitized } = user;
    return sanitized;
  }

  async updateUser(userId: string, data: { name?: string; role?: UserRole }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    const { password, ...sanitized } = user;
    return sanitized;
  }

  async deleteUser(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully' };
  }

  async getAllCourses(params?: {
    skip?: number;
    take?: number;
    status?: CourseStatus;
  }) {
    const { skip, take, status } = params || {};
    const where = status ? { status } : {};

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take,
        where,
        include: {
          instructor: true,
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
      }),
      this.prisma.course.count({ where }),
    ]);

    return { courses, total };
  }

  async approveCourse(courseId: string) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        status: CourseStatus.PUBLISHED,
      },
    });
  }

  async rejectCourse(courseId: string) {
    return this.prisma.course.update({
      where: { id: courseId },
      data: {
        status: CourseStatus.ARCHIVED,
      },
    });
  }

  async deleteCourse(courseId: string) {
    await this.prisma.course.delete({
      where: { id: courseId },
    });

    return { message: 'Course deleted successfully' };
  }

  async getEnrollmentStats() {
    const enrollments = await this.prisma.enrollment.findMany({
      include: {
        course: true,
        student: true,
      },
    });

    const groupedByMonth = enrollments.reduce((acc, enrollment) => {
      const month = new Date(enrollment.enrolledAt).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month]++;
      return acc;
    }, {} as Record<string, number>);

    const groupedByCourse = enrollments.reduce((acc, enrollment) => {
      const courseTitle = enrollment.course.title;
      if (!acc[courseTitle]) {
        acc[courseTitle] = 0;
      }
      acc[courseTitle]++;
      return acc;
    }, {} as Record<string, number>);

    return {
      byMonth: groupedByMonth,
      byCourse: groupedByCourse,
      total: enrollments.length,
    };
  }

  async getRevenueStats() {
    const enrollments = await this.prisma.enrollment.findMany({
      include: {
        course: true,
      },
    });

    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      return sum + enrollment.course.price;
    }, 0);

    const revenueByMonth = enrollments.reduce((acc, enrollment) => {
      const month = new Date(enrollment.enrolledAt).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += enrollment.course.price;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      revenueByMonth,
    };
  }

  async getPopularCourses(limit: number = 10) {
    return this.prisma.course.findMany({
      take: limit,
      where: {
        status: CourseStatus.PUBLISHED,
      },
      include: {
        instructor: true,
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        totalStudents: 'desc',
      },
    });
  }

  async getTopInstructors(limit: number = 10) {
    return this.prisma.instructor.findMany({
      take: limit,
      include: {
        _count: {
          select: {
            courses: true,
          },
        },
      },
      orderBy: [
        { totalStudents: 'desc' },
        { rating: 'desc' },
      ],
    });
  }

  private async calculateTotalRevenue(): Promise<number> {
    const enrollments = await this.prisma.enrollment.findMany({
      include: {
        course: {
          select: {
            price: true,
          },
        },
      },
    });

    return enrollments.reduce((sum, enrollment) => {
      return sum + enrollment.course.price;
    }, 0);
  }
}
