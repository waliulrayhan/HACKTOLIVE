"use client";

import React from "react";
import Image from "next/image";
import {
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import { HiOutlineSignal } from "react-icons/hi2";
import Badge from "@/components/ui/badge/Badge";

interface CourseHeaderProps {
  course: {
    id: string;
    title: string;
    shortDescription: string;
    thumbnail?: string;
    category: string;
    level: string;
    tier: string;
    deliveryMode: string;
    rating: number;
    totalRatings: number;
    totalStudents: number;
    duration: number;
    startDate?: string;
    endDate?: string;
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
  };
  enrollment: {
    progress: number;
    status: string;
    enrolledAt: string;
  };
  completedLessons: number;
  totalLessons: number;
}

export default function CourseHeader({
  course,
  enrollment,
  completedLessons,
  totalLessons,
}: CourseHeaderProps) {
  const isLiveCourse = course.deliveryMode === "LIVE";
  const isPremium = course.tier === "PREMIUM";
  const instructorName = course.instructor.user?.name || course.instructor.name;
  const instructorAvatar = course.instructor.user?.avatar || course.instructor.avatar;

  const formatCategory = (category: string) => {
    return category.replace(/_/g, " ");
  };

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-brand-600 via-brand-700 to-purple-700 dark:from-brand-800 dark:via-brand-900 dark:to-purple-900">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
        <div className="relative px-6 py-8 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Course Info */}
            <div className="flex-1 text-white">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge
                  color={isPremium ? "warning" : "success"}
                  variant="solid"
                  size="sm"
                >
                  {course.tier}
                </Badge>
                {isLiveCourse && (
                  <Badge color="error" variant="solid" size="sm">
                    <HiOutlineSignal className="h-3 w-3" />
                    Live Batch
                  </Badge>
                )}
                <Badge color="light" size="sm">
                  {formatCategory(course.category)}
                </Badge>
                <Badge
                  color={
                    course.level === "FUNDAMENTAL"
                      ? "success"
                      : course.level === "INTERMEDIATE"
                      ? "warning"
                      : "error"
                  }
                  size="sm"
                >
                  {course.level}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">
                {course.title}
              </h1>

              {/* Description */}
              <p className="text-white/80 text-sm lg:text-base mb-6 max-w-2xl line-clamp-2">
                {course.shortDescription}
              </p>

              {/* Instructor */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/30">
                  {instructorAvatar ? (
                    <Image
                      src={instructorAvatar.startsWith("http") ? instructorAvatar : `${process.env.NEXT_PUBLIC_API_URL}${instructorAvatar}`}
                      alt={instructorName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full bg-white/20 flex items-center justify-center">
                      <span className="text-lg font-semibold text-white">
                        {instructorName?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-white/60">Instructor</p>
                  <p className="text-sm font-semibold">{instructorName}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <HiOutlineStar className="h-4 w-4 text-yellow-400" />
                  <span className="font-semibold">{course.rating.toFixed(1)}</span>
                  <span className="text-white/60">({course.totalRatings} ratings)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HiOutlineUsers className="h-4 w-4 text-white/60" />
                  <span>{course.totalStudents.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HiOutlineClock className="h-4 w-4 text-white/60" />
                  <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HiOutlineBookOpen className="h-4 w-4 text-white/60" />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>

              {/* Live Course Schedule */}
              {isLiveCourse && (course.startDate || course.liveSchedule) && (
                <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-2 mb-2">
                    <HiOutlineCalendar className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold">Live Batch Schedule</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {course.startDate && (
                      <div>
                        <p className="text-white/60 text-xs">Start Date</p>
                        <p className="font-medium">
                          {new Date(course.startDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                    {course.endDate && (
                      <div>
                        <p className="text-white/60 text-xs">End Date</p>
                        <p className="font-medium">
                          {new Date(course.endDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                    {course.liveSchedule && (
                      <div className="sm:col-span-2">
                        <p className="text-white/60 text-xs">Schedule</p>
                        <p className="font-medium">{course.liveSchedule}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Progress Card */}
            <div className="lg:w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Your Progress
                </h3>
                {enrollment.status === "COMPLETED" ? (
                  <Badge color="success" size="sm">
                    <HiOutlineCheckCircle className="h-3 w-3" />
                    Completed
                  </Badge>
                ) : (
                  <Badge color="info" size="sm">
                    <HiOutlineTrendingUp className="h-3 w-3" />
                    In Progress
                  </Badge>
                )}
              </div>

              {/* Progress Circle */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative h-32 w-32">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${enrollment.progress * 2.51327} 251.327`}
                      className={`${
                        enrollment.status === "COMPLETED"
                          ? "text-green-500"
                          : "text-brand-500"
                      } transition-all duration-500`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {Math.round(enrollment.progress)}%
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Complete
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Lessons Completed</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {completedLessons} / {totalLessons}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Enrolled On</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
