"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
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
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Modal } from "@/components/ui/modal";

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
  _count?: {
    enrollments: number;
    reviews: number;
    modules: number;
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
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<{ id: string; title: string } | null>(null);

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

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  const openViewModal = (course: Course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const openDeleteModal = (courseId: string, courseTitle: string) => {
    setCourseToDelete({ id: courseId, title: courseTitle });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/instructor/courses/${courseToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete course');
      
      toast.success('Course deleted successfully', {
        description: `${courseToDelete.title} has been removed`,
      });
      setShowDeleteModal(false);
      setCourseToDelete(null);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course', {
        description: 'Please try again',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      PUBLISHED: { color: 'success', icon: HiOutlineCheckCircle },
      DRAFT: { color: 'warning', icon: HiOutlineExclamationCircle },
      ARCHIVED: { color: 'error', icon: HiOutlineXCircle },
    };
    const config = variants[status] || variants.DRAFT;
    return { variant: config.color, Icon: config.icon };
  };

  const getTierBadge = (tier: string) => {
    return tier === 'PREMIUM' ? 'info' : 'default';
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
      <div className="flex items-center justify-between">
        <PageBreadcrumb pageTitle="My Courses" />
        <Button onClick={() => router.push('/instructor/courses/create')}>
          <HiOutlinePlus className="h-4 w-4 mr-1" />
          Create Course
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Courses</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{allCourses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Published</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{totalPublished}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-500/15">
              <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineStar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Avg Rating</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{avgRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses by title or category..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="shrink-0"
              size="sm"
            >
              Search
            </Button>
            {searchTerm && (
              <Button
                onClick={clearSearch}
                variant="outline"
                size="sm"
                className="shrink-0"
              >
                Clear
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
            
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Course
                </th>
                <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Category
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Students
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Rating
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Price
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Actions
                </th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => {
                const statusBadge = getStatusBadge(course.status);
                const StatusIcon = statusBadge.Icon;
                
                return (
                  <TableRow key={course.id}>
                    <TableCell className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                          {course.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {course.shortDescription}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge color="primary" size="sm">
                        {course.category.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {course.totalStudents}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <HiOutlineStar className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {course.rating.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${course.price}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <Badge variant={statusBadge.variant as any} size="sm">
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(course)}
                          className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                          title="View Details"
                        >
                          <HiOutlineEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => window.location.href = `/instructor/courses/${course.id}/edit`}
                          className="rounded p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10"
                          title="Edit"
                        >
                          <HiOutlinePencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(course.id, course.title)}
                          className="rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                          title="Delete"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {courses.length === 0 && (
                <TableRow>
                  <td colSpan={7} className="py-12 text-center">
                    <HiOutlineAcademicCap className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      No courses found
                    </p>
                    {searchTerm && (
                      <p className="mt-1 text-xs text-gray-400">
                        Try adjusting your search
                      </p>
                    )}
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-gray-200 px-4 py-3 dark:border-white/5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <HiOutlineChevronDoubleLeft className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <HiOutlineChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                
                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  variant="outline"
                  size="sm"
                >
                  <HiOutlineChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setCurrentPage(pagination.totalPages)}
                  disabled={currentPage === pagination.totalPages}
                  variant="outline"
                  size="sm"
                >
                  <HiOutlineChevronDoubleRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showModal && selectedCourse && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedCourse(null);
          }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Course Details</h2>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedCourse.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {selectedCourse.shortDescription}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedCourse.category.replace(/_/g, ' ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedCourse.level}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tier</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedCourse.tier}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  ${selectedCourse.price}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Students</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedCourse.totalStudents}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedCourse.rating.toFixed(1)} ⭐
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedCourse.duration} hours
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <Badge variant={getStatusBadge(selectedCourse.status).variant as any} size="sm">
                  {selectedCourse.status}
                </Badge>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && courseToDelete && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setCourseToDelete(null);
          }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Delete Course</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete <span className="font-semibold">{courseToDelete.title}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCourseToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-error-600 hover:bg-error-700"
              >
                Delete Course
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
