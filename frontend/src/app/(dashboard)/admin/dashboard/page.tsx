"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { FaUsers, FaBook, FaCheckCircle, FaChartLine, FaUserGraduate, FaChalkboardTeacher, FaDollarSign, FaCertificate } from "react-icons/fa";

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
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Admin Dashboard" />
      
      <div className="mt-6 space-y-6">
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.stats.totalUsers || 0}
                </p>
                <p className="mt-1 text-sm text-green-600">All registered users</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                <FaUsers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.stats.totalCourses || 0}
                </p>
                <p className="mt-1 text-sm text-blue-600">{stats?.stats.draftCourses || 0} pending approval</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900/20">
                <FaBook className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Enrollments</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stats?.stats.activeEnrollments || 0}
                </p>
                <p className="mt-1 text-sm text-purple-600">Across all courses</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                <FaCheckCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  ${(stats?.stats.totalRevenue || 0).toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-orange-600">From premium courses</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg dark:bg-orange-900/20">
                <FaDollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.stats.totalStudents || 0}
                </p>
              </div>
              <FaUserGraduate className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Instructors</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.stats.totalInstructors || 0}
                </p>
              </div>
              <FaChalkboardTeacher className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published Courses</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.stats.publishedCourses || 0}
                </p>
              </div>
              <FaChartLine className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Certificates Issued</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.stats.totalCertificates || 0}
                </p>
              </div>
              <FaCertificate className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Enrollments</h3>
              <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                {stats?.recentEnrollments.length || 0} new
              </span>
            </div>
            <div className="space-y-4">
              {stats?.recentEnrollments.slice(0, 5).map((enrollment: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{enrollment.student?.name || 'Unknown Student'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{enrollment.course?.title || 'Unknown Course'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </p>
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
                <p className="text-center text-gray-500 dark:text-gray-400">No recent enrollments</p>
              )}
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Courses</h3>
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900/20 dark:text-green-400">
                {stats?.recentCourses.length || 0} new
              </span>
            </div>
            <div className="space-y-4">
              {stats?.recentCourses.slice(0, 5).map((course: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{course.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">By: {course.instructor?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </p>
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
                <p className="text-center text-gray-500 dark:text-gray-400">No recent courses</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
