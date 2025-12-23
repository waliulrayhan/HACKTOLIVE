"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { getFullImageUrl } from "@/lib/image-utils";
import { DashboardLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineTrendingUp,
  HiOutlineChartBar,
  HiOutlineClipboardCheck,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";

interface ProgressData {
  student: any;
  courseProgress: Array<{
    course: any;
    enrollment: any;
    totalLessons: number;
    completedLessons: number;
    progress: number;
  }>;
  totalCompletedLessons: number;
  totalQuizAttempts: number;
  passedQuizzes: number;
  totalAssignments: number;
  gradedAssignments: number;
}

export default function ProgressPage() {
  const router = useRouter();
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Learning Progress - HACKTOLIVE Academy";
  }, []);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/progress`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch progress");

      const progressData = await response.json();
      
      // Transform image URLs in course progress
      const transformedProgressData = {
        ...progressData,
        courseProgress: progressData.courseProgress?.map((item: any) => ({
          ...item,
          course: {
            ...item.course,
            thumbnail: getFullImageUrl(item.course.thumbnail, 'course'),
            instructor: {
              ...item.course.instructor,
              avatar: getFullImageUrl(item.course.instructor?.avatar, 'avatar'),
            },
          },
        })) || [],
      };
      
      setData(transformedProgressData);
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Failed to load progress", {
        description: "Please try refreshing the page",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Progress" />
        <DashboardLoadingSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Progress" />
        <div className="rounded-md border border-gray-200 bg-white p-8 sm:p-12 text-center dark:border-white/5 dark:bg-white/3">
          <HiOutlineChartBar className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 opacity-50" />
          <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  const quizSuccessRate = data.totalQuizAttempts > 0
    ? (data.passedQuizzes / data.totalQuizAttempts) * 100
    : 0;

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="My Progress" />

      {/* Overall Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Total Courses
              </p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {data.courseProgress.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Completed Lessons
              </p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {data.totalCompletedLessons}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineQuestionMarkCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Quiz Success Rate
              </p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {Math.round(quizSuccessRate)}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/15">
              <HiOutlineClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Assignments
              </p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {data.totalAssignments}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <h2 className="mb-4 sm:mb-6 text-base sm:text-lg font-bold text-gray-900 dark:text-white">
          Course Progress
        </h2>

        {data.courseProgress.length === 0 ? (
          <div className="py-8 sm:py-12 text-center">
            <HiOutlineAcademicCap className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 opacity-50" />
            <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              No courses enrolled
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Start learning by browsing available courses
            </p>
            <button
              onClick={() => router.push("/academy/courses")}
              className="mt-6 rounded-md bg-brand-500 px-6 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {data.courseProgress.map((item) => (
              <div
                key={item.course.id}
                className="cursor-pointer rounded-md border border-gray-200 p-3 sm:p-4 transition-all hover:shadow-md dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10"
                onClick={() => router.push(`/student/courses/${item.course.id}`)}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                    {/* Thumbnail (2:1 aspect ratio) */}
                    <div className="relative w-28 sm:w-32 aspect-[2/1] shrink-0 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700">
                    {item.course.thumbnail ? (
                      <Image
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      fill
                      className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                      <HiOutlineAcademicCap className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {item.course.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                          {item.course.instructor.name}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium ${
                          item.enrollment.status === "COMPLETED"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                        }`}
                      >
                        {item.enrollment.status === "COMPLETED"
                          ? "Completed"
                          : "In Progress"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="mb-1 flex items-center justify-between text-[10px] sm:text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.completedLessons} of {item.totalLessons} lessons
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {Math.round(item.progress)}%
                        </span>
                      </div>
                      <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-all"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <HiOutlineChartBar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="line-clamp-1">
                          {item.course.category.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HiOutlineTrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>{item.course.level}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Quiz Performance
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Total Attempts
              </span>
              <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {data.totalQuizAttempts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Passed
              </span>
              <span className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-500">
                {data.passedQuizzes}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Success Rate
              </span>
              <span className="text-base sm:text-lg font-semibold text-brand-600 dark:text-brand-400">
                {Math.round(quizSuccessRate)}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Assignment Status
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Total Submissions
              </span>
              <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {data.totalAssignments}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Graded
              </span>
              <span className="text-base sm:text-lg font-semibold text-green-600 dark:text-green-500">
                {data.gradedAssignments}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Pending
              </span>
              <span className="text-base sm:text-lg font-semibold text-orange-600 dark:text-orange-500">
                {data.totalAssignments - data.gradedAssignments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
