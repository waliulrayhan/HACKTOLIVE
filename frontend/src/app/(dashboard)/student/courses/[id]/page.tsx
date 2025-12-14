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
  HiOutlinePaperClip,
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
    } else if (lesson.type === "QUIZ") {
      router.push(
        `/student/courses/${courseId}/quiz/${lesson.id}`
      );
    } else if (lesson.type === "ASSIGNMENT") {
      router.push(
        `/student/courses/${courseId}/assignment/${lesson.id}`
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
      <div>
        <PageBreadcrumb pageTitle="Course Details" />
        <div className="rounded-md border border-gray-200 bg-white p-8 sm:p-12 text-center dark:border-white/5 dark:bg-white/3">
          <HiOutlineAcademicCap className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 opacity-50" />
          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">Course not found</p>
        </div>
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
    <div className="space-y-4">
      <PageBreadcrumb pageTitle={course.title} />

      {/* Course Header */}
      <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 p-4 sm:p-6 lg:grid-cols-3">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="mb-3 sm:mb-4 flex items-center gap-2 flex-wrap">
              <span className="rounded-md bg-brand-100 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400">
                {course.category.replace(/_/g, " ")}
              </span>
              <span className="rounded-md bg-info-100 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium text-info-700 dark:bg-info-500/15 dark:text-info-400">
                {course.level}
              </span>
            </div>

            <h1 className="mb-3 sm:mb-4 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {course.title}
            </h1>

            <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {course.shortDescription}
            </p>

            {/* Instructor */}
            <div className="mb-3 sm:mb-4 flex items-center gap-3">
              {course.instructor.avatar ? (
                <Image
                  src={`${apiUrl}${course.instructor.avatar}`}
                  alt={course.instructor.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                    {course.instructor.name?.charAt(0).toUpperCase() || 'I'}
                  </span>
                </div>
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
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <HiOutlineStar className="h-4 w-4 sm:h-5 sm:w-5 text-warning-500 dark:text-warning-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {course.rating.toFixed(1)} ({course.totalRatings})
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-info-500 dark:text-info-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {course.totalStudents} students
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-success-500 dark:text-success-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.floor(course.duration / 60)}h
                </span>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="rounded-md border border-gray-200 bg-gradient-to-br from-brand-50 to-white p-4 sm:p-6 dark:border-white/5 dark:from-brand-950/20 dark:to-white/5">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Your Progress
            </h3>

            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  Course Completion
                </span>
                <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                  {Math.round(enrollment.progress)}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all shadow-sm"
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Completed Lessons:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {completedLessons} / {totalLessons}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  Status:
                </span>
                {enrollment.status === "COMPLETED" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-500/15 dark:text-success-400">
                    <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-info-100 px-2.5 py-0.5 text-xs font-medium text-info-700 dark:bg-info-500/15 dark:text-info-400">
                    <HiOutlineClock className="h-3.5 w-3.5" />
                    In Progress
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
          Course Content
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {course.modules.map((module: any, moduleIndex: number) => {
            const isExpanded = expandedModules.has(module.id);
            const moduleLessons = module.lessons.length;
            const moduleCompleted = module.lessons.filter(
              (l: any) => l.progress.length > 0
            ).length;

            return (
              <div
                key={module.id}
                className="overflow-hidden rounded-md border border-gray-200 dark:border-white/5"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="flex w-full items-center justify-between bg-gradient-to-r from-gray-50 to-gray-50/50 p-3 sm:p-4 text-left hover:from-gray-100 hover:to-gray-100/50 dark:from-white/5 dark:to-white/3 dark:hover:from-white/10 dark:hover:to-white/8 transition-all"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-brand-500 text-xs sm:text-sm font-bold text-white shadow-sm dark:bg-brand-600">
                      {moduleIndex + 1}
                    </span>
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {moduleCompleted} / {moduleLessons} lessons completed
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <HiOutlineChevronUp className="h-5 w-5 text-brand-500 dark:text-brand-400" />
                  ) : (
                    <HiOutlineChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>

                {/* Module Lessons */}
                {isExpanded && (
                  <div className="divide-y divide-gray-200 bg-white dark:divide-white/5 dark:bg-white/3">
                    {module.lessons.map((lesson: any, lessonIndex: number) => {
                      const isCompleted = lesson.progress.length > 0;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson)}
                          className="flex w-full items-center justify-between p-3 sm:p-4 text-left hover:bg-brand-50/50 dark:hover:bg-white/5 transition-all group"
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`${
                              isCompleted
                                ? "text-success-500 dark:text-success-400"
                                : "text-brand-500 dark:text-brand-400 group-hover:text-brand-600 dark:group-hover:text-brand-300"
                            }`}>
                              {getLessonIcon(lesson.type)}
                            </div>
                            <div className="flex-1">
                              <h4
                                className={`text-xs sm:text-sm font-medium ${
                                  isCompleted
                                    ? "text-gray-500 line-through dark:text-gray-500"
                                    : "text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400"
                                }`}
                              >
                                {moduleIndex + 1}.{lessonIndex + 1} - {lesson.title}
                              </h4>
                              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                {lesson.type} • {lesson.duration} min
                              </p>
                              {/* Content Statistics */}
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                {lesson.quizzes && lesson.quizzes.length > 0 && (
                                  <div className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400">
                                    <HiOutlineQuestionMarkCircle className="h-3 w-3" />
                                    <span>{lesson.quizzes.length} Quiz{lesson.quizzes.length !== 1 ? 'zes' : ''}</span>
                                  </div>
                                )}
                                {lesson.assignments && lesson.assignments.length > 0 && (
                                  <div className="flex items-center gap-1 text-[10px] text-orange-600 dark:text-orange-400">
                                    <HiOutlineClipboardCheck className="h-3 w-3" />
                                    <span>{lesson.assignments.length} Assignment{lesson.assignments.length !== 1 ? 's' : ''}</span>
                                  </div>
                                )}
                                {lesson.resources && lesson.resources.length > 0 && (
                                  <div className="flex items-center gap-1 text-[10px] text-green-600 dark:text-green-400">
                                    <HiOutlinePaperClip className="h-3 w-3" />
                                    <span>{lesson.resources.length} Resource{lesson.resources.length !== 1 ? 's' : ''}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {isCompleted ? (
                            <HiOutlineCheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success-600 dark:text-success-500" />
                          ) : (
                            <HiOutlinePlay className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 dark:text-gray-500 group-hover:text-brand-500 dark:group-hover:text-brand-400" />
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
