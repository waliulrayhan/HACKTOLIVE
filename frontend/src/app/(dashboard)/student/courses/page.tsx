"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import { getFullImageUrl } from "@/lib/image-utils";
import Badge from "@/components/ui/badge/Badge";
import {
  HiOutlineAcademicCap,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlinePlay,
  HiOutlineFilter,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { FiUser } from "react-icons/fi";

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
    // Filter by status
    if (filter !== "ALL" && enrollment.status !== filter) return false;
    return true;
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

      {/* Filter Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
              <HiOutlineFilter className="h-4 w-4" />
              <span>Status:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("ALL")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filter === "ALL"
                    ? "bg-brand-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                All <span className="ml-1 opacity-75">({enrollments.length})</span>
              </button>
              <button
                onClick={() => setFilter("ACTIVE")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filter === "ACTIVE"
                    ? "bg-green-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                In Progress <span className="ml-1 opacity-75">({enrollments.filter((e) => e.status === "ACTIVE").length})</span>
              </button>
              <button
                onClick={() => setFilter("COMPLETED")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  filter === "COMPLETED"
                    ? "bg-purple-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                Completed <span className="ml-1 opacity-75">({enrollments.filter((e) => e.status === "COMPLETED").length})</span>
              </button>
            </div>
          </div>

          {/* Browse Button */}
          <button
            onClick={() => router.push("/academy/courses")}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors whitespace-nowrap"
          >
            <HiOutlineAcademicCap className="h-5 w-5" />
            <span>Browse Courses</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredEnrollments.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-white/5 dark:bg-white/3">
          <div className="mx-auto max-w-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <HiOutlineAcademicCap className="h-10 w-10 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
              {filter === "ALL"
                ? "No courses enrolled yet"
                : `No ${filter.toLowerCase()} courses`}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {filter === "ALL"
                ? "Start your learning journey by enrolling in courses from our courses."
                : `You don't have any ${filter.toLowerCase()} courses at the moment.`}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => router.push("/academy/courses")}
                className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
              >
                Browse All Courses
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-xl hover:-translate-y-1 dark:border-white/5 dark:bg-white/3 cursor-pointer"
              onClick={() =>
                router.push(`/student/courses/${enrollment.course.id}`)
              }
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                {enrollment.course.thumbnail ? (
                  <Image
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <HiOutlineAcademicCap className="h-16 w-16 text-gray-400 dark:text-gray-500 opacity-50" />
                  </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Status Badge */}
                <div className="absolute right-3 top-3">
                  {enrollment.status === "COMPLETED" ? (
                    <Badge color="success" variant="solid" size="sm">
                      <HiOutlineCheckCircle className="h-3.5 w-3.5" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge color="primary" variant="solid" size="sm">
                      <HiOutlinePlay className="h-3.5 w-3.5" />
                      In Progress
                    </Badge>
                  )}
                </div>

                {/* Tier Badge */}
                <div className="absolute left-3 top-3">
                  <Badge 
                    color={enrollment.course.tier === "premium" ? "warning" : "success"} 
                    variant="solid" 
                    size="sm"
                  >
                    {enrollment.course.tier.toUpperCase()}
                  </Badge>
                </div>

                {/* Progress Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="flex items-center justify-between text-white text-xs font-medium mb-1.5">
                    <span>Progress</span>
                    <span>{Math.round(enrollment.progress)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
                    <div
                      className={`h-full rounded-full transition-all ${
                        enrollment.status === "COMPLETED" 
                          ? "bg-green-500" 
                          : "bg-brand-500"
                      }`}
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5">
                {/* Category & Level */}
                <div className="mb-3 flex items-center gap-2 flex-wrap">
                  <Badge color="info" size="sm">
                    {formatCategory(enrollment.course.category)}
                  </Badge>
                  <Badge 
                    color={
                      enrollment.course.level === "BEGINNER" ? "success" :
                      enrollment.course.level === "INTERMEDIATE" ? "warning" : "error"
                    }
                    size="sm"
                  >
                    {enrollment.course.level}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-base sm:text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors min-h-[3rem]">
                  {enrollment.course.title}
                </h3>

                {/* Description */}
                <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  {enrollment.course.shortDescription}
                </p>

                {/* Instructor */}
                <div className="mb-4 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                  {enrollment.course.instructor.avatar ? (
                    <Image
                      src={enrollment.course.instructor.avatar}
                      alt={enrollment.course.instructor.name}
                      width={24}
                      height={24}
                      className="rounded-full ring-2 ring-gray-200 dark:ring-gray-700"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                      <FiUser className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium line-clamp-1">
                    {enrollment.course.instructor.name}
                  </span>
                </div>

                {/* Stats */}
                <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2">
                    <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                      <HiOutlineStar className="h-4 w-4" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {enrollment.course.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Rating</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2">
                    <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                      <HiOutlineBookOpen className="h-4 w-4" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {getTotalLessons(enrollment.course.modules)}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Lessons</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-2">
                    <div className="flex items-center justify-center gap-1 text-purple-500 mb-1">
                      <HiOutlineClock className="h-4 w-4" />
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {Math.floor(enrollment.course.duration / 60)}h
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Duration</p>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/student/courses/${enrollment.course.id}`);
                  }}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-md ${
                    enrollment.status === "COMPLETED"
                      ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                      : "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700"
                  }`}
                >
                  <HiOutlinePlay className="h-4 w-4" />
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

