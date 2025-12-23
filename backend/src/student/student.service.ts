import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { instructorInclude, transformCourse, transformEnrollment } from '../utils/transform.util';

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
                instructor: {
                  include: instructorInclude,
                },
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
          take: 5, // Recent 5 courses
        },
        certificates: {
          include: {
            course: true,
          },
          orderBy: {
            issuedAt: 'desc',
          },
          take: 3,
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
    const totalEnrollments = await this.prisma.enrollment.count({
      where: { studentId: student.id },
    });
    const completedCourses = await this.prisma.enrollment.count({
      where: {
        studentId: student.id,
        status: 'COMPLETED',
      },
    });
    const inProgressCourses = await this.prisma.enrollment.count({
      where: {
        studentId: student.id,
        status: 'ACTIVE',
      },
    });
    const totalCertificates = student.certificates.length;
    const completedLessons = student.progress.length;

    // Calculate total learning hours
    const completedLessonProgress = await this.prisma.lessonProgress.findMany({
      where: {
        studentId: student.id,
        completed: true,
      },
      include: {
        lesson: {
          select: {
            duration: true,
          },
        },
      },
    });

    const totalLearningMinutes = completedLessonProgress.reduce(
      (sum, progress) => sum + (progress.lesson?.duration || 0),
      0,
    );

    return {
      student,
      recentCourses: student.enrollments.map(transformEnrollment),
      recentCertificates: student.certificates,
      stats: {
        totalEnrollments,
        completedCourses,
        inProgressCourses,
        totalCertificates,
        completedLessons,
        totalLearningHours: totalLearningMinutes / 60,
      },
    };
  }

  async browseCourses(filters: {
    search?: string;
    category?: string;
    level?: string;
    tier?: string;
  }) {
    const where: any = {
      status: 'PUBLISHED',
    };

    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.level) {
      where.level = filters.level;
    }
    if (filters.tier) {
      where.tier = filters.tier;
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { tags: { contains: filters.search } },
      ];
    }

    const courses = await this.prisma.course.findMany({
      where,
      include: {
        instructor: {
          include: instructorInclude,
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
            modules: true,
          },
        },
      },
      orderBy: [
        { rating: 'desc' },
        { totalStudents: 'desc' },
      ],
    });

    return courses.map(transformCourse);
  }

  async enrollInCourse(userId: string, courseId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Check if already enrolled
    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Already enrolled in this course');
    }

    // Check course exists and is published
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.status !== 'PUBLISHED') {
      throw new BadRequestException('Course is not available for enrollment');
    }

    // For LIVE courses, check capacity
    if (course.deliveryMode === 'LIVE' && course.maxStudents) {
      if (course.enrolledStudents >= course.maxStudents) {
        throw new BadRequestException('Course is full');
      }
    }

    // Create enrollment
    const enrollment = await this.prisma.enrollment.create({
      data: {
        studentId: student.id,
        courseId,
        status: 'ACTIVE',
        progress: 0,
      },
      include: {
        course: {
          include: {
            instructor: {
              include: instructorInclude,
            },
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    // Update course and student stats
    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        totalStudents: { increment: 1 },
        enrolledStudents: { increment: 1 },
      },
    });

    await this.prisma.student.update({
      where: { id: student.id },
      data: {
        enrolledCourses: { increment: 1 },
      },
    });

    // Update instructor stats
    if (course.instructorId) {
      await this.prisma.instructor.update({
        where: { id: course.instructorId },
        data: {
          totalStudents: { increment: 1 },
        },
      });
    }

    return transformEnrollment(enrollment);
  }

  async getEnrolledCourses(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId: student.id },
      include: {
        course: {
          include: {
            instructor: {
              include: instructorInclude,
            },
            modules: {
              include: {
                lessons: true,
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: 'desc',
      },
    });

    return enrollments.map(transformEnrollment);
  }

  async getCourseDetail(userId: string, courseId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Get enrollment
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        courseId,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Not enrolled in this course');
    }

    // Get course with full details
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          include: instructorInclude,
        },
        modules: {
          include: {
            lessons: {
              include: {
                resources: true,
                quizzes: true,
                assignments: true,
                progress: {
                  where: {
                    studentId: student.id,
                  },
                },
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        reviews: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Add sequential locking logic
    // First lesson is always unlocked, subsequent lessons require previous lesson completion
    let allLessons: any[] = [];
    course.modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        allLessons.push({
          ...lesson,
          moduleId: module.id,
          moduleOrder: module.order,
        });
      });
    });

    // Sort all lessons by module order and lesson order
    allLessons = allLessons.sort((a, b) => {
      if (a.moduleOrder !== b.moduleOrder) {
        return a.moduleOrder - b.moduleOrder;
      }
      return a.order - b.order;
    });

    // Add isLocked property
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];
      
      if (i === 0) {
        // First lesson is always unlocked
        lesson.isLocked = false;
      } else {
        // Check if previous lesson is completed
        const previousLesson = allLessons[i - 1];
        const isPreviousCompleted = previousLesson.progress && previousLesson.progress.length > 0;
        lesson.isLocked = !isPreviousCompleted;
      }
    }

    // Update the course modules with isLocked property
    const courseWithLocks = {
      ...course,
      modules: course.modules.map((module) => ({
        ...module,
        lessons: module.lessons.map((lesson) => {
          const lessonWithLock = allLessons.find((l) => l.id === lesson.id);
          return {
            ...lesson,
            isLocked: lessonWithLock?.isLocked ?? false,
          };
        }),
      })),
    };

    return {
      course: transformCourse(courseWithLocks),
      enrollment,
    };
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
        student: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        course: {
          include: {
            instructor: {
              include: instructorInclude,
            },
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

  async getLessonDetail(userId: string, lessonId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                instructor: true,
                modules: {
                  include: {
                    lessons: {
                      include: {
                        progress: {
                          where: {
                            studentId: student.id,
                          },
                        },
                      },
                      orderBy: {
                        order: 'asc',
                      },
                    },
                  },
                  orderBy: {
                    order: 'asc',
                  },
                },
              },
            },
          },
        },
        resources: true,
        quizzes: {
          include: {
            questions: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        assignments: true,
        progress: {
          where: {
            studentId: student.id,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check enrollment
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        courseId: lesson.module.courseId,
      },
    });

    if (!enrollment && !lesson.isPreview) {
      throw new BadRequestException('Not enrolled in this course');
    }

    // Enforce sequential access (unless it's a preview lesson)
    if (!lesson.isPreview) {
      // Get all lessons in sequential order
      let allLessons: any[] = [];
      lesson.module.course.modules.forEach((module) => {
        module.lessons.forEach((l) => {
          allLessons.push({
            ...l,
            moduleOrder: module.order,
            moduleId: module.id,
          });
        });
      });

      // Sort by module order then lesson order
      allLessons = allLessons.sort((a, b) => {
        if (a.moduleOrder !== b.moduleOrder) {
          return a.moduleOrder - b.moduleOrder;
        }
        return a.order - b.order;
      });

      // Find current lesson index
      const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
      
      // Check if previous lesson is completed (if not the first lesson)
      if (currentLessonIndex > 0) {
        const previousLesson = allLessons[currentLessonIndex - 1];
        const isPreviousCompleted = previousLesson.progress && previousLesson.progress.length > 0;
        
        if (!isPreviousCompleted) {
          throw new BadRequestException(
            `You must complete the previous lesson "${previousLesson.title}" before accessing this lesson.`
          );
        }
      }
    }

    return lesson;
  }

  async getQuiz(userId: string, quizId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

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
        questions: {
          select: {
            id: true,
            question: true,
            type: true,
            options: true,
            order: true,
            // Don't include correctAnswer
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check enrollment
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        courseId: quiz.lesson.module.courseId,
      },
    });

    if (!enrollment) {
      throw new BadRequestException('Not enrolled in this course');
    }

    // Get previous attempts
    const attempts = await this.prisma.quizAttempt.findMany({
      where: {
        quizId,
        studentId: student.id,
      },
      orderBy: {
        attemptedAt: 'desc',
      },
    });

    return {
      quiz,
      attempts,
    };
  }

  async submitQuiz(
    userId: string,
    quizId: string,
    answers: Record<string, string>,
  ) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        lesson: {
          include: {
            module: true,
          },
        },
        questions: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question) => {
      const studentAnswer = answers[question.id];
      if (studentAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / totalQuestions) * 100;
    const passed = score >= quiz.passingScore;

    // Save attempt
    const attempt = await this.prisma.quizAttempt.create({
      data: {
        quizId,
        studentId: student.id,
        score,
        answers: JSON.stringify(answers),
        passed,
      },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
      },
    });

    // If passed, mark lesson as complete
    if (passed) {
      await this.markLessonComplete(userId, quiz.lessonId);
    }

    return {
      attempt,
      correctAnswers,
      totalQuestions,
      passed,
    };
  }

  async getAllAssignments(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Get all enrollments for the student
    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId: student.id,
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: {
                  include: {
                    assignments: {
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
                        submissions: {
                          where: {
                            studentId: student.id,
                          },
                          orderBy: {
                            submittedAt: 'desc',
                          },
                          take: 1,
                        },
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

    // Flatten and return all assignments
    const allAssignments: any[] = [];
    for (const enrollment of enrollments) {
      for (const module of enrollment.course.modules) {
        for (const lesson of module.lessons) {
          for (const assignment of lesson.assignments) {
            const { submissions, ...assignmentData } = assignment;
            allAssignments.push({
              ...assignmentData,
              submission: submissions[0] || null,
            });
          }
        }
      }
    }

    return allAssignments;
  }

  async getAssignment(userId: string, assignmentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

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
        submissions: {
          where: {
            studentId: student.id,
          },
          orderBy: {
            submittedAt: 'desc',
          },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Check enrollment
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        courseId: assignment.lesson.module.courseId,
      },
    });

    if (!enrollment) {
      throw new BadRequestException('Not enrolled in this course');
    }

    return assignment;
  }

  async getAssignmentSubmission(userId: string, assignmentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const submission = await this.prisma.assignmentSubmission.findFirst({
      where: {
        assignmentId,
        studentId: student.id,
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    return submission;
  }

  async submitAssignment(
    userId: string,
    assignmentId: string,
    data: {
      submissionText?: string;
      submissionUrl?: string;
    },
  ) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        lesson: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Check if already submitted
    const existingSubmission = await this.prisma.assignmentSubmission.findFirst(
      {
        where: {
          assignmentId,
          studentId: student.id,
          status: { in: ['PENDING', 'SUBMITTED'] },
        },
      },
    );

    if (existingSubmission) {
      throw new BadRequestException('Assignment already submitted');
    }

    // Create submission
    const submission = await this.prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        studentId: student.id,
        submissionText: data.submissionText,
        submissionUrl: data.submissionUrl,
        status: 'SUBMITTED',
      },
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

    return submission;
  }

  async getOverallProgress(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        },
        progress: {
          where: {
            completed: true,
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
        },
        quizAttempts: {
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
        },
        assignmentSubmissions: {
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
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Calculate progress per course
    const courseProgress = student.enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.modules.reduce(
        (sum, module) => sum + module.lessons.length,
        0,
      );

      const completedLessons = student.progress.filter(
        (p) => p.lesson.module.courseId === enrollment.courseId,
      ).length;

      return {
        course: enrollment.course,
        enrollment,
        totalLessons,
        completedLessons,
        progress: totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0,
      };
    });

    return {
      student,
      courseProgress,
      totalCompletedLessons: student.progress.length,
      totalQuizAttempts: student.quizAttempts.length,
      passedQuizzes: student.quizAttempts.filter((a) => a.passed).length,
      totalAssignments: student.assignmentSubmissions.length,
      gradedAssignments: student.assignmentSubmissions.filter(
        (s) => s.status === 'GRADED',
      ).length,
    };
  }

  async addReview(
    userId: string,
    courseId: string,
    rating: number,
    comment?: string,
  ) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Check enrollment
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        courseId,
      },
    });

    if (!enrollment) {
      throw new BadRequestException('Must be enrolled to review');
    }

    // Check if already reviewed
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (existingReview) {
      throw new BadRequestException('Already reviewed this course');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        courseId,
        userId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Update course rating
    const allReviews = await this.prisma.review.findMany({
      where: { courseId },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await this.prisma.course.update({
      where: { id: courseId },
      data: {
        rating: avgRating,
        totalRatings: allReviews.length,
      },
    });

    return review;
  }

  async requestCertificate(userId: string, courseId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Check if course is completed
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        courseId,
        status: 'COMPLETED',
      },
    });

    if (!enrollment) {
      throw new BadRequestException(
        'Course must be completed before requesting certificate',
      );
    }

    // Check if certificate request already exists
    const existingCertificate = await this.prisma.certificate.findFirst({
      where: {
        studentId: student.id,
        courseId,
      },
    });

    if (existingCertificate) {
      return existingCertificate;
    }

    // Get course details
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: true,
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Create certificate request (PENDING status)
    const certificate = await this.prisma.certificate.create({
      data: {
        student: { connect: { id: student.id } },
        course: { connect: { id: courseId } },
        instructor: { connect: { id: course.instructorId } },
        status: 'PENDING',
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

    return certificate;
  }
}

