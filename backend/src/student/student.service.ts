import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        enrollments: {
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
          },
          orderBy: {
            enrolledAt: 'desc',
          },
        },
        certificates: {
          include: {
            course: true,
          },
          orderBy: {
            issuedAt: 'desc',
          },
        },
        progress: {
          where: {
            completed: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Calculate statistics
    const totalEnrollments = student.enrollments.length;
    const completedCourses = student.enrollments.filter(
      (e) => e.status === 'COMPLETED',
    ).length;
    const inProgressCourses = student.enrollments.filter(
      (e) => e.status === 'ACTIVE',
    ).length;
    const totalCertificates = student.certificates.length;
    const completedLessons = student.progress.length;

    return {
      student,
      stats: {
        totalEnrollments,
        completedCourses,
        inProgressCourses,
        totalCertificates,
        completedLessons,
      },
    };
  }

  async getEnrolledCourses(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return this.prisma.enrollment.findMany({
      where: { studentId: student.id },
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
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });
  }

  async getCourseProgress(userId: string, courseId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        courseId,
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Get completed lessons
    const completedLessons = await this.prisma.lessonProgress.findMany({
      where: {
        studentId: student.id,
        lesson: {
          module: {
            courseId,
          },
        },
        completed: true,
      },
      include: {
        lesson: true,
      },
    });

    const completedLessonIds = completedLessons.map((cp) => cp.lessonId);

    return {
      enrollment,
      completedLessonIds,
      completedCount: completedLessons.length,
      totalLessons: enrollment.course.modules.reduce(
        (sum, module) => sum + module.lessons.length,
        0,
      ),
    };
  }

  async markLessonComplete(userId: string, lessonId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Check if already completed
    const existing = await this.prisma.lessonProgress.findUnique({
      where: {
        studentId_lessonId: {
          studentId: student.id,
          lessonId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    // Mark as complete
    const progress = await this.prisma.lessonProgress.create({
      data: {
        studentId: student.id,
        lessonId,
        completed: true,
        completedAt: new Date(),
      },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    // Update enrollment progress
    const courseId = progress.lesson.module.courseId;
    const totalLessons = await this.prisma.lesson.count({
      where: {
        module: {
          courseId,
        },
      },
    });

    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        studentId: student.id,
        completed: true,
        lesson: {
          module: {
            courseId,
          },
        },
      },
    });

    const progressPercentage = (completedLessons / totalLessons) * 100;

    await this.prisma.enrollment.updateMany({
      where: {
        studentId: student.id,
        courseId,
      },
      data: {
        progress: progressPercentage,
        status: progressPercentage >= 100 ? 'COMPLETED' : 'ACTIVE',
        completedAt: progressPercentage >= 100 ? new Date() : null,
      },
    });

    return progress;
  }

  async getCertificates(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return this.prisma.certificate.findMany({
      where: { studentId: student.id },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });
  }

  async getQuizAttempts(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return this.prisma.quizAttempt.findMany({
      where: { studentId: student.id },
      include: {
        quiz: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        attemptedAt: 'desc',
      },
    });
  }
}
