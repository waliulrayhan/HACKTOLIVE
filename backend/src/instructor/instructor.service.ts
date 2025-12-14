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

    // Update quiz and handle questions in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Update the quiz basic data
      const updatedQuiz = await tx.quiz.update({
        where: { id: quizId },
        data: quizData,
      });

      // If questions are provided, replace all existing questions
      if (questions && Array.isArray(questions)) {
        // Delete existing questions
        await tx.quizQuestion.deleteMany({
          where: { quizId },
        });

        // Create new questions
        if (questions.length > 0) {
          await tx.quizQuestion.createMany({
            data: questions.map((q: any) => ({
              quizId,
              question: q.question,
              type: q.type,
              options: q.options,
              correctAnswer: q.correctAnswer,
              explanation: q.explanation,
              order: q.order,
            })),
          });
        }
      }

      // Return the updated quiz with questions
      return tx.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
        },
      });
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
        assignments: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    await this.verifyCourseOwnership(userId, lesson.module.course.id);

    // Check if an assignment already exists for this lesson
    if (lesson.assignments && lesson.assignments.length > 0) {
      throw new ForbiddenException('This lesson already has an assignment. Please update the existing one instead.');
    }

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

  // Get pending certificate requests
  async getPendingCertificateRequests(userId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor profile not found');
    }

    // Get all course IDs for this instructor
    const courses = await this.prisma.course.findMany({
      where: { instructorId: instructor.id },
      select: { id: true },
    });

    const courseIds = courses.map((c) => c.id);

    return this.prisma.certificate.findMany({
      where: {
        courseId: {
          in: courseIds,
        },
        status: 'PENDING',
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
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });
  }

  // Get all certificate requests (including issued/rejected)
  async getAllCertificateRequests(userId: string, status?: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor profile not found');
    }

    // Get all course IDs for this instructor
    const courses = await this.prisma.course.findMany({
      where: { instructorId: instructor.id },
      select: { id: true },
    });

    const courseIds = courses.map((c) => c.id);

    const where: any = {
      courseId: {
        in: courseIds,
      },
    };

    if (status) {
      where.status = status;
    }

    return this.prisma.certificate.findMany({
      where,
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
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });
  }

  // Issue certificate
  async issueCertificate(userId: string, certificateId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor profile not found');
    }

    // Verify the certificate belongs to this instructor's course
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        course: true,
        student: true,
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate request not found');
    }

    if (certificate.course.instructorId !== instructor.id) {
      throw new ForbiddenException(
        'You can only issue certificates for your own courses',
      );
    }

    if (certificate.status !== 'PENDING') {
      throw new ForbiddenException('Certificate has already been processed');
    }

    // Generate verification code
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = require('crypto')
      .randomBytes(4)
      .toString('hex')
      .toUpperCase();
    const verificationCode = `HACK-${timestamp}-${randomPart}`;

    // Update certificate to ISSUED
    const updatedCertificate = await this.prisma.certificate.update({
      where: { id: certificateId },
      data: {
        status: 'ISSUED',
        issuedAt: new Date(),
        verificationCode,
        certificateUrl: `/certificates/${certificate.studentId}-${certificate.courseId}.pdf`,
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });

    // Update student certificates count
    await this.prisma.student.update({
      where: { id: certificate.studentId },
      data: {
        certificatesEarned: {
          increment: 1,
        },
      },
    });

    return updatedCertificate;
  }

  // Reject certificate request
  async rejectCertificate(userId: string, certificateId: string) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor profile not found');
    }

    // Verify the certificate belongs to this instructor's course
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        course: true,
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate request not found');
    }

    if (certificate.course.instructorId !== instructor.id) {
      throw new ForbiddenException(
        'You can only reject certificates for your own courses',
      );
    }

    if (certificate.status !== 'PENDING') {
      throw new ForbiddenException('Certificate has already been processed');
    }

    // Update certificate to REJECTED
    return this.prisma.certificate.update({
      where: { id: certificateId },
      data: {
        status: 'REJECTED',
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
  }

  // Get student performance for certificate review
  async getStudentPerformanceForCertificate(
    userId: string,
    certificateId: string,
  ) {
    const instructor = await this.prisma.instructor.findUnique({
      where: { userId },
    });

    if (!instructor) {
      throw new NotFoundException('Instructor profile not found');
    }

    // Get certificate with course and student details
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  include: {
                    quizzes: true,
                    assignments: true,
                  },
                },
              },
            },
          },
        },
        student: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate request not found');
    }

    if (certificate.course.instructorId !== instructor.id) {
      throw new ForbiddenException(
        'You can only view performance for your own courses',
      );
    }

    // Get lesson progress
    const lessonProgress = await this.prisma.lessonProgress.findMany({
      where: {
        studentId: certificate.studentId,
        lesson: {
          module: {
            courseId: certificate.courseId,
          },
        },
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    // Get quiz attempts
    const quizAttempts = await this.prisma.quizAttempt.findMany({
      where: {
        studentId: certificate.studentId,
        quiz: {
          lesson: {
            module: {
              courseId: certificate.courseId,
            },
          },
        },
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
            passingScore: true,
          },
        },
      },
      orderBy: {
        attemptedAt: 'desc',
      },
    });

    // Get assignment submissions
    const assignmentSubmissions =
      await this.prisma.assignmentSubmission.findMany({
        where: {
          studentId: certificate.studentId,
          assignment: {
            lesson: {
              module: {
                courseId: certificate.courseId,
              },
            },
          },
        },
        include: {
          assignment: {
            select: {
              id: true,
              title: true,
              maxScore: true,
            },
          },
        },
      });

    // Calculate statistics
    const totalLessons = certificate.course.modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0,
    );
    const completedLessons = lessonProgress.length;

    const totalQuizzes = certificate.course.modules.reduce(
      (sum, module) =>
        sum +
        module.lessons.reduce(
          (lsum, lesson) => lsum + (lesson.quizzes?.length || 0),
          0,
        ),
      0,
    );

    // Get unique quiz IDs that were passed
    const passedQuizIds = new Set(
      quizAttempts
        .filter((attempt) => attempt.passed)
        .map((attempt) => attempt.quizId),
    );
    const passedQuizzes = passedQuizIds.size;

    const avgQuizScore =
      quizAttempts.length > 0
        ? quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
          quizAttempts.length
        : 0;

    const totalAssignments = certificate.course.modules.reduce(
      (sum, module) =>
        sum +
        module.lessons.reduce(
          (lsum, lesson) => lsum + (lesson.assignments?.length || 0),
          0,
        ),
      0,
    );
    const submittedAssignments = assignmentSubmissions.filter(
      (sub) => sub.status !== 'PENDING',
    ).length;
    const gradedAssignments = assignmentSubmissions.filter(
      (sub) => sub.status === 'GRADED' && sub.score !== null,
    );
    const avgAssignmentScore =
      gradedAssignments.length > 0
        ? gradedAssignments.reduce((sum, sub) => sum + (sub.score || 0), 0) /
          gradedAssignments.length
        : 0;

    return {
      certificate: {
        id: certificate.id,
        status: certificate.status,
        requestedAt: certificate.requestedAt,
        courseName: certificate.courseName,
        studentName: certificate.studentName,
      },
      student: {
        id: certificate.student.id,
        name: certificate.student.user.name,
        email: certificate.student.user.email,
        avatar: certificate.student.user.avatar,
      },
      course: {
        id: certificate.course.id,
        title: certificate.course.title,
      },
      performance: {
        lessons: {
          total: totalLessons,
          completed: completedLessons,
          percentage: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
        },
        quizzes: {
          total: totalQuizzes,
          passed: passedQuizzes,
          attempts: quizAttempts.length,
          averageScore: Math.round(avgQuizScore),
        },
        assignments: {
          total: totalAssignments,
          submitted: submittedAssignments,
          graded: gradedAssignments.length,
          averageScore: Math.round(avgAssignmentScore),
        },
      },
      details: {
        lessonProgress,
        quizAttempts: quizAttempts.slice(0, 10), // Latest 10 attempts
        assignmentSubmissions,
      },
    };
  }
}
