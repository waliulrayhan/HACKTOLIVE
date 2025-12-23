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
import { HiOutlineTrophy } from "react-icons/hi2";

interface EnrollmentStats {
  byMonth: Record<string, number>;
  byCourse: Record<string, number>;
  total: number;
}

interface RevenueStats {
  totalRevenue: number;
  revenueByMonth: Record<string, number>;
}

interface PopularCourse {
  id: string;
  title: string;
  totalStudents: number;
  rating: number;
  price: number;
  instructor: {
    name: string;
  };
  _count?: {
    enrollments: number;
    reviews: number;
  };
}

interface TopInstructor {
  id: string;
  name: string;
  rating: number;
  totalStudents: number;
  totalCourses: number;
}

export default function AnalyticsPage() {
  const [enrollmentStats, setEnrollmentStats] = useState<EnrollmentStats | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [popularCourses, setPopularCourses] = useState<PopularCourse[]>([]);
  const [topInstructors, setTopInstructors] = useState<TopInstructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {    document.title = "Platform Analytics - HACKTOLIVE Academy";
  }, []);

  useEffect(() => {    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [enrollmentsRes, revenueRes, popularCoursesRes, topInstructorsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics/enrollments`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics/revenue`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics/popular-courses`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics/top-instructors`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (!enrollmentsRes.ok || !revenueRes.ok || !popularCoursesRes.ok || !topInstructorsRes.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const [enrollment, revenue, courses, instructors] = await Promise.all([
        enrollmentsRes.json(),
        revenueRes.json(),
        popularCoursesRes.json(),
        topInstructorsRes.json(),
      ]);

      setEnrollmentStats(enrollment);
      setRevenueStats(revenue);
      setPopularCourses(courses);
      setTopInstructors(instructors);
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
        <PageBreadcrumb pageTitle="System Analytics" />
        <AnalyticsLoadingSkeleton />
      </div>
    );
  }

  const sortedMonths = enrollmentStats 
    ? Object.keys(enrollmentStats.byMonth).sort()
    : [];

  const revenueMonths = revenueStats?.revenueByMonth
    ? Object.keys(revenueStats.revenueByMonth).sort()
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
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{enrollmentStats?.total || 0}</p>
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
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{(revenueStats?.totalRevenue || 0).toLocaleString()} Tk</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Popular Courses</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{popularCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/15">
              <HiOutlineTrophy className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Top Instructors</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{topInstructors.length}</p>
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
            <HiOutlineTrendingUp className="h-5 w-5 text-brand-500" />
          </div>
          <div className="space-y-3">
            {sortedMonths.slice(-6).map((month) => {
              const count = enrollmentStats?.byMonth[month] || 0;
              const maxCount = Math.max(...Object.values(enrollmentStats?.byMonth || {}), 1);
              const percentage = (count / maxCount) * 100;
              
              return (
                <div key={month}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{month}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {count} students
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className="h-2 bg-brand-500 rounded-full transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {sortedMonths.length === 0 && (
              <p className="text-center py-4 text-gray-500 dark:text-gray-400">No enrollment data available</p>
            )}
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
            {revenueMonths.slice(-6).map((month) => {
              const amount = revenueStats?.revenueByMonth[month] || 0;
              const maxAmount = Math.max(...Object.values(revenueStats?.revenueByMonth || {}), 1);
              const percentage = (amount / maxAmount) * 100;
              
              return (
                <div key={month}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{month}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                    <div
                      className="h-2 bg-green-500 rounded-full transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {revenueMonths.length === 0 && (
              <p className="text-center py-4 text-gray-500 dark:text-gray-400">No revenue data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Popular Courses & Top Instructors */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Popular Courses */}
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Top Performing Courses
            </h3>
            <span className="px-2 py-1 text-xs font-medium text-brand-700 bg-brand-100 rounded-full dark:bg-brand-900/20 dark:text-brand-400">
              By Students
            </span>
          </div>
          <div className="space-y-3">
            {popularCourses.slice(0, 5).map((course, index) => (
              <div key={course.id} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
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
                      <HiOutlineStar className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      {course.rating.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <HiOutlineCurrencyDollar className="h-3 w-3" />
                      {course.price === 0 ? 'Free' : `${course.price.toLocaleString()} Tk`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {popularCourses.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <HiOutlineAcademicCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No course data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Instructors */}
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Top Instructors
            </h3>
            <HiOutlineTrophy className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {topInstructors.slice(0, 5).map((instructor, index) => (
              <div key={instructor.id} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      index === 1 ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                      index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                      'bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400'
                    }`}>
                      {index + 1}
                    </span>
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-1">
                      {instructor.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 ml-8">
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <HiOutlineStar className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      {instructor.rating.toFixed(1)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <HiOutlineUsers className="h-3 w-3" />
                      {instructor.totalStudents.toLocaleString()} students
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <HiOutlineAcademicCap className="h-3 w-3" />
                      {instructor.totalCourses} courses
                    </p>
                  </div>
                </div>
                {index < 3 && (
                  <HiOutlineTrophy className={`h-5 w-5 sm:h-6 sm:w-6 shrink-0 ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                    'text-orange-600'
                  }`} />
                )}
              </div>
            ))}
            {topInstructors.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <HiOutlineUsers className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No instructor data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Performance Table */}
      <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Course Performance Overview
          </h3>
          <HiOutlineChartBar className="h-5 w-5 text-brand-500" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/5">
                <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Course
                </th>
                <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Instructor
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Students
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Rating
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Price
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 py-3 px-2">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {popularCourses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-gray-200 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <td className="py-3 px-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                      {course.title}
                    </p>
                  </td>
                  <td className="py-3 px-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {course.instructor.name}
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
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {course.price === 0 ? 'Free' : `${course.price.toLocaleString()} Tk`}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {(course.price * course.totalStudents).toLocaleString()} Tk
                    </span>
                  </td>
                </tr>
              ))}
              {popularCourses.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <HiOutlineAcademicCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No course data available</p>
                    </div>
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
