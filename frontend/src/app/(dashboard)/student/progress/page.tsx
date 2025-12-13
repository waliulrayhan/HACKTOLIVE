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
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const quizSuccessRate = data.totalQuizAttempts > 0
    ? (data.passedQuizzes / data.totalQuizAttempts) * 100
    : 0;

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="My Progress" />

      {/* Overall Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
              <HiOutlineAcademicCap className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Courses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.courseProgress.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
              <HiOutlineCheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completed Lessons
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.totalCompletedLessons}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
              <HiOutlineQuestionMarkCircle className="h-8 w-8 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quiz Success Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(quizSuccessRate)}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
              <HiOutlineClipboardCheck className="h-8 w-8 text-orange-600 dark:text-orange-300" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Assignments
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.totalAssignments}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
        <h2 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
          Course Progress
        </h2>

        {data.courseProgress.length === 0 ? (
          <div className="py-12 text-center">
            <HiOutlineAcademicCap className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No courses enrolled
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Start learning by browsing available courses
            </p>
            <button
              onClick={() => router.push("/student/browse")}
              className="mt-6 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {data.courseProgress.map((item) => (
              <div
                key={item.course.id}
                className="cursor-pointer rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md dark:border-gray-700"
                onClick={() => router.push(`/student/courses/${item.course.id}`)}
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                    {item.course.thumbnail ? (
                      <Image
                        src={item.course.thumbnail}
                        alt={item.course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <HiOutlineAcademicCap className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.course.instructor.name}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.enrollment.status === "COMPLETED"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {item.enrollment.status === "COMPLETED"
                          ? "Completed"
                          : "In Progress"}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.completedLessons} of {item.totalLessons} lessons
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {Math.round(item.progress)}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all dark:bg-blue-500"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <HiOutlineChartBar className="h-4 w-4" />
                        <span>
                          {item.course.category.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <HiOutlineTrendingUp className="h-4 w-4" />
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Quiz Performance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Attempts
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {data.totalQuizAttempts}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Passed
              </span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                {data.passedQuizzes}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Success Rate
              </span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {Math.round(quizSuccessRate)}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Assignment Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Submissions
              </span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {data.totalAssignments}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Graded
              </span>
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                {data.gradedAssignments}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </span>
              <span className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                {data.totalAssignments - data.gradedAssignments}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
