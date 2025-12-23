"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import { toast } from "@/components/ui/toast";
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineX,
  HiOutlineAcademicCap,
  HiOutlineClipboardList,
  HiOutlineChartBar,
} from "react-icons/hi";
import Badge from "@/components/ui/badge/Badge";
import Avatar from "@/components/ui/avatar/Avatar";

interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;
}

interface QuizAttempt {
  id: string;
  score: number;
  passed: boolean;
  attemptedAt: string;
  quiz: {
    id: string;
    title: string;
    passingScore: number;
    lesson: {
      title: string;
    };
  };
}

interface AssignmentSubmission {
  id: string;
  score?: number;
  status: string;
  submittedAt: string;
  feedback?: string;
  assignment: {
    id: string;
    title: string;
    maxScore: number;
    lesson: {
      title: string;
    };
  };
}

interface ProgressData {
  enrollment: {
    status: string;
    progress: number;
    enrolledAt: string;
    completedAt?: string;
    student: {
      name: string;
      email: string;
      user: {
        name: string;
        email: string;
        avatar?: string;
      };
    };
    course: {
      title: string;
      modules: Array<{
        id: string;
        title: string;
        order: number;
        lessons: Array<{
          id: string;
          title: string;
          type: string;
          duration: number;
          order: number;
          progress: LessonProgress[];
        }>;
      }>;
    };
  };
  quizAttempts: QuizAttempt[];
  assignmentSubmissions: AssignmentSubmission[];
}

export default function StudentProgressPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const studentId = params.studentId as string;

  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lessons" | "quizzes" | "assignments">("lessons");

  useEffect(() => {
    document.title = "Student Progress - HACKTOLIVE Academy";
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [courseId, studentId]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseId}/students/${studentId}/progress`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch progress");

      const data = await response.json();
      setProgressData(data);
    } catch (error: any) {
      toast.error("Error", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Student Progress" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  if (!progressData) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Student Progress" />
        <div className="flex items-center justify-center min-h-96">
          <p className="text-sm text-gray-500 dark:text-gray-400">No progress data found</p>
        </div>
      </div>
    );
  }

  const { enrollment, quizAttempts, assignmentSubmissions } = progressData;
  const totalLessons = enrollment.course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );
  const completedLessons = enrollment.course.modules.reduce(
    (sum, module) =>
      sum + module.lessons.filter((lesson) => lesson.progress[0]?.completed).length,
    0
  );

  const quizzesPassed = quizAttempts.filter((attempt) => attempt.passed).length;
  const avgQuizScore =
    quizAttempts.length > 0
      ? quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / quizAttempts.length
      : 0;

  const assignmentsGraded = assignmentSubmissions.filter((sub) => sub.status === "GRADED").length;
  const avgAssignmentScore =
    assignmentsGraded > 0
      ? assignmentSubmissions
          .filter((sub) => sub.score !== null && sub.score !== undefined)
          .reduce((sum, sub) => sum + (sub.score || 0), 0) / assignmentsGraded
      : 0;

  return (
    <div>
      <PageBreadcrumb pageTitle="Student Progress" />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <HiOutlineArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to Students
          </button>
        </div>

        {/* Student Info Card */}
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-3 sm:gap-4">
            {enrollment.student.user.avatar ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${enrollment.student.user.avatar}`}
                alt={enrollment.student.user.name}
                className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-gray-200 dark:border-white/10"
                onError={(e) => {
                  e.currentTarget.src = '/images/default-avatar.png';
                }}
              />
            ) : (
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold border-2 border-gray-200 dark:border-white/10">
                {enrollment.student.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                {enrollment.student.user.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{enrollment.student.user.email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 sm:mt-2">
                <Badge color={enrollment.status === "COMPLETED" ? "success" : "warning"} size="sm">
                  {enrollment.status}
                </Badge>
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </span>
                {enrollment.completedAt && (
                  <span className="text-[10px] sm:text-xs text-success-600 dark:text-success-400">
                    Completed: {new Date(enrollment.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {enrollment.course.title}
          </h3>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                <HiOutlineChartBar className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Overall Progress
                </p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {enrollment.progress.toFixed(0)}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Lessons Completed
                </p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {completedLessons}/{totalLessons}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-info-100 dark:bg-info-500/15">
                <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-info-600 dark:text-info-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Quiz Average
                </p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {avgQuizScore.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
                <HiOutlineClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                  Assignment Average
                </p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {avgAssignmentScore.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-white/5">
          <nav className="-mb-px flex space-x-4 sm:space-x-8">
            <button
              onClick={() => setActiveTab("lessons")}
              className={`border-b-2 py-2.5 sm:py-3 px-1 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "lessons"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Lessons ({totalLessons})
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`border-b-2 py-2.5 sm:py-3 px-1 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "quizzes"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Quizzes ({quizAttempts.length})
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`border-b-2 py-2.5 sm:py-3 px-1 text-xs sm:text-sm font-medium transition-colors ${
                activeTab === "assignments"
                  ? "border-brand-500 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              Assignments ({assignmentSubmissions.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "lessons" && (
          <div className="space-y-3">
            {enrollment.course.modules
              .sort((a, b) => a.order - b.order)
              .map((module) => (
                <div
                  key={module.id}
                  className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3"
                >
                  <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                      {module.title}
                    </h3>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="space-y-2">
                      {module.lessons
                        .sort((a, b) => a.order - b.order)
                        .map((lesson) => {
                          const isCompleted = lesson.progress[0]?.completed;
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-2.5 sm:p-3 dark:border-white/5 dark:bg-white/3"
                            >
                              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                {isCompleted ? (
                                  <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-400 shrink-0" />
                                ) : (
                                  <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {lesson.title}
                                  </p>
                                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                    {lesson.type} • {lesson.duration} min
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {isCompleted && lesson.progress[0]?.completedAt && (
                                  <span className="hidden sm:inline text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(
                                      lesson.progress[0].completedAt
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                                <Badge color={isCompleted ? "success" : "dark"} size="sm">
                                  {isCompleted ? "Completed" : "Not Started"}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "quizzes" && (
          <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="p-3 sm:p-4">
              {quizAttempts.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <HiOutlineAcademicCap className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  <p className="mt-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    No quiz attempts yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {quizAttempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="rounded-md border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-white/5 dark:bg-white/3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                            {attempt.quiz.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                            {attempt.quiz.lesson.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Attempted: {new Date(attempt.attemptedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            {attempt.score.toFixed(1)}%
                          </p>
                          <Badge color={attempt.passed ? "success" : "error"} size="sm">
                            {attempt.passed ? "Passed" : "Failed"}
                          </Badge>
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Pass: {attempt.quiz.passingScore}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "assignments" && (
          <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="p-3 sm:p-4">
              {assignmentSubmissions.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <HiOutlineClipboardList className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  <p className="mt-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    No assignment submissions yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {assignmentSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="rounded-md border border-gray-200 bg-gray-50 p-3 sm:p-4 dark:border-white/5 dark:bg-white/3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                            {submission.assignment.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 truncate">
                            {submission.assignment.lesson.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Submitted: {new Date(submission.submittedAt).toLocaleString()}
                          </p>
                          {submission.feedback && (
                            <div className="mt-2 rounded-md bg-info-50 p-2 dark:bg-info-500/10 border border-info-200 dark:border-info-500/20">
                              <p className="text-[10px] sm:text-xs font-semibold text-info-900 dark:text-info-300">
                                Feedback:
                              </p>
                              <p className="text-[10px] sm:text-xs text-info-700 dark:text-info-400 mt-0.5">
                                {submission.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          {submission.score !== null && submission.score !== undefined ? (
                            <>
                              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                {submission.score}/{submission.assignment.maxScore}
                              </p>
                              <Badge color="success" size="sm">Graded</Badge>
                            </>
                          ) : (
                            <Badge
                              color={
                                submission.status === "SUBMITTED" ? "warning" : "info"
                              }
                              size="sm"
                            >
                              {submission.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
