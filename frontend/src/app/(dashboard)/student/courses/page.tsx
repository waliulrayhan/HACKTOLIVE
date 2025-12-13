"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import { getFullImageUrl } from "@/lib/image-utils";
import {
  HiOutlineAcademicCap,
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlinePlay,
} from "react-icons/hi";

interface Enrollment {
  id: string;
  enrolledAt: string;
  status: string;
  progress: number;
  course: {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    thumbnail?: string;
    category: string;
    level: string;
    tier: string;
    rating: number;
    duration: number;
    instructor: {
      id: string;
      name: string;
      avatar?: string;
    };
    modules: Array<{
      id: string;
      lessons: any[];
    }>;
    _count?: {
      reviews: number;
    };
  };
}

export default function MyCoursesPage() {
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch courses");

      const data = await response.json();
      
      // Transform image URLs
      const transformedEnrollments = data.map((enrollment: Enrollment) => ({
        ...enrollment,
        course: {
          ...enrollment.course,
          thumbnail: getFullImageUrl(enrollment.course.thumbnail, 'course'),
          instructor: {
            ...enrollment.course.instructor,
            avatar: getFullImageUrl(enrollment.course.instructor?.avatar, 'avatar'),
          },
        },
      }));
      
      setEnrollments(transformedEnrollments);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (filter === "ALL") return true;
    return enrollment.status === filter;
  });

  const formatCategory = (category: string) => {
    return category.replace(/_/g, " ");
  };

  const getTotalLessons = (modules: any[]) => {
    return modules.reduce((sum, module) => sum + module.lessons.length, 0);
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Courses" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="My Courses" />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Courses</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{enrollments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlinePlay className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {enrollments.filter((e) => e.status === "ACTIVE").length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineBookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {enrollments.filter((e) => e.status === "COMPLETED").length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Hours</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {Math.floor(enrollments.reduce((sum, e) => sum + e.course.duration, 0) / 60)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Actions */}
      <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                filter === "ALL"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              All ({enrollments.length})
            </button>
            <button
              onClick={() => setFilter("ACTIVE")}
              className={`rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                filter === "ACTIVE"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              In Progress ({enrollments.filter((e) => e.status === "ACTIVE").length})
            </button>
            <button
              onClick={() => setFilter("COMPLETED")}
              className={`rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                filter === "COMPLETED"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Completed ({enrollments.filter((e) => e.status === "COMPLETED").length})
            </button>
          </div>
          <button
            onClick={() => router.push("/academy/courses")}
            className="rounded-md bg-brand-500 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Browse More Courses
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredEnrollments.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-white p-8 sm:p-12 text-center dark:border-white/5 dark:bg-white/3">
          <HiOutlineAcademicCap className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-600 opacity-50" />
          <h3 className="mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            No courses found
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {filter === "ALL"
              ? "You haven't enrolled in any courses yet."
              : `You don't have any ${filter.toLowerCase()} courses.`}
          </p>
          <button
            onClick={() => router.push("/academy/courses")}
            className="mt-6 rounded-md bg-brand-500 px-6 py-2 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="group overflow-hidden rounded-md border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-white/5 dark:bg-white/3 cursor-pointer"
              onClick={() =>
                router.push(`/student/courses/${enrollment.course.id}`)
              }
            >
              {/* Thumbnail */}
              <div className="relative h-40 sm:h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {enrollment.course.thumbnail ? (
                  <Image
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <HiOutlineAcademicCap className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute right-2 top-2">
                  {enrollment.status === "COMPLETED" ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      Completed
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                      In Progress
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                {/* Category & Level */}
                <div className="mb-2 flex items-center gap-2 flex-wrap">
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {formatCategory(enrollment.course.category)}
                  </span>
                  <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    {enrollment.course.level}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  {enrollment.course.title}
                </h3>

                {/* Instructor */}
                <div className="mb-3 flex items-center gap-2">
                  {enrollment.course.instructor.avatar ? (
                    <Image
                      src={enrollment.course.instructor.avatar}
                      alt={enrollment.course.instructor.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  )}
                  <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {enrollment.course.instructor.name}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-[10px] sm:text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      Progress
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.round(enrollment.progress)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-3 flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <HiOutlineStar className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                    <span>{enrollment.course.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineBookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>
                      {getTotalLessons(enrollment.course.modules)} lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HiOutlineClock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{Math.floor(enrollment.course.duration / 60)}h</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/student/courses/${enrollment.course.id}`);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-500 px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-brand-600"
                >
                  <HiOutlinePlay className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {enrollment.status === "COMPLETED"
                    ? "Review Course"
                    : "Continue Learning"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

