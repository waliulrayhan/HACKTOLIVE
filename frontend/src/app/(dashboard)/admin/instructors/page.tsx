"use client";

import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { FaStar, FaUsers, FaChalkboardTeacher, FaBook, FaTrophy } from "react-icons/fa";

interface Instructor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  experience?: string;
  rating: number;
  totalStudents: number;
  totalCourses: number;
  _count?: {
    courses: number;
  };
}

export default function InstructorsManagementPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics/top-instructors?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch instructors');
      
      const data = await response.json();
      setInstructors(data);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to load instructors', {
        description: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Instructor Management" />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading instructors...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Instructor Management" />
      
      <div className="mt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instructors</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">View and manage platform instructors</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-dark dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Instructors</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{instructors.length}</p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-dark dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {instructors.length > 0 
                ? (instructors.reduce((sum, i) => sum + i.rating, 0) / instructors.length).toFixed(1)
                : '0.0'}
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-dark dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {instructors.reduce((sum, i) => sum + i.totalStudents, 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-gray-dark dark:border-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Courses</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {instructors.reduce((sum, i) => sum + i.totalCourses, 0)}
            </p>
          </div>
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {instructors.map((instructor, index) => (
            <div key={instructor.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800 hover:shadow-lg">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex items-center justify-center w-16 h-16 text-2xl font-bold text-white bg-linear-to-br from-blue-500 to-purple-600 rounded-xl">
                    {instructor.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
                      {instructor.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium text-gray-900 dark:text-white">{instructor.rating.toFixed(1)}</span>
                    </div>
                    {index < 3 && (
                      <div className="flex items-center gap-1 text-sm">
                        <FaTrophy className={`${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' :
                          'text-orange-600'
                        }`} />
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Top {index + 1} Instructor
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {instructor.bio && (
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {instructor.bio}
                  </p>
                )}

                {instructor.experience && (
                  <div className="p-3 mb-4 border border-gray-200 rounded-lg dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Experience</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{instructor.experience}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <FaUsers className="text-blue-600 dark:text-blue-400" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {instructor.totalStudents.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <FaBook className="text-green-600 dark:text-green-400" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {instructor.totalCourses}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Courses</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {instructors.length === 0 && (
          <div className="py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-2xl dark:bg-gray-dark dark:border-gray-800 dark:text-gray-400">
            No instructors found
          </div>
        )}
      </div>
    </div>
  );
}
