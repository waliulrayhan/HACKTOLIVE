"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { DashboardLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineTrendingUp,
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineBadgeCheck,
} from "react-icons/hi";

interface DashboardStats {
  stats: {
    totalUsers: number;
    totalStudents: number;
    totalInstructors: number;
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    totalCertificates: number;
    totalRevenue: number;
  };
  recentEnrollments: any[];
  recentCourses: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard', {
        description: 'Please try refreshing the page',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Admin Dashboard" />
        <DashboardLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Admin Dashboard" />
      
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats?.stats.totalUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Courses</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats?.stats.totalCourses || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Enrollments</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats?.stats.activeEnrollments || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/15">
              <HiOutlineCurrencyDollar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Revenue</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{(stats?.stats.totalRevenue || 0).toLocaleString()} Tk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Students</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{stats?.stats.totalStudents || 0}</p>
            </div>
            <HiOutlineUserGroup className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Instructors</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{stats?.stats.totalInstructors || 0}</p>
            </div>
            <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Published</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{stats?.stats.publishedCourses || 0}</p>
            </div>
            <HiOutlineTrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Certificates</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{stats?.stats.totalCertificates || 0}</p>
            </div>
            <HiOutlineBadgeCheck className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Enrollments</h3>
            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
              {stats?.recentEnrollments.length || 0} new
            </span>
          </div>
          <div className="space-y-3">
            {stats?.recentEnrollments.slice(0, 5).map((enrollment: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${enrollment.student?.avatar}` || '/images/user/user-01.png'} 
                    alt={enrollment.student?.name || 'Student'}
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/images/user/user-01.png'; }}
                  />
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{enrollment.student?.name || 'Unknown Student'}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{enrollment.course?.title || 'Unknown Course'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    enrollment.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {enrollment.status}
                  </span>
                </div>
              ))}
              {(!stats?.recentEnrollments || stats.recentEnrollments.length === 0) && (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No recent enrollments</p>
              )}
            </div>
          </div>

        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Courses</h3>
            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900/20 dark:text-green-400">
              {stats?.recentCourses.length || 0} new
            </span>
          </div>
          <div className="space-y-3">
            {stats?.recentCourses.slice(0, 5).map((course: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL}${course.instructor?.avatar}` || '/images/user/user-01.png'} 
                    alt={course.instructor?.name || 'Instructor'}
                    className="h-10 w-10 rounded-full object-cover"
                    onError={(e) => { e.currentTarget.src = '/images/user/user-01.png'; }}
                  />
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">{course.title}</p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">By: {course.instructor?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    course.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : course.status === 'DRAFT'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {course.status}
                  </span>
                </div>
              ))}
            {(!stats?.recentCourses || stats.recentCourses.length === 0) && (
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">No recent courses</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
