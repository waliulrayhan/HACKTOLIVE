"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { FaChartLine, FaDollarSign, FaUsers, FaBook, FaStar, FaTrophy } from "react-icons/fa";

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

      if (!enrollmentRes.ok || !revenueRes.ok || !coursesRes.ok || !instructorsRes.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const [enrollment, revenue, courses, instructors] = await Promise.all([
        enrollmentRes.json(),
        revenueRes.json(),
        coursesRes.json(),
        instructorsRes.json(),
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
    <div>
      <PageBreadcrumb pageTitle="System Analytics" />
      
      <div className="mt-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive system insights and metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrollments</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {enrollmentStats?.total || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                <FaUsers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  ${(revenueStats?.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/20">
                <FaDollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Popular Courses</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {popularCourses.length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                <FaBook className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Instructors</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {topInstructors.length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg dark:bg-orange-900/20">
                <FaTrophy className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Enrollment Trends */}
          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center gap-2 mb-6">
              <FaChartLine className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Enrollment Trends</h3>
            </div>
            <div className="space-y-3">
              {sortedMonths.map((month) => {
                const count = enrollmentStats?.byMonth[month] || 0;
                const maxCount = Math.max(...Object.values(enrollmentStats?.byMonth || {}));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return (
                  <div key={month}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{count}</span>
                    </div>
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                      <div 
                        className="h-full transition-all bg-blue-600 rounded-full"
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
          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center gap-2 mb-6">
              <FaDollarSign className="text-green-600 dark:text-green-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue by Month</h3>
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
                    <div className="h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                      <div 
                        className="h-full transition-all bg-green-600 rounded-full"
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Popular Courses */}
          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center gap-2 mb-6">
              <FaBook className="text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Most Popular Courses</h3>
            </div>
            <div className="space-y-4">
              {popularCourses.slice(0, 5).map((course, index) => (
                <div key={course.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                  <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white bg-linear-to-br from-purple-500 to-blue-600 rounded-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{course.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">By: {course.instructor.name}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="font-medium">{course.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-blue-600" />
                        <span>{course.totalStudents}</span>
                      </div>
                      <span className="font-semibold text-green-600">${course.price}</span>
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
          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center gap-2 mb-6">
              <FaTrophy className="text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Instructors</h3>
            </div>
            <div className="space-y-4">
              {topInstructors.slice(0, 5).map((instructor, index) => (
                <div key={instructor.id} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                  <div className={`flex items-center justify-center w-10 h-10 text-lg font-bold rounded-full ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    index === 1 ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                    index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {instructor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{instructor.name}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="font-medium">{instructor.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <FaUsers />
                        <span>{instructor.totalStudents.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                        <FaBook />
                        <span>{instructor.totalCourses}</span>
                      </div>
                    </div>
                  </div>
                  {index < 3 && (
                    <FaTrophy className={`text-xl ${
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
          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <h3 className="mb-6 text-lg font-bold text-gray-900 dark:text-white">Enrollment Distribution</h3>
            <div className="space-y-4">
              {topCourses.map(([courseName, count]) => {
                const maxCount = Math.max(...topCourses.map(([, c]) => c));
                const percentage = (count / maxCount) * 100;
                
                return (
                  <div key={courseName}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white line-clamp-1">{courseName}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{count}</span>
                    </div>
                    <div className="h-3 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                      <div 
                        className="h-full transition-all bg-linear-to-r from-blue-600 to-purple-600 rounded-full"
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
    </div>
  );
}
