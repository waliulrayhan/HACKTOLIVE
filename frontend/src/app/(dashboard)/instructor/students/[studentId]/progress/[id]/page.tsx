"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No progress data found</p>
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

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <HiOutlineArrowLeft className="h-4 w-4" />
            Back to Students
          </button>
        </div>

        {/* Student Info Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-4">
            {enrollment.student.user.avatar ? (
              <img
                src={enrollment.student.user.avatar}
                alt={enrollment.student.user.name}
                className="h-16 w-16 rounded-full"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                <span className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                  {enrollment.student.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {enrollment.student.user.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{enrollment.student.user.email}</p>
              <div className="flex items-center gap-3 mt-2">
                <Badge color={enrollment.status === "COMPLETED" ? "success" : "warning"}>
                  {enrollment.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </span>
                {enrollment.completedAt && (
                  <span className="text-sm text-green-600">
                    Completed: {new Date(enrollment.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {enrollment.course.title}
          </h3>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Overall Progress
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {enrollment.progress.toFixed(0)}%
                </p>
              </div>
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                <HiOutlineChartBar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Lessons Completed
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {completedLessons}/{totalLessons}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <HiOutlineCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Quiz Average
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {avgQuizScore.toFixed(1)}%
                </p>
              </div>
              <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
                <HiOutlineAcademicCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Assignment Average
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {avgAssignmentScore.toFixed(1)}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900">
                <HiOutlineClipboardList className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("lessons")}
              className={`border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === "lessons"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              Lessons ({totalLessons})
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === "quizzes"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              Quizzes ({quizAttempts.length})
            </button>
            <button
              onClick={() => setActiveTab("assignments")}
              className={`border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === "assignments"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400"
              }`}
            >
              Assignments ({assignmentSubmissions.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "lessons" && (
          <div className="space-y-4">
            {enrollment.course.modules
              .sort((a, b) => a.order - b.order)
              .map((module) => (
                <div
                  key={module.id}
                  className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="border-b border-gray-200 p-4 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {module.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {module.lessons
                        .sort((a, b) => a.order - b.order)
                        .map((lesson) => {
                          const isCompleted = lesson.progress[0]?.completed;
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700"
                            >
                              <div className="flex items-center gap-3">
                                {isCompleted ? (
                                  <HiOutlineCheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <HiOutlineClock className="h-5 w-5 text-gray-400" />
                                )}
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {lesson.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {lesson.type} • {lesson.duration} min
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {isCompleted && lesson.progress[0]?.completedAt && (
                                  <span className="text-xs text-gray-500">
                                    {new Date(
                                      lesson.progress[0].completedAt
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                                <Badge color={isCompleted ? "success" : "dark"}>
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
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="p-4">
              {quizAttempts.length === 0 ? (
                <div className="text-center py-12">
                  <HiOutlineAcademicCap className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No quiz attempts yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quizAttempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {attempt.quiz.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {attempt.quiz.lesson.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Attempted: {new Date(attempt.attemptedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {attempt.score.toFixed(1)}%
                          </p>
                          <Badge color={attempt.passed ? "success" : "error"}>
                            {attempt.passed ? "Passed" : "Failed"}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
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
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="p-4">
              {assignmentSubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <HiOutlineClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    No assignment submissions yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignmentSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {submission.assignment.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {submission.assignment.lesson.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted: {new Date(submission.submittedAt).toLocaleString()}
                          </p>
                          {submission.feedback && (
                            <div className="mt-2 rounded bg-blue-50 p-2 dark:bg-blue-900/20">
                              <p className="text-xs font-medium text-blue-900 dark:text-blue-300">
                                Feedback:
                              </p>
                              <p className="text-sm text-blue-700 dark:text-blue-400">
                                {submission.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          {submission.score !== null && submission.score !== undefined ? (
                            <>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {submission.score}/{submission.assignment.maxScore}
                              </p>
                              <Badge color="success">Graded</Badge>
                            </>
                          ) : (
                            <Badge
                              color={
                                submission.status === "SUBMITTED" ? "warning" : "info"
                              }
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
