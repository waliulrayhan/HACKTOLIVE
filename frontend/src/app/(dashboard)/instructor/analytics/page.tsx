"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { AnalyticsLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineStar,
  HiOutlineTrendingUp,
  HiOutlineCheckCircle,
} from "react-icons/hi";

interface AnalyticsData {
  instructor: any;
  enrollmentsByMonth: Record<string, number>;
  enrollmentsByCourse: Record<string, number>;
  revenueByMonth: Record<string, number>;
  studentProgressByMonth: Record<string, number>;
  topCourses: Array<{
    id: string;
    title: string;
    totalStudents: number;
    rating: number;
    revenue: number;
  }>;
}

export default function InstructorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics', {
        description: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Analytics & Insights" />
        <AnalyticsLoadingSkeleton />
      </div>
    );
  }

  const totalEnrollments = analytics?.instructor?.courses?.reduce(
    (sum: number, course: any) => sum + course.totalStudents,
    0
  ) || 0;

  const totalRevenue = analytics?.instructor?.courses?.reduce(
    (sum: number, course: any) => sum + (course.price * course.totalStudents),
    0
  ) || 0;

  const publishedCourses = analytics?.instructor?.courses?.filter(
    (c: any) => c.status === 'PUBLISHED'
  ).length || 0;

  const avgRating = analytics?.instructor?.rating || 0;

  const enrollmentMonths = analytics?.enrollmentsByMonth 
    ? Object.keys(analytics.enrollmentsByMonth).sort()
    : [];

  const revenueMonths = analytics?.revenueByMonth
    ? Object.keys(analytics.revenueByMonth).sort()
    : [];

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Analytics & Insights" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Enrollments</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{totalEnrollments}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlineCurrencyDollar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Active Courses</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{publishedCourses}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-500/15">
              <HiOutlineStar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Enrollment Trends */}
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Enrollment Trends
            </h3>
            <HiOutlineChartBar className="h-5 w-5 text-brand-500" />
          </div>
          <div className="space-y-3">
            {enrollmentMonths.slice(-6).map((month) => (
              <div key={month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{month}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {analytics?.enrollmentsByMonth[month]} students
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className="h-2 bg-brand-500 rounded-full transition-all"
                    style={{
                      width: `${
                        Math.min(
                          ((analytics?.enrollmentsByMonth?.[month] ?? 0) / 
                            Math.max(...Object.values(analytics?.enrollmentsByMonth || {}), 1)) * 100,
                          100
                        )
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Trends */}
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Revenue Trends
            </h3>
            <HiOutlineCurrencyDollar className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            {revenueMonths.slice(-6).map((month) => (
              <div key={month}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{month}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${analytics?.revenueByMonth[month].toLocaleString()}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all"
                    style={{
                      width: `${
                        Math.min(
                          ((analytics?.revenueByMonth?.[month] ?? 0) / 
                            Math.max(...Object.values(analytics?.revenueByMonth || {}), 1)) * 100,
                          100
                        )
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Courses */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Top Performing Courses
          </h3>
          <span className="px-2 py-1 text-xs font-medium text-brand-700 bg-brand-100 rounded-full dark:bg-brand-900/20 dark:text-brand-400">
            By Revenue
          </span>
        </div>
        <div className="space-y-3">
          {analytics?.instructor?.courses
            ?.sort((a: any, b: any) => (b.price * b.totalStudents) - (a.price * a.totalStudents))
            .slice(0, 5)
            .map((course: any, index: number) => {
              const revenue = course.price * course.totalStudents;
              return (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                        {index + 1}
                      </span>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-1">
                        {course.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-1 ml-8">
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <HiOutlineUsers className="h-3 w-3" />
                        {course.totalStudents} students
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <HiOutlineStar className="h-3 w-3" />
                        {course.rating.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <HiOutlineCurrencyDollar className="h-3 w-3" />
                        ${revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          {(!analytics?.instructor?.courses || analytics.instructor.courses.length === 0) && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <HiOutlineAcademicCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No courses yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Course Performance Breakdown */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Course Performance Breakdown
          </h3>
          <HiOutlineTrendingUp className="h-5 w-5 text-brand-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/5">
                <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Course
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Students
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Rating
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Reviews
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Revenue
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {analytics?.instructor?.courses?.map((course: any) => (
                <tr
                  key={course.id}
                  className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <td className="py-3 px-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                      {course.title}
                    </p>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {course.totalStudents}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <HiOutlineStar className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {course.rating.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {course.totalRatings}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${(course.price * course.totalStudents).toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        course.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {course.status === 'PUBLISHED' && (
                        <HiOutlineCheckCircle className="h-3 w-3 mr-1" />
                      )}
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!analytics?.instructor?.courses || analytics.instructor.courses.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No courses available
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
