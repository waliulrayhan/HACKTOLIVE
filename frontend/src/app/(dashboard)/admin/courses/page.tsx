"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineAcademicCap,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineEye,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineExclamationCircle,
  HiOutlineTag,
  HiOutlineBookOpen,
  HiOutlineCalendar,
  HiOutlineVideoCamera,
  HiOutlineDocumentText,
  HiOutlineClipboardList,
  HiOutlineClipboardCheck,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  level: string;
  tier: string;
  deliveryMode: string;
  price: number;
  status: string;
  rating: number;
  totalStudents: number;
  totalRatings: number;
  duration: number;
  totalLessons: number;
  totalModules: number;
  learningOutcomes: string;
  requirements: string;
  tags: string;
  thumbnail?: string;
  liveSchedule?: string;
  startDate?: string;
  endDate?: string;
  maxStudents?: number;
  enrolledStudents?: number;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  _count?: {
    enrollments: number;
    reviews: number;
  };
  modules?: Array<{
    id: string;
    title: string;
    description: string;
    order: number;
    lessons: Array<{
      id: string;
      title: string;
      type: string;
      duration: number;
    }>;
  }>;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CoursesManagementPage() {
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
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<{ id: string; title: string } | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [courseToReject, setCourseToReject] = useState<{ id: string; title: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Course Management - HackToLive Academy";
  }, []);

  const fetchCourses = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/courses`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error('Failed to fetch courses');
      
      const data = await response.json();
      setAllCourses(data.courses);
      
      // Apply filters
      let filteredData = data.courses;
      if (statusFilter !== 'ALL') {
        filteredData = filteredData.filter((course: Course) => course.status === statusFilter);
      }
      if (searchTerm.trim()) {
        filteredData = filteredData.filter((course: Course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleApproveCourse = async (courseId: string, courseTitle: string) => {
    try {
      setIsApproving(true);
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
    } finally {
      setIsApproving(false);
    }
  };

  const openRejectModal = (courseId: string, courseTitle: string) => {
    setCourseToReject({ id: courseId, title: courseTitle });
    setShowRejectModal(true);
  };

  const handleRejectCourse = async () => {
    if (!courseToReject) return;

    try {
      setIsRejecting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${courseToReject.id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to reject course');
      
      toast.success('Course rejected', {
        description: `${courseToReject.title} has been archived`,
      });
      setShowRejectModal(false);
      setCourseToReject(null);
      fetchCourses();
    } catch (error) {
      console.error('Error rejecting course:', error);
      toast.error('Failed to reject course', {
        description: 'Please try again',
      });
    } finally {
      setIsRejecting(false);
    }
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${courseToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

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

  const openViewModal = async (course: Course) => {
    try {
      // Fetch full course details with modules from admin endpoint
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/courses/${course.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch course details');
      
      const fullCourseData = await response.json();
      
      // Calculate totals from modules array if not provided
      if (fullCourseData.modules && Array.isArray(fullCourseData.modules)) {
        fullCourseData.totalModules = fullCourseData.modules.length;
        fullCourseData.totalLessons = fullCourseData.modules.reduce(
          (total: number, module: any) => total + (module.lessons?.length || 0),
          0
        );
      }
      
      setSelectedCourse(fullCourseData);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to load course details');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-500';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400';
    }
  };

  const getTierBadgeClass = (tier: string) => {
    return tier === 'PREMIUM'
      ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-500'
      : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500';
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Course Management" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Course Management" />
      
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
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {allCourses.filter(c => c.status === 'PUBLISHED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-500/15">
              <HiOutlineExclamationCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {allCourses.filter(c => c.status === 'DRAFT').length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-600">
              <HiOutlineXCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Archived</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {allCourses.filter(c => c.status === 'ARCHIVED').length}
              </p>
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
              Approve, reject, and manage all courses
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, instructor, or category... (Press Enter to search)"
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
              <option value="DRAFT">Pending</option>
              <option value="PUBLISHED">Published</option>
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
                  <TableCell isHeader className="w-[35%] px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Course
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Students
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Price
                    </span>
                  </TableCell>
                  <TableCell isHeader className="w-32 px-3 py-2.5 text-right sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Actions
                    </span>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id} className="group border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/2">
                    <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                            {course.title}
                          </p>
                          <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getTierBadgeClass(course.tier)}`}>
                            {course.tier}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          By {course.instructor.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <span className={`inline-flex px-2 py-1 text-[10px] sm:text-xs font-medium rounded-full ${getStatusBadgeClass(course.status)}`}>
                        {course.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <div className="flex items-center justify-center gap-1">
                        <HiOutlineUsers className="h-3 w-3 text-gray-400" />
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {course.totalStudents}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {course.price > 0 ? `${course.price} Tk` : 'Free'}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-right sm:px-4 sm:py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openViewModal(course)}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                          title="View details"
                        >
                          <HiOutlineEye className="h-4 w-4" />
                        </button>
                        {course.status === 'DRAFT' && (
                          <>
                            <button
                              onClick={() => handleApproveCourse(course.id, course.title)}
                              disabled={isApproving}
                              className="inline-flex items-center justify-center rounded-lg p-1.5 text-success-600 transition-colors hover:bg-success-100 dark:text-success-500 dark:hover:bg-success-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve"
                            >
                              {isApproving ? (
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                              ) : (
                                <HiOutlineCheck className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => openRejectModal(course.id, course.title)}
                              disabled={isRejecting}
                              className="inline-flex items-center justify-center rounded-lg p-1.5 text-yellow-600 transition-colors hover:bg-yellow-100 dark:text-yellow-500 dark:hover:bg-yellow-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject"
                            >
                              <HiOutlineX className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openDeleteModal(course.id, course.title)}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-error-600 transition-colors hover:bg-error-100 dark:text-error-500 dark:hover:bg-error-500/10"
                          title="Delete"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {courses.length === 0 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <HiOutlineAcademicCap className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">No courses found</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
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
              </select>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                of {pagination.total} results
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={pagination.page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="First page"
              >
                <span className="text-xs">«</span>
              </button>
              
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Previous page"
              >
                <span className="text-xs">‹</span>
              </button>
              
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
                      <span className="flex h-7 w-7 items-center justify-center text-xs text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                        pagination.page === page
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page === pagination.totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Next page"
              >
                <span className="text-xs">›</span>
              </button>
              
              <button
                onClick={() => setCurrentPage(pagination.totalPages)}
                disabled={pagination.page === pagination.totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Last page"
              >
                <span className="text-xs">»</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 z-10">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Course Details - Full Review
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Course Header Section */}
              <div className="pb-5 border-b border-gray-200 dark:border-gray-800 mt-4">
                {selectedCourse.thumbnail && (
                  <div className="mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${selectedCourse.thumbnail}`}
                      alt={selectedCourse.title}
                      width={800}
                      height={400}
                      className="w-full h-48 object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex items-start gap-2 mb-2">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
                    {selectedCourse.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(selectedCourse.status)}`}>
                    {selectedCourse.status}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTierBadgeClass(selectedCourse.tier)}`}>
                    {selectedCourse.tier}
                  </span>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {selectedCourse.deliveryMode}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 whitespace-pre-wrap">
                  {selectedCourse.shortDescription}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Slug: <span className="font-mono text-gray-700 dark:text-gray-300">{selectedCourse.slug}</span>
                </div>
              </div>

              {/* Key Stats Grid */}
              <div className="grid grid-cols-3 gap-4 pt-5 pb-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex flex-row items-center gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-500/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-500/20">
                    <HiOutlineStar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedCourse.rating.toFixed(1)} ({selectedCourse.totalRatings || 0} reviews)
                    </p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
                    <HiOutlineUsers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Students</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {selectedCourse.totalStudents}
                      {selectedCourse.deliveryMode === 'LIVE' && selectedCourse.maxStudents && (
                        <span className="text-xs font-normal text-gray-500"> / {selectedCourse.maxStudents}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-500/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/20">
                    <HiOutlineClock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {Math.floor(selectedCourse.duration / 60)}h {selectedCourse.duration % 60}m
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Information */}
              <div className="space-y-4 pt-5 pb-5 border-b border-gray-200 dark:border-gray-800">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white">Course Information</h5>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <HiOutlineAcademicCap className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Instructor</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedCourse.instructor.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <HiOutlineBookOpen className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Category</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedCourse.category}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <HiOutlineTag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Level</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedCourse.level}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <HiOutlineTag className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Price</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedCourse.price > 0 ? `${selectedCourse.price} Tk` : 'Free'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <HiOutlineBookOpen className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Content</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedCourse.totalModules || 0} Modules • {selectedCourse.totalLessons || 0} Lessons
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <HiOutlineClock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-0.5">Created</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(selectedCourse.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Course Details */}
              {selectedCourse.deliveryMode === 'LIVE' && (
                <div className="pt-5 pb-5 border-b border-gray-200 dark:border-gray-800">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <HiOutlineCalendar className="h-4 w-4 text-brand-500" />
                    Live Course Schedule
                  </h5>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCourse.liveSchedule && (
                      <div className="col-span-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Schedule</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedCourse.liveSchedule}</p>
                      </div>
                    )}
                    {selectedCourse.startDate && (
                      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-500/10">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(selectedCourse.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedCourse.endDate && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(selectedCourse.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedCourse.meetingLink && (
                      <div className="col-span-2 p-3 rounded-lg bg-purple-50 dark:bg-purple-500/10">
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Meeting Link</p>
                        <a 
                          href={selectedCourse.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline break-all"
                        >
                          {selectedCourse.meetingLink}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Full Description */}
              <div className="pt-5 pb-5 border-b border-gray-200 dark:border-gray-800">
                <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Full Description</h5>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {selectedCourse.description}
                  </p>
                </div>
              </div>

              {/* Learning Outcomes */}
              {selectedCourse.learningOutcomes && (
                <div className="pt-5 pb-5 border-b border-gray-200 dark:border-gray-800">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <HiOutlineCheckCircle className="h-4 w-4 text-green-500" />
                    What You'll Learn
                  </h5>
                  <div className="space-y-2">
                    {selectedCourse.learningOutcomes.split('\n').filter(line => line.trim()).map((outcome, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <HiOutlineCheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">{outcome.trim()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {selectedCourse.requirements && (
                <div className="pt-5 pb-5 border-b border-gray-200 dark:border-gray-800">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <HiOutlineExclamationCircle className="h-4 w-4 text-orange-500" />
                    Requirements
                  </h5>
                  <div className="space-y-2">
                    {selectedCourse.requirements.split('\n').filter(line => line.trim()).map((requirement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{requirement.trim()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedCourse.tags && (
                <div className="pt-5 pb-5 border-b border-gray-200 dark:border-gray-800">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <HiOutlineTag className="h-4 w-4 text-brand-500" />
                    Tags
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Curriculum */}
              {selectedCourse.modules && selectedCourse.modules.length > 0 && (
                <div className="pt-5">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <HiOutlineBookOpen className="h-4 w-4 text-brand-500" />
                    Course Curriculum ({selectedCourse.modules.length} Modules, {selectedCourse.totalLessons || 0} Lessons)
                  </h5>
                  <div className="space-y-3">
                    {selectedCourse.modules.map((module, moduleIndex) => (
                      <div 
                        key={module.id} 
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h6 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Module {moduleIndex + 1}: {module.title}
                              </h6>
                              {module.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {module.description}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                              {module.lessons?.length || 0} lessons
                            </span>
                          </div>
                        </div>
                        {module.lessons && module.lessons.length > 0 && (
                          <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="px-4 py-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
                                    {lesson.type === 'VIDEO' && <HiOutlineVideoCamera className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
                                    {lesson.type === 'ARTICLE' && <HiOutlineDocumentText className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
                                    {lesson.type === 'QUIZ' && <HiOutlineClipboardList className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
                                    {lesson.type === 'ASSIGNMENT' && <HiOutlineClipboardCheck className="h-4 w-4 text-gray-600 dark:text-gray-300" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {lessonIndex + 1}. {lesson.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {lesson.type}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <HiOutlineClock className="h-3.5 w-3.5 text-gray-400" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {lesson.duration} min
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 flex justify-between gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
              <div className="flex gap-2">
                {selectedCourse.status === 'DRAFT' && (
                  <>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        handleApproveCourse(selectedCourse.id, selectedCourse.title);
                      }}
                      disabled={isApproving}
                      className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-success-600 text-white hover:bg-success-700 shadow-lg shadow-success-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApproving ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Approving...
                        </>
                      ) : (
                        <>
                          <HiOutlineCheck className="h-4 w-4" />
                          Approve Course
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        openRejectModal(selectedCourse.id, selectedCourse.title);
                      }}
                      disabled={isRejecting}
                      className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-yellow-600 text-white hover:bg-yellow-700 shadow-lg shadow-yellow-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <HiOutlineX className="h-4 w-4" />
                      Reject Course
                    </button>
                  </>
                )}
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && courseToReject && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Reject Course
                </h3>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={isRejecting}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to reject <span className="font-semibold text-gray-900 dark:text-white">{courseToReject.title}</span>?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This will archive the course and the instructor will need to resubmit it for approval.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={isRejecting}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectCourse}
                disabled={isRejecting}
                className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-yellow-600 text-white hover:bg-yellow-700 shadow-lg shadow-yellow-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRejecting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <HiOutlineX className="h-4 w-4" />
                    Reject Course
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
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
                onClick={() => setShowDeleteModal(false)}
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
                This action cannot be undone and will permanently remove this course from the system.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
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
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
