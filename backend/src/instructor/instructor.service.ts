import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class InstructorService {
  constructor(private prisma: PrismaService) {}

  // Verify course ownership
  async verifyCourseOwnership(userId: string, courseId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor profile not found');
    }

    const course = await this.prisma.course.findFirst({
      where: {
        id: courseId,
        instructorId: instructor.id,
      },
    });

    if (!course) {
      throw new ForbiddenException('Course not found or access denied');
    }

    return { instructor, course };
  }

  // Get instructor profile
  async getProfile(userId: string) {
    return this.prisma.instructor.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            phone: true,
            avatar: true,
            city: true,
            state: true,
            country: true,
          },
        },
        courses: {
          select: {
            id: true,
            title: true,
            status: true,
            totalStudents: true,
            rating: true,
          },
        },
      },
    });
  }

  // Update instructor profile
  async updateProfile(userId: string, data: Prisma.InstructorUpdateInput) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor profile not found');
    }

    return this.prisma.instructor.update({
      where: { id: instructor.id },
      data,
      include: {
        user: true,
      },
    });
  }

  // Quiz Management
  async createQuiz(userId: string, lessonId: string, data: any) {
    // Verify lesson ownership through course
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    await this.verifyCourseOwnership(userId, lesson.module.course.id);

    const { questions, ...quizData } = data;

    return this.prisma.quiz.create({
      data: {
        ...quizData,
        lesson: {
          connect: { id: lessonId },
        },
        questions: questions ? {
          create: questions.map((q: any, index: number) => ({
            ...q,
            order: q.order || index + 1,
          })),
        } : undefined,
      },
      include: {
        questions: true,
      },
    });
  }

  async updateQuiz(userId: string, quizId: string, data: any) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
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

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    await this.verifyCourseOwnership(userId, quiz.lesson.module.course.id);

    const { questions, ...quizData } = data;

    return this.prisma.quiz.update({
      where: { id: quizId },
      data: quizData,
      include: {
        questions: true,
      },
    });
  }

  async deleteQuiz(userId: string, quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
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

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    await this.verifyCourseOwnership(userId, quiz.lesson.module.course.id);

    await this.prisma.quiz.delete({
      where: { id: quizId },
    });

    return { message: 'Quiz deleted successfully' };
  }

  async addQuizQuestion(userId: string, quizId: string, data: any) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
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

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    await this.verifyCourseOwnership(userId, quiz.lesson.module.course.id);

    return this.prisma.quizQuestion.create({
      data: {
        ...data,
        quiz: {
          connect: { id: quizId },
        },
      },
    });
  }

  async updateQuizQuestion(userId: string, questionId: string, data: any) {
    const question = await this.prisma.quizQuestion.findUnique({
      where: { id: questionId },
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
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.verifyCourseOwnership(userId, question.quiz.lesson.module.course.id);

    return this.prisma.quizQuestion.update({
      where: { id: questionId },
      data,
    });
  }

  async deleteQuizQuestion(userId: string, questionId: string) {
    const question = await this.prisma.quizQuestion.findUnique({
      where: { id: questionId },
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
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.verifyCourseOwnership(userId, question.quiz.lesson.module.course.id);

    await this.prisma.quizQuestion.delete({
      where: { id: questionId },
    });

    return { message: 'Question deleted successfully' };
  }

  // Assignment Management
  async createAssignment(userId: string, lessonId: string, data: any) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    await this.verifyCourseOwnership(userId, lesson.module.course.id);

    // Convert date strings to DateTime
    const assignmentData: any = { ...data };
    if (assignmentData.dueDate && typeof assignmentData.dueDate === 'string') {
      assignmentData.dueDate = new Date(assignmentData.dueDate).toISOString();
    }

    return this.prisma.assignment.create({
      data: {
        ...assignmentData,
        lesson: {
          connect: { id: lessonId },
        },
      },
    });
  }

  async updateAssignment(userId: string, assignmentId: string, data: any) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
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

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.verifyCourseOwnership(userId, assignment.lesson.module.course.id);

    // Convert date strings to DateTime
    const assignmentData: any = { ...data };
    if (assignmentData.dueDate && typeof assignmentData.dueDate === 'string') {
      assignmentData.dueDate = new Date(assignmentData.dueDate).toISOString();
    }

    return this.prisma.assignment.update({
      where: { id: assignmentId },
      data: assignmentData,
    });
  }

  async deleteAssignment(userId: string, assignmentId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
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

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.verifyCourseOwnership(userId, assignment.lesson.module.course.id);

    await this.prisma.assignment.delete({
      where: { id: assignmentId },
    });

    return { message: 'Assignment deleted successfully' };
  }

  async getAssignmentSubmissions(userId: string, assignmentId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
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

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.verifyCourseOwnership(userId, assignment.lesson.module.course.id);

    return this.prisma.assignmentSubmission.findMany({
      where: { assignmentId },
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
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }

  async gradeSubmission(userId: string, submissionId: string, score: number, feedback?: string) {
    const submission = await this.prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
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
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    await this.verifyCourseOwnership(userId, submission.assignment.lesson.module.course.id);

    return this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score,
        feedback,
        status: 'GRADED',
        gradedAt: new Date(),
      },
      include: {
        student: true,
        assignment: true,
      },
    });
  }

  // Lesson Resources Management
  async addLessonResource(userId: string, lessonId: string, data: any) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    await this.verifyCourseOwnership(userId, lesson.module.course.id);

    return this.prisma.lessonResource.create({
      data: {
        ...data,
        lesson: {
          connect: { id: lessonId },
        },
      },
    });
  }

  async updateLessonResource(userId: string, resourceId: string, data: any) {
    const resource = await this.prisma.lessonResource.findUnique({
      where: { id: resourceId },
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

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    await this.verifyCourseOwnership(userId, resource.lesson.module.course.id);

    return this.prisma.lessonResource.update({
      where: { id: resourceId },
      data,
    });
  }

  async deleteLessonResource(userId: string, resourceId: string) {
    const resource = await this.prisma.lessonResource.findUnique({
      where: { id: resourceId },
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

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    await this.verifyCourseOwnership(userId, resource.lesson.module.course.id);

    await this.prisma.lessonResource.delete({
      where: { id: resourceId },
    });

    return { message: 'Resource deleted successfully' };
  }

  // Certificate Issuance
  async issueCertificate(userId: string, studentId: string, courseId: string) {
    // Verify course ownership
    await this.verifyCourseOwnership(userId, courseId);

    // Check if student has completed the course
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        course: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    if (enrollment.status !== 'COMPLETED') {
      throw new ForbiddenException('Student has not completed the course yet');
    }

    // Check if certificate already exists
    const existingCertificate = await this.prisma.certificate.findFirst({
      where: {
        studentId,
        courseId,
      },
    });

    if (existingCertificate) {
      return existingCertificate;
    }

    // Generate verification code
    const verificationCode = `CERT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create certificate
    return this.prisma.certificate.create({
      data: {
        student: {
          connect: { id: studentId },
        },
        course: {
          connect: { id: courseId },
        },
        studentName: enrollment.student.user.name || 'Student',
        courseName: enrollment.course.title,
        verificationCode,
      },
      include: {
        student: true,
        course: true,
      },
    });
  }

  // Get student progress for a course
  async getStudentCourseProgress(userId: string, courseId: string, studentId: string) {
    await this.verifyCourseOwnership(userId, courseId);

    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
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
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  include: {
                    progress: {
                      where: {
                        studentId,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Get quiz attempts
    const quizAttempts = await this.prisma.quizAttempt.findMany({
      where: {
        studentId,
        quiz: {
          lesson: {
            module: {
              courseId,
            },
          },
        },
      },
      include: {
        quiz: {
          include: {
            lesson: true,
          },
        },
      },
    });

    // Get assignment submissions
    const assignmentSubmissions = await this.prisma.assignmentSubmission.findMany({
      where: {
        studentId,
        assignment: {
          lesson: {
            module: {
              courseId,
            },
          },
        },
      },
      include: {
        assignment: {
          include: {
            lesson: true,
          },
        },
      },
    });

    return {
      enrollment,
      quizAttempts,
      assignmentSubmissions,
    };
  }

  // Get all assignments for instructor's courses
  async getAllAssignments(userId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
      include: {
        courses: true,
      },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor profile not found');
    }

    const courseIds = instructor.courses.map(c => c.id);

    return this.prisma.assignment.findMany({
      where: {
        lesson: {
          module: {
            courseId: {
              in: courseIds,
            },
          },
        },
      },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
        submissions: {
          include: {
            student: {
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
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Get pending submissions (not graded)
  async getPendingSubmissions(userId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
      include: {
        courses: true,
      },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor profile not found');
    }

    const courseIds = instructor.courses.map(c => c.id);

    return this.prisma.assignmentSubmission.findMany({
      where: {
        status: {
          in: ['PENDING', 'SUBMITTED'],
        },
        assignment: {
          lesson: {
            module: {
              courseId: {
                in: courseIds,
              },
            },
          },
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
        assignment: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    course: {
                      select: {
                        id: true,
                        title: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }
}
