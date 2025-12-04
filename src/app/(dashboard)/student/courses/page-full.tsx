'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { enrolledCourses } from '@/data/student/enrolledCourses';
import PageBreadCrumb from '@/components/shared/PageBreadCrumb';

export default function MyCoursesPage() {
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const filteredCourses = enrolledCourses.filter((course) => {
    if (filter === 'completed') return course.progress === 100;
    if (filter === 'in-progress') return course.progress > 0 && course.progress < 100;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageBreadCrumb pageTitle="My Courses" />

      {/* Filter Tabs */}
      <div className="mb-8 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFilter('all')}
          className={`pb-4 text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          All Courses ({enrolledCourses.length})
        </button>
        <button
          onClick={() => setFilter('in-progress')}
          className={`pb-4 text-sm font-medium transition-colors ${
            filter === 'in-progress'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          In Progress (
          {enrolledCourses.filter((c) => c.progress > 0 && c.progress < 100).length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`pb-4 text-sm font-medium transition-colors ${
            filter === 'completed'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Completed ({enrolledCourses.filter((c) => c.progress === 100).length})
        </button>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 text-6xl">📚</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            No courses found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'completed'
              ? "You haven't completed any courses yet. Keep learning!"
              : "You haven't enrolled in any courses yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                {course.certificateEarned && (
                  <div className="absolute right-2 top-2 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                    ✓ Certified
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category */}
                <div className="mb-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                  {course.category}
                </div>

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {course.title}
                </h3>

                {/* Instructor */}
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  By {course.instructor}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">
                      {course.completedLessons} of {course.totalLessons} lessons
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* Action Button */}
                {course.progress === 100 ? (
                  <div className="flex gap-2">
                    <Link
                      href={`/student/courses/${course.id}`}
                      className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      Review Course
                    </Link>
                    {course.certificateEarned && (
                      <Link
                        href="/student/certificates"
                        className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-green-700"
                      >
                        View Certificate
                      </Link>
                    )}
                  </div>
                ) : (
                  <Link
                    href={
                      course.lastAccessedLesson
                        ? `/learn/${course.id}/${course.lastAccessedLesson}`
                        : `/learn/${course.id}/lesson-1`
                    }
                    className="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    {course.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
