"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import {
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineStar,
  HiOutlineTrendingUp,
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

  useEffect(() => {
    fetchAnalytics();
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
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading analytics...</div>
        </div>
      </div>
    );
  }

  const sortedMonths = enrollmentStats 
    ? Object.keys(enrollmentStats.byMonth).sort()
    : [];

  const topCourses = popularCourses 
    ? Object.entries(enrollmentStats?.byCourse || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="System Analytics" />
      
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
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">${(revenueStats?.totalRevenue || 0).toLocaleString()}</p>
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
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <HiOutlineTrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Enrollment Trends</h3>
          </div>
            <div className="space-y-3">
              {sortedMonths.map((month) => {
                const count = enrollmentStats?.byMonth[month] || 0;
                const maxCount = Math.max(...Object.values(enrollmentStats?.byMonth || {}));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return (
                  <div key={month}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-800">
                      <div 
                        className="h-full transition-all bg-blue-600 dark:bg-blue-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {sortedMonths.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">No enrollment data available</p>
              )}
            </div>
          </div>

        {/* Revenue Breakdown */}
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <HiOutlineCurrencyDollar className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Revenue by Month</h3>
          </div>
            <div className="space-y-3">
              {Object.keys(revenueStats?.revenueByMonth || {}).sort().map((month) => {
                const amount = revenueStats?.revenueByMonth[month] || 0;
                const maxAmount = Math.max(...Object.values(revenueStats?.revenueByMonth || {}));
                const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                
                return (
                  <div key={month}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ${amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-800">
                      <div 
                        className="h-full transition-all bg-green-600 dark:bg-green-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {Object.keys(revenueStats?.revenueByMonth || {}).length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">No revenue data available</p>
              )}
            </div>
          </div>
        </div>

      {/* Popular Courses & Top Instructors */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        {/* Popular Courses */}
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <HiOutlineAcademicCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Most Popular Courses</h3>
          </div>
          <div className="space-y-3">
            {popularCourses.slice(0, 5).map((course, index) => (
              <div key={course.id} className="flex items-start gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm font-bold text-white bg-linear-to-br from-purple-500 to-blue-600 rounded-lg shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-1">{course.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">By: {course.instructor.name}</p>
                  <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <HiOutlineStar className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <HiOutlineUsers className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{course.totalStudents}</span>
                    </div>
                    <span className="font-semibold text-green-600 dark:text-green-500">${course.price}</span>
                  </div>
                </div>
              </div>
              ))}
              {popularCourses.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400">No popular courses data</p>
              )}
            </div>
          </div>

        {/* Top Instructors */}
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <HiOutlineTrophy className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Top Instructors</h3>
          </div>
          <div className="space-y-3">
            {topInstructors.slice(0, 5).map((instructor, index) => (
              <div key={instructor.id} className="flex items-center gap-3 p-3 sm:p-4 border border-gray-200 rounded-lg dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-base sm:text-lg font-bold rounded-full shrink-0 ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    index === 1 ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                    index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {instructor.name.charAt(0)}
                  </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">{instructor.name}</h4>
                  <div className="flex items-center gap-3 sm:gap-4 mt-1 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <HiOutlineStar className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
                      <span className="font-medium text-gray-900 dark:text-white">{instructor.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <HiOutlineUsers className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{instructor.totalStudents.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <HiOutlineAcademicCap className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{instructor.totalCourses}</span>
                    </div>
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
                <p className="text-center text-gray-500 dark:text-gray-400">No instructor data</p>
              )}
            </div>
          </div>
        </div>

      {/* Top Courses by Enrollment */}
      {topCourses.length > 0 && (
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-4 sm:mb-6 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Enrollment Distribution</h3>
          <div className="space-y-3 sm:space-y-4">
            {topCourses.map(([courseName, count]) => {
              const maxCount = Math.max(...topCourses.map(([, c]) => c));
              const percentage = (count / maxCount) * 100;
              
              return (
                <div key={courseName}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{courseName}</span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{count}</span>
                  </div>
                  <div className="h-3 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-800">
                    <div 
                      className="h-full transition-all bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
