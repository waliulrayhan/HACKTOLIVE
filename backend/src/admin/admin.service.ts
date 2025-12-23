import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserRole, CourseStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import {
  transformEnrollment,
  transformCourse,
  instructorInclude,
  studentInclude,
} from '../utils/transform.util';

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
        student: {
          include: studentInclude,
        },
        course: true,
      },
    });

    const recentCourses = await this.prisma.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: {
          include: instructorInclude,
        },
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
      recentEnrollments: recentEnrollments.map(transformEnrollment),
      recentCourses: recentCourses.map(transformCourse),
    };
  }

  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  }) {
    const { page = 1, limit = 10, role, search } = params || {};
    
    // Build where clause with search and role filter
    const where: any = {};
    
    if (role) {
      where.role = role;
    }
    
    if (search) {
      // MySQL doesn't support mode: 'insensitive', so we remove it
      // MySQL's LIKE is case-insensitive by default with utf8_general_ci collation
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
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
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
        },
      });
    } else if (role === UserRole.INSTRUCTOR) {
      await this.prisma.instructor.create({
        data: {
          userId: user.id,
          skills: JSON.stringify([]),
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
          instructor: {
            include: instructorInclude,
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
      }),
      this.prisma.course.count({ where }),
    ]);

    return { 
      courses: courses.map(transformCourse), 
      total 
    };
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
    const courses = await this.prisma.course.findMany({
      take: limit,
      where: {
        status: CourseStatus.PUBLISHED,
      },
      include: {
        instructor: {
          include: instructorInclude,
        },
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
    
    return courses.map(transformCourse);
  }

  async getTopInstructors(limit: number = 10) {
    const instructors = await this.prisma.instructor.findMany({
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            bio: true,
          },
        },
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
    
    return instructors.map(instructor => ({
      ...instructor,
      name: instructor.user.name,
      email: instructor.user.email,
      avatar: instructor.user.avatar,
      bio: instructor.user.bio,
    }));
  }

  async syncInstructorStats() {
    // Get all instructors
    const instructors = await this.prisma.instructor.findMany({
      include: {
        courses: {
          include: {
            _count: {
              select: {
                enrollments: true,
              },
            },
          },
        },
      },
    });

    // Update each instructor's stats
    const updates = instructors.map(async (instructor) => {
      const totalCourses = instructor.courses.length;
      const totalStudents = instructor.courses.reduce(
        (sum, course) => sum + course._count.enrollments,
        0,
      );

      return this.prisma.instructor.update({
        where: { id: instructor.id },
        data: {
          totalCourses,
          totalStudents,
        },
      });
    });

    await Promise.all(updates);

    return {
      message: 'Instructor stats synced successfully',
      updated: instructors.length,
    };
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
