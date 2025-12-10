"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { FaCheck, FaTimes, FaTrash, FaSearch, FaFilter, FaStar, FaUsers, FaClock } from "react-icons/fa";

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category: string;
  level: string;
  tier: string;
  deliveryMode: string;
  price: number;
  status: string;
  rating: number;
  totalStudents: number;
  duration: number;
  createdAt: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  _count?: {
    enrollments: number;
    reviews: number;
  };
}

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, statusFilter]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch courses');
      
      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses', {
        description: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(course => course.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourses(filtered);
  };

  const handleApproveCourse = async (courseId: string, courseTitle: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${courseId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to approve course');
      
      toast.success('Course approved!', {
        description: `${courseTitle} has been published`,
      });
      fetchCourses();
    } catch (error) {
      console.error('Error approving course:', error);
      toast.error('Failed to approve course', {
        description: 'Please try again',
      });
    }
  };

  const handleRejectCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to reject "${courseTitle}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${courseId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to reject course');
      
      toast.success('Course rejected', {
        description: `${courseTitle} has been archived`,
      });
      fetchCourses();
    } catch (error) {
      console.error('Error rejecting course:', error);
      toast.error('Failed to reject course', {
        description: 'Please try again',
      });
    }
  };

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete course');
      
      toast.success('Course deleted!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course', {
        description: 'Please try again',
      });
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Course Management" />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading courses...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Course Management" />
      
      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Approve, reject, or manage courses</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search by title or instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 text-gray-900 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="DRAFT">Draft (Pending)</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-dark dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-dark dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {courses.filter(c => c.status === 'PUBLISHED').length}
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-dark dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending Approval</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {courses.filter(c => c.status === 'DRAFT').length}
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-dark dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Archived</p>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {courses.filter(c => c.status === 'ARCHIVED').length}
            </p>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <div key={course.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800 hover:shadow-lg">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    course.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      : course.status === 'DRAFT'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {course.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    course.tier === 'PREMIUM' 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {course.tier}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                  {course.title}
                </h3>

                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {course.shortDescription}
                </p>

                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>By: {course.instructor.name}</span>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="font-medium text-gray-900 dark:text-white">{course.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({course._count?.reviews || 0})</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <FaUsers />
                    <span>{course.totalStudents}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <FaClock />
                    <span>{Math.floor(course.duration / 60)}h</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {course.price > 0 ? `$${course.price}` : 'Free'}
                  </div>
                  <div className="flex gap-2">
                    {course.status === 'DRAFT' && (
                      <>
                        <button
                          onClick={() => handleApproveCourse(course.id, course.title)}
                          className="p-2 text-green-600 transition-colors rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleRejectCourse(course.id, course.title)}
                          className="p-2 text-yellow-600 transition-colors rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteCourse(course.id, course.title)}
                      className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800 dark:text-gray-400">
            No courses found
          </div>
        )}
      </div>
    </div>
  );
}
