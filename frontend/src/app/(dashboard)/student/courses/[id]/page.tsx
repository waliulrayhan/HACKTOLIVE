"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineAcademicCap,
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlinePlay,
  HiOutlineCheckCircle,
  HiOutlineDocument,
  HiOutlineClipboardCheck,
  HiOutlineQuestionMarkCircle,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineLockClosed,
} from "react-icons/hi";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch course details");

      const data = await response.json();
      setCourse(data.course);
      setEnrollment(data.enrollment);

      // Expand first module by default
      if (data.course.modules.length > 0) {
        setExpandedModules(new Set([data.course.modules[0].id]));
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course details", {
        description: "Please try again",
      });
      router.push("/student/courses");
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "VIDEO":
        return <HiOutlinePlay className="h-5 w-5" />;
      case "ARTICLE":
        return <HiOutlineDocument className="h-5 w-5" />;
      case "QUIZ":
        return <HiOutlineQuestionMarkCircle className="h-5 w-5" />;
      case "ASSIGNMENT":
        return <HiOutlineClipboardCheck className="h-5 w-5" />;
      default:
        return <HiOutlineBookOpen className="h-5 w-5" />;
    }
  };

  const handleLessonClick = (lesson: any) => {
    if (lesson.type === "VIDEO" || lesson.type === "ARTICLE") {
      router.push(
        `/student/courses/${courseId}/lesson/${lesson.id}`
      );
    } else if (lesson.type === "QUIZ" && lesson.quizzes.length > 0) {
      router.push(
        `/student/courses/${courseId}/quiz/${lesson.quizzes[0].id}`
      );
    } else if (lesson.type === "ASSIGNMENT" && lesson.assignments.length > 0) {
      router.push(
        `/student/courses/${courseId}/assignment/${lesson.assignments[0].id}`
      );
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Course Details" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  const totalLessons = course.modules.reduce(
    (sum: number, module: any) => sum + module.lessons.length,
    0
  );
  const completedLessons = course.modules.reduce(
    (sum: number, module: any) =>
      sum + module.lessons.filter((l: any) => l.progress.length > 0).length,
    0
  );

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle={course.title} />

      {/* Course Header */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {course.category.replace(/_/g, " ")}
              </span>
              <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                {course.level}
              </span>
            </div>

            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
              {course.title}
            </h1>

            <p className="mb-4 text-gray-600 dark:text-gray-400">
              {course.shortDescription}
            </p>

            {/* Instructor */}
            <div className="mb-4 flex items-center gap-3">
              {course.instructor.avatar ? (
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600" />
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Instructor
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {course.instructor.name}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <HiOutlineStar className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-900 dark:text-white">
                  {course.rating.toFixed(1)} ({course.totalRatings} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineUsers className="h-5 w-5 text-gray-500" />
                <span className="text-gray-900 dark:text-white">
                  {course.totalStudents} students
                </span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineClock className="h-5 w-5 text-gray-500" />
                <span className="text-gray-900 dark:text-white">
                  {Math.floor(course.duration / 60)} hours
                </span>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Your Progress
            </h3>

            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Course Completion
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round(enrollment.progress)}%
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all dark:bg-blue-500"
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Completed Lessons:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {completedLessons} / {totalLessons}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                <span
                  className={`font-medium ${
                    enrollment.status === "COMPLETED"
                      ? "text-green-600 dark:text-green-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {enrollment.status === "COMPLETED"
                    ? "Completed"
                    : "In Progress"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Course Content
        </h2>

        <div className="space-y-4">
          {course.modules.map((module: any, moduleIndex: number) => {
            const isExpanded = expandedModules.has(module.id);
            const moduleLessons = module.lessons.length;
            const moduleCompleted = module.lessons.filter(
              (l: any) => l.progress.length > 0
            ).length;

            return (
              <div
                key={module.id}
                className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="flex w-full items-center justify-between bg-gray-50 p-4 text-left hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                      {moduleIndex + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {moduleCompleted} / {moduleLessons} lessons completed
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <HiOutlineChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <HiOutlineChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {/* Module Lessons */}
                {isExpanded && (
                  <div className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                    {module.lessons.map((lesson: any, lessonIndex: number) => {
                      const isCompleted = lesson.progress.length > 0;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson)}
                          className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-gray-500">
                              {getLessonIcon(lesson.type)}
                            </div>
                            <div>
                              <h4
                                className={`text-sm font-medium ${
                                  isCompleted
                                    ? "text-gray-500 line-through dark:text-gray-400"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {lesson.title}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {lesson.type} • {lesson.duration} min
                              </p>
                            </div>
                          </div>
                          {isCompleted ? (
                            <HiOutlineCheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <HiOutlinePlay className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
