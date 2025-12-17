"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { DashboardLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlinePlay,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineChartBar,
  HiOutlineStar,
  HiOutlineBadgeCheck,
} from "react-icons/hi";
import { HiOutlineTrophy } from "react-icons/hi2";
import { getFullImageUrl } from "@/lib/image-utils";

interface DashboardData {
  student: any;
  recentCourses: any[];
  recentCertificates: any[];
  stats: {
    totalEnrollments: number;
    completedCourses: number;
    inProgressCourses: number;
    totalCertificates: number;
    completedLessons: number;
    totalLearningHours: number;
  };
}

export default function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error("Failed to fetch dashboard");
      }

      const dashboardData = await response.json();
      
      // Transform image URLs in the response
      const transformedCourses = dashboardData.recentCourses?.map((enrollment: any) => ({
        ...enrollment,
        course: {
          ...enrollment.course,
          thumbnail: getFullImageUrl(enrollment.course.thumbnail, 'course'),
          instructor: {
            ...enrollment.course.instructor,
            avatar: getFullImageUrl(enrollment.course.instructor?.avatar, 'avatar'),
          },
        },
      })) || [];

      const transformedCertificates = dashboardData.recentCertificates?.map((cert: any) => ({
        ...cert,
        certificateUrl: getFullImageUrl(cert.certificateUrl, 'general'),
      })) || [];

      setData({
        ...dashboardData,
        recentCourses: transformedCourses,
        recentCertificates: transformedCertificates,
      });
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      toast.error("Failed to load dashboard", {
        description: "Please try refreshing the page",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Student Dashboard" />
        <DashboardLoadingSkeleton />
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Student Dashboard" />
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Student Dashboard" />
      
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Enrolled Courses</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{data.stats.totalEnrollments}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{data.stats.completedCourses}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineBadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Certificates</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{data.stats.totalCertificates}</p>
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
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{Math.round(data.stats.totalLearningHours)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{data.stats.inProgressCourses}</p>
            </div>
            <HiOutlinePlay className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Lessons Done</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{data.stats.completedLessons}</p>
            </div>
            <HiOutlineBookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Avg Progress</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                {data.stats.totalEnrollments > 0 
                  ? Math.round((data.stats.completedCourses / data.stats.totalEnrollments) * 100)
                  : 0}%
              </p>
            </div>
            <HiOutlineChartBar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Achievements</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{data.stats.totalCertificates}</p>
            </div>
            <HiOutlineTrophy className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Continue Learning */}
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Continue Learning</h3>
            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
              {data.recentCourses.length} active
            </span>
          </div>
          <div className="space-y-3">
            {!data.recentCourses || data.recentCourses.length === 0 ? (
              <div className="text-center py-8">
                <HiOutlineAcademicCap className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 opacity-50" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No courses enrolled yet
                </p>
                <button
                  onClick={() => router.push("/academy/courses")}
                  className="mt-4 rounded-md bg-brand-500 hover:bg-brand-600 px-4 py-2 text-sm text-white transition-colors"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              data.recentCourses.slice(0, 5).map((enrollment: any) => (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors cursor-pointer"
                  onClick={() =>
                  router.push(`/student/courses/${enrollment.course.id}`)
                  }
                >
                  {enrollment.course.thumbnail ? (
                  <Image
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    width={120}
                    height={60}
                    className="rounded-md object-cover w-32 h-16"
                  />
                  ) : (
                  <div className="h-16 w-32 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <HiOutlineAcademicCap className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  )}
                  <div className="flex-1">
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-1">
                    {enrollment.course.title}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {enrollment.course.instructor.name}
                  </p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-brand-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {Math.round(enrollment.progress)}% complete
                    </p>
                    <HiOutlinePlay className="h-3.5 w-3.5 text-brand-500" />
                    </div>
                  </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {data.recentCourses && data.recentCourses.length > 0 && (
            <button
              onClick={() => router.push("/student/courses")}
              className="mt-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              View All Courses
            </button>
          )}
        </div>

        {/* Recent Achievements */}
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Achievements</h3>
            <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full dark:bg-yellow-900/20 dark:text-yellow-400">
              {data.recentCertificates.length} earned
            </span>
          </div>
          <div className="space-y-3">
            {!data.recentCertificates || data.recentCertificates.length === 0 ? (
              <div className="text-center py-8">
                <HiOutlineBadgeCheck className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 opacity-50" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  No certificates earned yet
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Complete courses to earn certificates
                </p>
              </div>
            ) : (
              data.recentCertificates.slice(0, 5).map((certificate: any) => (
                <div
                  key={certificate.id}
                  className="flex items-center gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-500/15">
                    <HiOutlineBadgeCheck className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-1">
                      {certificate.courseName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Issued on{" "}
                      {new Date(certificate.issuedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <HiOutlineCheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
                </div>
              ))
            )}
          </div>
          {data.recentCertificates && data.recentCertificates.length > 0 && (
            <button
              onClick={() => router.push("/student/certificates")}
              className="mt-4 w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            >
              View All Certificates
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-3">
          <button
            onClick={() => router.push("/academy/courses")}
            className="flex items-center gap-3 rounded-md border border-gray-300 p-3 sm:p-4 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineAcademicCap className="h-5 w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Browse Courses</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Discover new courses
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push("/student/progress")}
            className="flex items-center gap-3 rounded-md border border-gray-300 p-3 sm:p-4 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineChartBar className="h-5 w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">View Progress</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Track your learning
              </p>
            </div>
          </button>

          <button
            onClick={() => router.push("/student/certificates")}
            className="flex items-center gap-3 rounded-md border border-gray-300 p-3 sm:p-4 text-left hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlineBadgeCheck className="h-5 w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">My Certificates</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                View achievements
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
