"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { getFullImageUrl } from "@/lib/image-utils";
import Badge from "@/components/ui/badge/Badge";
import {
  HiOutlineAcademicCap,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlinePlay,
  HiOutlineCheckCircle,
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList,
  HiOutlineCalendar,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import { HiOutlineSignal } from "react-icons/hi2";
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
    deliveryMode: string;
    rating: number;
    duration: number;
    startDate?: string;
    liveSchedule?: string;
    instructor: {
      id: string;
      name: string;
      avatar?: string;
      user?: {
        name?: string;
        avatar?: string;
      };
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
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    document.title = "My Courses - HACKTOLIVE Academy";
  }, []);

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
    if (filter !== "ALL" && enrollment.status !== filter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        enrollment.course.title.toLowerCase().includes(query) ||
        enrollment.course.instructor?.name?.toLowerCase().includes(query) ||
        enrollment.course.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const formatCategory = (category: string) => {
    return category.replace(/_/g, " ");
  };

  const getTotalLessons = (modules: any[]) => {
    return modules.reduce((sum, module) => sum + module.lessons.length, 0);
  };

  const getInstructorName = (instructor: any) => {
    return instructor?.user?.name || instructor?.name || "Instructor";
  };

  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter((e) => e.status === "ACTIVE").length,
    completed: enrollments.filter((e) => e.status === "COMPLETED").length,
    totalHours: Math.floor(enrollments.reduce((sum, e) => sum + e.course.duration, 0) / 60),
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb pageTitle="My Courses" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200 dark:bg-gray-700" />
              <div className="p-5 space-y-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="My Courses" />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Courses</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
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
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Learning Hours</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.totalHours}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { value: "ALL", label: "All", count: stats.total },
              { value: "ACTIVE", label: "In Progress", count: stats.inProgress },
              { value: "COMPLETED", label: "Completed", count: stats.completed },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${filter === tab.value
                    ? "bg-brand-500 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
              >
                {tab.label}
                <span className={`rounded-full px-2 py-0.5 text-xs ${filter === tab.value
                    ? "bg-white/20"
                    : "bg-gray-200 dark:bg-gray-600"
                  }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${viewMode === "grid"
                  ? "bg-brand-500 text-white"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              <HiOutlineViewGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${viewMode === "list"
                  ? "bg-brand-500 text-white"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
            >
              <HiOutlineViewList className="h-5 w-5" />
            </button>
          </div>

          {/* Browse More */}
          <button
            onClick={() => router.push("/academy/courses")}
            className="flex items-center gap-2 rounded-md bg-brand-500 px-5 py-3 text-sm font-medium text-white hover:bg-brand-600 transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
          >
            <HiOutlineAcademicCap className="h-5 w-5" />
            Browse Courses
          </button>
        </div>
      </div>

      {/* Course Grid/List */}
      {filteredEnrollments.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
              <HiOutlineAcademicCap className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery
                ? "No courses found"
                : filter === "ALL"
                  ? "Start Your Learning Journey"
                  : `No ${filter.toLowerCase()} courses`}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Browse our catalog and enroll in courses that interest you."}
            </p>
            <button
              onClick={() => router.push("/academy/courses")}
              className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
            >
              Explore Courses
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment) => (
            <CourseCard
              key={enrollment.id}
              enrollment={enrollment}
              onNavigate={() => router.push(`/student/courses/${enrollment.course.id}`)}
              formatCategory={formatCategory}
              getTotalLessons={getTotalLessons}
              getInstructorName={getInstructorName}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEnrollments.map((enrollment) => (
            <CourseListItem
              key={enrollment.id}
              enrollment={enrollment}
              onNavigate={() => router.push(`/student/courses/${enrollment.course.id}`)}
              formatCategory={formatCategory}
              getTotalLessons={getTotalLessons}
              getInstructorName={getInstructorName}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Course Card Component
function CourseCard({
  enrollment,
  onNavigate,
  formatCategory,
  getTotalLessons,
  getInstructorName,
}: {
  enrollment: Enrollment;
  onNavigate: () => void;
  formatCategory: (cat: string) => string;
  getTotalLessons: (modules: any[]) => number;
  getInstructorName: (instructor: any) => string;
}) {
  const course = enrollment.course;
  const isLive = course.deliveryMode === "LIVE";
  const isPremium = course.tier === "PREMIUM";
  const isCompleted = enrollment.status === "COMPLETED";

  return (
    <div
      onClick={onNavigate}
      className="group cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[2/1] overflow-hidden bg-gray-100 dark:bg-gray-700">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <HiOutlineAcademicCap className="h-16 w-16 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge color={isPremium ? "warning" : "success"} variant="solid" size="sm">
              {course.tier}
            </Badge>
            {isLive && (
              <Badge color="error" variant="solid" size="sm">
                <HiOutlineSignal className="h-3 w-3" />
                Live
              </Badge>
            )}
          </div>
          {isCompleted && (
            <Badge color="success" variant="solid" size="sm">
              <HiOutlineCheckCircle className="h-3 w-3" />
              Done
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center justify-between text-white text-xs font-medium mb-1.5">
            <span>Progress</span>
            <span>{Math.round(enrollment.progress)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/30 backdrop-blur-sm overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isCompleted ? "bg-green-400" : "bg-brand-400"
                }`}
              style={{ width: `${enrollment.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category & Level */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge color="info" size="sm">
            {formatCategory(course.category)}
          </Badge>
          <Badge
            color={
              course.level === "FUNDAMENTAL" ? "success" :
                course.level === "INTERMEDIATE" ? "warning" : "error"
            }
            size="sm"
          >
            {course.level}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors min-h-[3rem]">
          {course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative h-6 w-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
            {course.instructor?.avatar ? (
              <Image
                src={course.instructor.avatar}
                alt={getInstructorName(course.instructor)}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FiUser className="h-3 w-3 text-gray-400" />
              </div>
            )}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {getInstructorName(course.instructor)}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <HiOutlineStar className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{course.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <HiOutlineBookOpen className="h-4 w-4" />
            <span>{getTotalLessons(course.modules)} lessons</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <HiOutlineClock className="h-4 w-4" />
            <span>{Math.floor(course.duration / 60)}h</span>
          </div>
        </div>

        {/* Live Course Schedule */}
        {/* {isLive && course.startDate && (
        <div className="mt-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
          <HiOutlineCalendar className="h-4 w-4" />
          <span>
          Starts {new Date(course.startDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
          </span>
        </div>
        </div>
      )} */}

        {/* Action Button */}
        <button
          className={`mt-4 w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-md ${isCompleted
              ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              : "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700"
            }`}
        >
          {isCompleted ? (
            <>
              <HiOutlineTrendingUp className="h-5 w-5" />
              Review Course
            </>
          ) : (
            <>
              <HiOutlinePlay className="h-5 w-5" />
              Continue Learning
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// Course List Item Component
function CourseListItem({
  enrollment,
  onNavigate,
  formatCategory,
  getTotalLessons,
  getInstructorName,
}: {
  enrollment: Enrollment;
  onNavigate: () => void;
  formatCategory: (cat: string) => string;
  getTotalLessons: (modules: any[]) => number;
  getInstructorName: (instructor: any) => string;
}) {
  const course = enrollment.course;
  const isLive = course.deliveryMode === "LIVE";
  const isPremium = course.tier === "PREMIUM";
  const isCompleted = enrollment.status === "COMPLETED";

  return (
    <div
      onClick={onNavigate}
      className="group cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="relative h-48 sm:h-auto sm:w-64 shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <HiOutlineAcademicCap className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge color={isPremium ? "warning" : "success"} variant="solid" size="sm">
              {course.tier}
            </Badge>
            {isLive && (
              <Badge color="error" variant="solid" size="sm">
                <HiOutlineSignal className="h-3 w-3" />
                Live
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            <div className="flex-1">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge color="info" size="sm">
                  {formatCategory(course.category)}
                </Badge>
                <Badge
                  color={
                    course.level === "FUNDAMENTAL" ? "success" :
                      course.level === "INTERMEDIATE" ? "warning" : "error"
                  }
                  size="sm"
                >
                  {course.level}
                </Badge>
                {isCompleted && (
                  <Badge color="success" size="sm">
                    <HiOutlineCheckCircle className="h-3 w-3" />
                    Completed
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {course.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                {course.shortDescription}
              </p>

              {/* Instructor */}
              <div className="flex items-center gap-2">
                <div className="relative h-6 w-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {course.instructor?.avatar ? (
                    <Image
                      src={course.instructor.avatar}
                      alt={getInstructorName(course.instructor)}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FiUser className="h-3 w-3 text-gray-400" />
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {getInstructorName(course.instructor)}
                </span>
              </div>
            </div>

            {/* Right Side */}
            <div className="lg:w-48 lg:text-right">
              {/* Stats */}
              <div className="flex lg:flex-col items-center lg:items-end gap-3 lg:gap-1 mb-4">
                <div className="flex items-center gap-1 text-sm">
                  <HiOutlineStar className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{course.rating.toFixed(1)}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {getTotalLessons(course.modules)} lessons • {Math.floor(course.duration / 60)}h
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{Math.round(enrollment.progress)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isCompleted ? "bg-green-500" : "bg-brand-500"
                      }`}
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
              </div>

              {/* Action */}
              <button
                className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all ${isCompleted
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-brand-500 hover:bg-brand-600"
                  }`}
              >
                {isCompleted ? "Review" : "Continue"}
                <HiOutlinePlay className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

