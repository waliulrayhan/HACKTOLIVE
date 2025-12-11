import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Quiz, QuizAttempt, Prisma } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  async createQuiz(data: Prisma.QuizCreateInput): Promise<Quiz> {
    return this.prisma.quiz.create({
      data,
      include: {
        questions: true,
        lesson: true,
      },
    });
  }

  async findAllQuizzes(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.QuizWhereInput;
  }): Promise<Quiz[]> {
    const { skip, take, where } = params || {};
    return this.prisma.quiz.findMany({
      skip,
      take,
      where,
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
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
  }

  async findQuiz(id: string): Promise<Quiz | null> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
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
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async findQuizzesByLesson(lessonId: string): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      where: { lessonId },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
  }

  async updateQuiz(id: string, data: Prisma.QuizUpdateInput): Promise<Quiz> {
    return this.prisma.quiz.update({
      where: { id },
      data,
      include: {
        questions: true,
      },
    });
  }

  async removeQuiz(id: string): Promise<Quiz> {
    return this.prisma.quiz.delete({
      where: { id },
    });
  }

  // Quiz Attempts
  async submitQuizAttempt(
    quizId: string,
    studentId: string,
    answers: any,
  ): Promise<QuizAttempt> {
    // Get quiz with questions
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${quizId} not found`);
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

    // Create quiz attempt
    const attempt = await this.prisma.quizAttempt.create({
      data: {
        quiz: { connect: { id: quizId } },
        student: { connect: { id: studentId } },
        score,
        answers: JSON.stringify(answers), // Stringify for MySQL TEXT field
        passed,
      },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
        student: true,
      },
    });

    return attempt;
  }

  async findAttemptsByStudent(studentId: string): Promise<QuizAttempt[]> {
    return this.prisma.quizAttempt.findMany({
      where: { studentId },
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

  async findAttemptsByQuiz(quizId: string): Promise<QuizAttempt[]> {
    return this.prisma.quizAttempt.findMany({
      where: { quizId },
      include: {
        student: true,
      },
      orderBy: {
        attemptedAt: 'desc',
      },
    });
  }

  async getStudentQuizProgress(
    studentId: string,
    quizId: string,
  ): Promise<{
    attempts: number;
    bestScore: number;
    passed: boolean;
    lastAttempt?: QuizAttempt;
  }> {
    const attempts = await this.prisma.quizAttempt.findMany({
      where: {
        studentId,
        quizId,
      },
      orderBy: {
        score: 'desc',
      },
    });

    const bestScore = attempts.length > 0 ? attempts[0].score : 0;
    const passed = attempts.some((attempt) => attempt.passed);
    const lastAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : undefined;

    return {
      attempts: attempts.length,
      bestScore,
      passed,
      lastAttempt,
    };
  }
}
