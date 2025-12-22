"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { DashboardLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineAcademicCap,
  HiOutlineUsers,
  HiOutlineStar,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineTrendingUp,
  HiOutlineBookOpen,
  HiOutlineUserGroup,
} from "react-icons/hi";

interface DashboardStats {
  instructor: any;
  stats: {
    totalCourses: number;
    totalStudents: number;
    averageRating: number;
    totalReviews: number;
    publishedCourses?: number;
    draftCourses?: number;
    totalRevenue?: number;
  };
}

export default function InstructorDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/instructor/dashboard`, {
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
        <PageBreadcrumb pageTitle="Instructor Dashboard" />
        <DashboardLoadingSkeleton />
      </div>
    );
  }

  const publishedCourses = stats?.instructor?.courses?.filter((c: any) => c.status === 'PUBLISHED').length || 0;
  const draftCourses = stats?.instructor?.courses?.filter((c: any) => c.status === 'DRAFT').length || 0;
  const totalRevenue = stats?.instructor?.courses?.reduce((sum: number, course: any) => 
    sum + (course.price * course.totalStudents), 0
  ) || 0;

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Instructor Dashboard" />
      
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Courses</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats?.stats.totalCourses || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats?.stats.totalStudents || 0}</p>
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
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats?.stats.averageRating.toFixed(1) || '0.0'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineCurrencyDollar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{totalRevenue.toLocaleString()} Tk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Published</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{publishedCourses}</p>
            </div>
            <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Draft</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{draftCourses}</p>
            </div>
            <HiOutlineBookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Reviews</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{stats?.stats.totalReviews || 0}</p>
            </div>
            <HiOutlineStar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Avg Students</p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                {stats?.stats.totalCourses ? Math.round(stats.stats.totalStudents / stats.stats.totalCourses) : 0}
              </p>
            </div>
            <HiOutlineUserGroup className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Course Performance */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Top Performing Courses</h3>
            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
              By Students
            </span>
          </div>
          <div className="space-y-3">
            {stats?.instructor?.courses
              ?.sort((a: any, b: any) => b.totalStudents - a.totalStudents)
              .slice(0, 5)
              .map((course: any, index: number) => (
                <div key={course.id} className="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                        {index + 1}
                      </span>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-1">{course.title}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-8">
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <HiOutlineUsers className="h-3 w-3" />
                        {course.totalStudents} students
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <HiOutlineStar className="h-3 w-3" />
                        {course.rating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    course.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {course.status}
                  </span>
                </div>
              ))}
            {(!stats?.instructor?.courses || stats.instructor.courses.length === 0) && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <HiOutlineAcademicCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No courses yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-4 sm:p-6 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Recent Reviews</h3>
            <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full dark:bg-yellow-900/20 dark:text-yellow-400">
              Latest
            </span>
          </div>
          <div className="space-y-3">
            {stats?.instructor?.courses
              ?.flatMap((course: any) => 
                (course._count?.reviews || 0) > 0 ? [{
                  courseName: course.title,
                  rating: course.rating,
                  totalReviews: course._count.reviews
                }] : []
              )
              .slice(0, 5)
              .map((item: any, index: number) => (
                <div key={index} className="p-3 sm:p-4 border border-gray-200 rounded-lg dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-colors">
                  <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-white line-clamp-1">{item.course?.title || item.courseName || 'Course'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <HiOutlineStar
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.round(item.rating)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {item.rating.toFixed(1)} ({item.totalReviews} reviews)
                    </p>
                  </div>
                </div>
              ))}
            {(!stats?.instructor?.courses || 
              stats.instructor.courses.every((c: any) => (c._count?.reviews || 0) === 0)) && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <HiOutlineStar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
