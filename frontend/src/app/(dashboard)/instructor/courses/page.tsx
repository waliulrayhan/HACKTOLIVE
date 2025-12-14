"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineAcademicCap,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlineEye,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExclamationCircle,
  HiOutlineTag,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineX,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineQuestionMarkCircle,
  HiOutlineClipboardCheck,
  HiOutlinePaperClip,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnail?: string;
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
  liveSchedule?: string;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  enrolledStudents?: number;
  meetingLink?: string;
  _count?: {
    enrollments: number;
    reviews: number;
    modules: number;
  };
  contentStats?: {
    lessons: number;
    quizzes: number;
    assignments: number;
    resources: number;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function InstructorCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  const fetchCourses = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error('Failed to fetch courses');

      const data = await response.json();
      setAllCourses(data);

      // Apply filters
      let filteredData = data;
      if (statusFilter !== 'ALL') {
        filteredData = filteredData.filter((course: Course) => course.status === statusFilter);
      }
      if (searchTerm.trim()) {
        filteredData = filteredData.filter((course: Course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setCourses(paginatedData);
      setPagination({
        total: filteredData.length,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses', {
          description: 'Please try again',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const openViewModal = (course: Course) => {
    setSelectedCourse(course);
    setShowViewModal(true);
  };

  const openDeleteModal = (courseId: string, courseTitle: string) => {
    setCourseToDelete({ id: courseId, title: courseTitle });
    setShowDeleteModal(true);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete course');

      toast.success('Course deleted successfully!');
      setShowDeleteModal(false);
      setCourseToDelete(null);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      PUBLISHED: { color: 'success', icon: HiOutlineCheckCircle },
      DRAFT: { color: 'warning', icon: HiOutlineExclamationCircle },
      ARCHIVED: { color: 'error', icon: HiOutlineXCircle },
    };
    const config = variants[status] || variants.DRAFT;
    return { color: config.color, Icon: config.icon };
  };

  const getTierBadge = (tier: string) => {
    return tier === 'PREMIUM' ? 'info' : 'default';
  };

  const getTierBadgeClass = (tier: string) => {
    return tier === 'PREMIUM'
      ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-500'
      : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500';
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Courses" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  const totalPublished = allCourses.filter(c => c.status === 'PUBLISHED').length;
  const totalDraft = allCourses.filter(c => c.status === 'DRAFT').length;
  const totalStudents = allCourses.reduce((sum, c) => sum + c.totalStudents, 0);
  const avgRating = allCourses.length > 0
    ? allCourses.reduce((sum, c) => sum + c.rating, 0) / allCourses.length
    : 0;

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="My Courses" />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Courses</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{allCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Published</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{totalPublished}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-info-100 dark:bg-info-500/15">
              <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-info-600 dark:text-info-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
              <HiOutlineStar className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Courses</h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Manage and organize all your courses
            </p>
          </div>
          <button
            onClick={() => router.push('/instructor/courses/create')}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 hover:border-brand-600"
          >
            <HiOutlinePlus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Create Course</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses... (Press Enter to search)"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchTerm(searchInput);
                  }
                }}
                className="h-9 sm:h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-10 text-xs text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    setSearchTerm('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  title="Clear search"
                >
                  <HiOutlineX className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 sm:h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  <th className="px-3 sm:px-4 py-3 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Course
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Category
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Students
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Rating
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Status
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Actions
                    </span>
                  </th>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => {
                  const statusBadge = getStatusBadge(course.status);
                  const StatusIcon = statusBadge.Icon;

                  return (
                    <TableRow key={course.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5">
                      <TableCell className="px-3 sm:px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600">
                            <HiOutlineAcademicCap className="h-5 w-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                              {course.title}<span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getTierBadgeClass(course.tier)}`}>{course.tier}</span>
                            </p>
                            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {course.shortDescription}
                            </p>
                            {course.contentStats && (
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-info-600 dark:text-info-400" title="Lessons">
                                  <HiOutlineBookOpen className="h-3 w-3" />
                                  {course.contentStats.lessons}
                                </span>
                                {course.contentStats.quizzes > 0 && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] text-purple-600 dark:text-purple-400" title="Quizzes">
                                    <HiOutlineQuestionMarkCircle className="h-3 w-3" />
                                    {course.contentStats.quizzes}
                                  </span>
                                )}
                                {course.contentStats.assignments > 0 && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] text-warning-600 dark:text-warning-400" title="Assignments">
                                    <HiOutlineClipboardCheck className="h-3 w-3" />
                                    {course.contentStats.assignments}
                                  </span>
                                )}
                                {course.contentStats.resources > 0 && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] text-success-600 dark:text-success-400" title="Resources">
                                    <HiOutlinePaperClip className="h-3 w-3" />
                                    {course.contentStats.resources}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        <Badge color="info" size="sm">
                          <HiOutlineTag className="h-3 w-3 mr-1" />
                          {course.category.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <HiOutlineUsers className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                            {course.totalStudents}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <HiOutlineStar className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                            {course.rating.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        <Badge color={statusBadge.color as any} size="sm">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {course.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openViewModal(course)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                            title="View details"
                          >
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/instructor/courses/${course.id}/certificates`)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-purple-600 transition-colors hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-500/10"
                            title="Manage certificates"
                          >
                            <HiOutlineAcademicCap className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/instructor/courses/${course.id}/edit`)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-green-600 transition-colors hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-500/10"
                            title="Edit course"
                          >
                            <HiOutlinePencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(course.id, course.title)}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                            title="Delete course"
                          >
                            <HiOutlineTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {courses.length === 0 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <HiOutlineAcademicCap className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">No courses found</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== 'ALL'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by creating your first course'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 px-3 sm:px-4 py-3 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="h-7 rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                of {pagination.total} results
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={pagination.page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="First page"
              >
                <HiOutlineChevronDoubleLeft className="h-3 w-3" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Previous page"
              >
                <HiOutlineChevronLeft className="h-3 w-3" />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  if (pagination.totalPages <= 7) return true;
                  if (page === 1 || page === pagination.totalPages) return true;
                  if (Math.abs(page - pagination.page) <= 1) return true;
                  return false;
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="flex h-7 w-7 items-center justify-center text-xs text-gray-400">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs font-medium transition-colors ${pagination.page === page
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3'
                        }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              {/* Next Page */}
              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Next page"
              >
                <HiOutlineChevronRight className="h-3 w-3" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => setCurrentPage(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Last page"
              >
                <HiOutlineChevronDoubleRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedCourse && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Course Details
              </h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCourse(null);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-white/5 transition-colors"
              >
                <HiOutlineX className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
              {/* Thumbnail */}
              {selectedCourse.thumbnail && (
                <div className="w-full aspect-[2/1] overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                  <Image
                    width={600}
                    height={300}
                    src={`${process.env.NEXT_PUBLIC_API_URL}${selectedCourse.thumbnail}`}
                    alt={selectedCourse.title}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
              )}

              {/* Title & Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedCourse.title}
                </h4>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {selectedCourse.shortDescription}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="text-center p-2 rounded-md border border-gray-200 bg-gray-50 dark:border-white/5 dark:bg-white/3">
                  <HiOutlineUsers className="h-4 w-4 mx-auto text-gray-400 mb-1" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedCourse.totalStudents}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Students</p>
                </div>
                <div className="text-center p-2 rounded-md border border-gray-200 bg-gray-50 dark:border-white/5 dark:bg-white/3">
                  <HiOutlineStar className="h-4 w-4 mx-auto text-yellow-400 mb-1" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedCourse.rating.toFixed(1)}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Rating</p>
                </div>
                <div className="text-center p-2 rounded-md border border-gray-200 bg-gray-50 dark:border-white/5 dark:bg-white/3">
                  <HiOutlineClock className="h-4 w-4 mx-auto text-gray-400 mb-1" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedCourse.duration}h
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Duration</p>
                </div>
                <div className="text-center p-2 rounded-md border border-gray-200 bg-gray-50 dark:border-white/5 dark:bg-white/3">
                  <HiOutlineBookOpen className="h-4 w-4 mx-auto text-gray-400 mb-1" />
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedCourse._count?.modules || 0}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Modules</p>
                </div>
              </div>

              {/* Content Breakdown */}
              {selectedCourse.contentStats && (
                <div className="rounded-md border border-info-200 bg-info-50 p-3 dark:border-info-500/20 dark:bg-info-950/20">
                  <h5 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Course Content</h5>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <HiOutlineBookOpen className="h-4 w-4 text-info-600 dark:text-info-400" />
                      <span>{selectedCourse.contentStats.lessons} Lessons</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <HiOutlineQuestionMarkCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span>{selectedCourse.contentStats.quizzes} Quizzes</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <HiOutlineClipboardCheck className="h-4 w-4 text-warning-600 dark:text-warning-400" />
                      <span>{selectedCourse.contentStats.assignments} Assignments</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <HiOutlinePaperClip className="h-4 w-4 text-success-600 dark:text-success-400" />
                      <span>{selectedCourse.contentStats.resources} Resources</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Category</span>
                  <Badge color="info" size="sm">
                    {selectedCourse.category.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Level</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {selectedCourse.level}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
                  <Badge color={getStatusBadge(selectedCourse.status).color as any} size="sm">
                    {React.createElement(getStatusBadge(selectedCourse.status).Icon, { className: "h-3 w-3 mr-1" })}
                    {selectedCourse.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Tier</span>
                  <Badge color={getTierBadge(selectedCourse.tier) as any} size="sm">
                    {selectedCourse.tier}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Delivery</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {selectedCourse.deliveryMode}
                  </span>
                </div>
                {selectedCourse.deliveryMode === 'LIVE' && selectedCourse.liveSchedule && (
                  <div className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Schedule</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white text-right max-w-[200px]">
                      {selectedCourse.liveSchedule}
                    </span>
                  </div>
                )}
                {selectedCourse.deliveryMode === 'LIVE' && (selectedCourse.startDate || selectedCourse.endDate) && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Duration</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {selectedCourse.startDate && new Date(selectedCourse.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {selectedCourse.startDate && selectedCourse.endDate && ' - '}
                      {selectedCourse.endDate && new Date(selectedCourse.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
                {selectedCourse.deliveryMode === 'LIVE' && selectedCourse.maxStudents && selectedCourse.maxStudents > 0 && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Max Students</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {selectedCourse.enrolledStudents || 0} / {selectedCourse.maxStudents}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    ${selectedCourse.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Created</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {new Date(selectedCourse.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-200 dark:border-white/5">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCourse(null);
                }}
                className="h-9 inline-flex items-center justify-center px-4 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => router.push(`/instructor/courses/${selectedCourse.id}/edit`)}
                className="h-9 inline-flex items-center justify-center gap-1.5 px-4 text-xs font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition-colors"
              >
                <HiOutlinePencil className="h-3.5 w-3.5" />
                Edit Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-white/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Course
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{courseToDelete.title}</span>?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This action cannot be undone and will permanently remove this course and all its content from the system.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-error-600 text-white hover:bg-error-700 shadow-lg shadow-error-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <HiOutlineTrash className="h-4 w-4" />
                    Delete Course
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}