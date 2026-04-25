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
  HiOutlineShieldExclamation,
  HiOutlineExclamationCircle,
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
    id: string;
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
  const [banLoading, setBanLoading] = useState(false);
  const [showBanConfirm, setShowBanConfirm] = useState(false);

  useEffect(() => {
    document.title = "Student Progress - HackToLive Academy";
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

  const handleBanStudent = async (isBanned: boolean) => {
    if (!progressData?.enrollment.id) return;

    setBanLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = isBanned
        ? `${process.env.NEXT_PUBLIC_API_URL}/instructor/enrollments/${progressData.enrollment.id}/unban`
        : `${process.env.NEXT_PUBLIC_API_URL}/instructor/enrollments/${progressData.enrollment.id}/ban`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(isBanned ? "Failed to unban student" : "Failed to ban student");
      }

      const data = await response.json();
      setProgressData({
        ...progressData,
        enrollment: { ...progressData.enrollment, status: data.enrollment.status },
      });

      toast.success(data.message, {
        description: `${progressData.enrollment.student.user.name} has been ${isBanned ? "unbanned from" : "banned from"} this course`,
      });
    } catch (error: any) {
      console.error("Error banning/unbanning student:", error);
      toast.error(isBanned ? "Failed to unban student" : "Failed to ban student", {
        description: error.message || "Please try again",
      });
    } finally {
      setBanLoading(false);
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
                <Badge 
                  color={
                    enrollment.status === "COMPLETED" 
                      ? "success" 
                      : enrollment.status === "ACTIVE" 
                      ? "success"
                      : enrollment.status === "BANNED" 
                      ? "error" 
                      : "warning"
                  } 
                  size="sm"
                >
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

        {/* Course Info with Ban Button */}
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex-1">
              {enrollment.course.title}
            </h3>
            <button
              onClick={() => setShowBanConfirm(true)}
              disabled={banLoading}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                enrollment.status === "BANNED"
                  ? "text-success-600 hover:text-success-700 dark:text-success-400 dark:hover:text-success-300 bg-success-50 hover:bg-success-100 dark:bg-success-500/10 dark:hover:bg-success-500/20"
                  : "text-error-600 hover:text-error-700 dark:text-error-400 dark:hover:text-error-300 bg-error-50 hover:bg-error-100 dark:bg-error-500/10 dark:hover:bg-error-500/20"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {banLoading ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="hidden sm:inline">{enrollment.status === "BANNED" ? "Unbanning..." : "Banning..."}</span>
                </>
              ) : (
                <>
                  <HiOutlineShieldExclamation className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{enrollment.status === "BANNED" ? "Unban from this course" : "Ban from this course"}</span>
                  <span className="sm:hidden">{enrollment.status === "BANNED" ? "Unban" : "Ban"}</span>
                </>
              )}
            </button>
          </div>
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

      {/* Ban Confirmation Modal */}
      {showBanConfirm && progressData && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {enrollment.status === "BANNED" ? "Unban Student" : "Ban Student"}
                </h3>
              </div>
              <button
                onClick={() => setShowBanConfirm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                disabled={banLoading}
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {enrollment.status === "BANNED" ? (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to <span className="font-semibold text-gray-900 dark:text-white">unban</span> <span className="font-semibold text-gray-900 dark:text-white">{enrollment.student.user.name}</span> from this course?
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    They will regain access to all course materials.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Are you sure you want to <span className="font-semibold text-gray-900 dark:text-white">ban</span> <span className="font-semibold text-gray-900 dark:text-white">{enrollment.student.user.name}</span> from <span className="font-semibold text-gray-900 dark:text-white">{enrollment.course.title}</span>?
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2 font-medium">
                    They will lose access to all course content immediately.
                  </p>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowBanConfirm(false)}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                disabled={banLoading}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleBanStudent(enrollment.status === "BANNED");
                  setShowBanConfirm(false);
                }}
                className={`h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm ${
                  enrollment.status === "BANNED"
                    ? "bg-success-600 text-white hover:bg-success-700 shadow-lg shadow-success-600/30"
                    : "bg-error-600 text-white hover:bg-error-700 shadow-lg shadow-error-600/30"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={banLoading}
              >
                {banLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {enrollment.status === "BANNED" ? "Unbanning..." : "Banning..."}
                  </>
                ) : (
                  <>
                    <HiOutlineShieldExclamation className="h-4 w-4" />
                    {enrollment.status === "BANNED" ? "Confirm Unban" : "Confirm Ban"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
