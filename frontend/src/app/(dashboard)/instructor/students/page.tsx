"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineX,
  HiOutlineChartBar,
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
import Avatar from "@/components/ui/avatar/Avatar";
import { Modal } from "@/components/ui/modal";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: number;
  completedCourses: number;
  certificatesEarned: number;
  createdAt: string;
  enrollments?: Array<{
    id: string;
    status: string;
    progress: number;
    enrolledAt: string;
    completedAt?: string;
    course: {
      id: string;
      title: string;
      status: string;
    };
  }>;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function InstructorStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchControllerRef = useRef<AbortController | null>(null);

  const fetchStudents = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/students`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error('Failed to fetch students');
      
      const enrollments = await response.json();
      
      // Transform enrollments data into students with grouped enrollments
      const studentsMap = new Map<string, Student>();
      
      enrollments.forEach((enrollment: any) => {
        const studentData = enrollment.student;
        const userData = enrollment.student.user;
        
        if (!studentsMap.has(studentData.id)) {
          studentsMap.set(studentData.id, {
            id: studentData.id,
            name: userData?.name || 'Unknown',
            email: userData?.email || 'No email',
            avatar: userData?.avatar,
            enrolledCourses: studentData.enrolledCourses || 0,
            completedCourses: studentData.completedCourses || 0,
            certificatesEarned: studentData.certificatesEarned || 0,
            createdAt: studentData.createdAt,
            enrollments: [],
          });
        }
        
        // Add this enrollment to the student's enrollments
        const student = studentsMap.get(studentData.id)!;
        student.enrollments!.push({
          id: enrollment.id,
          status: enrollment.status,
          progress: enrollment.progress || 0,
          enrolledAt: enrollment.enrolledAt,
          completedAt: enrollment.completedAt,
          course: {
            id: enrollment.course.id,
            title: enrollment.course.title,
            status: enrollment.course.status,
          },
        });
      });
      
      const transformedStudents = Array.from(studentsMap.values());
      setAllStudents(transformedStudents);
      
      // Apply search filter
      let filteredData = transformedStudents;
      if (searchTerm.trim()) {
        filteredData = transformedStudents.filter((student: Student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setStudents(paginatedData);
      setPagination({
        total: filteredData.length,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching students:', error);
        toast.error('Failed to load students', {
          description: 'Please try again',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

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

  const openViewModal = (student: Student) => {
    // Find the full student data from allStudents which includes enrollments
    const fullStudentData = allStudents.find(s => s.id === student.id);
    setSelectedStudent(fullStudentData || student);
    setShowModal(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Students" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  const totalEnrolled = allStudents.length;
  const activeStudents = allStudents.filter(s => s.enrolledCourses > s.completedCourses).length;
  const completedStudents = allStudents.filter(s => s.completedCourses > 0).length;
  const totalEnrollments = allStudents.reduce((sum, s) => sum + s.enrolledCourses, 0);

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="My Students" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{totalEnrolled}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{activeStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-info-100 dark:bg-info-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-info-600 dark:text-info-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{completedStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Enrollments</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{totalEnrollments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Students</h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Manage and track your students' progress
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students... (Press Enter to search)"
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-160">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  <th className="px-3 sm:px-4 py-3 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Student
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Email
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Enrolled
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Completed
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Certificates
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Joined Date
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
                {students.length === 0 ? (
                  <TableRow>
                    <td colSpan={7} className="py-12">
                      <div className="flex flex-col items-center gap-2">
                        <HiOutlineUsers className="h-12 w-12 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {searchTerm ? 'No students found' : 'No students yet'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {searchTerm 
                            ? 'Try adjusting your search' 
                            : 'Students will appear here once they enroll in your courses'}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {/* <Avatar
                            src={student.avatar || '/images/default-avatar.png'}
                            alt={student.name}
                            size="small"
                          /> */}
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                            {student.name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {student.email}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {student.enrolledCourses}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {student.completedCourses}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        <Badge color="success" size="sm">
                          {student.certificatesEarned}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {new Date(student.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openViewModal(student)}
                            className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 transition-colors"
                            title="View Details"
                          >
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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

      {/* View Student Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header with Background */}
            <div className="relative bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-600 dark:to-brand-700 p-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedStudent(null);
                }}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  {selectedStudent.avatar ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}${selectedStudent.avatar}`}
                      alt={selectedStudent.name}
                      className="h-20 w-20 rounded-full border-4 border-white/20 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center text-white text-2xl font-bold">
                      {getInitials(selectedStudent.name)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white bg-success-500 flex items-center justify-center">
                    <HiOutlineCheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-sm text-white/80 flex items-center gap-1.5 mt-1 truncate">
                    <HiOutlineMail className="h-4 w-4 shrink-0" />
                    {selectedStudent.email}
                  </p>
                  <p className="text-xs text-white/70 flex items-center gap-1.5 mt-1">
                    <HiOutlineCalendar className="h-3.5 w-3.5 shrink-0" />
                    Member since {new Date(selectedStudent.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Stats Grid */}
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                    Performance Overview
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-500/10 dark:to-blue-500/5 dark:border-blue-500/20 p-4">
                      <div className="absolute top-2 right-2 opacity-10">
                        <HiOutlineAcademicCap className="h-12 w-12 text-blue-600" />
                      </div>
                      <div className="relative">
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">Enrolled Courses</p>
                        <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">
                          {selectedStudent.enrolledCourses}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-500/10 dark:to-success-500/5 dark:border-success-500/20 p-4">
                      <div className="absolute top-2 right-2 opacity-10">
                        <HiOutlineCheckCircle className="h-12 w-12 text-success-600" />
                      </div>
                      <div className="relative">
                        <p className="text-xs font-medium text-success-700 dark:text-success-400 mb-1">Completed</p>
                        <p className="text-3xl font-bold text-success-900 dark:text-success-300">
                          {selectedStudent.completedCourses}
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-warning-50 to-warning-100/50 dark:from-warning-500/10 dark:to-warning-500/5 dark:border-warning-500/20 p-4">
                      <div className="absolute top-2 right-2 opacity-10">
                        <HiOutlineAcademicCap className="h-12 w-12 text-warning-600" />
                      </div>
                      <div className="relative">
                        <p className="text-xs font-medium text-warning-700 dark:text-warning-400 mb-1">Certificates</p>
                        <p className="text-3xl font-bold text-warning-900 dark:text-warning-300">
                          {selectedStudent.certificatesEarned}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Enrollments */}
                {selectedStudent.enrollments && selectedStudent.enrollments.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Course Enrollments
                      </h4>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-full">
                        {selectedStudent.enrollments.length} {selectedStudent.enrollments.length === 1 ? 'Course' : 'Courses'}
                      </span>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {selectedStudent.enrollments.map((enrollment) => (
                        <div
                          key={enrollment.id}
                          className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 hover:border-brand-300 dark:hover:border-brand-500/50 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                  {enrollment.course.title}
                                </h5>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                  <HiOutlineCalendar className="h-3 w-3" />
                                  Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                              <Badge 
                                color={enrollment.status === 'COMPLETED' ? 'success' : enrollment.status === 'ACTIVE' ? 'info' : 'dark'}
                                size="sm"
                              >
                                {enrollment.status}
                              </Badge>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
                                <span className="font-bold text-brand-600 dark:text-brand-400">{enrollment.progress}%</span>
                              </div>
                              <div className="relative h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500 ease-out"
                                  style={{ width: `${enrollment.progress}%` }}
                                />
                                <div
                                  className="absolute inset-y-0 left-0 bg-white/20 rounded-full transition-all duration-500 ease-out animate-pulse"
                                  style={{ width: `${enrollment.progress}%` }}
                                />
                              </div>
                            </div>

                            {/* View Progress Button */}
                            <button
                              onClick={() => {
                                router.push(`/instructor/students/${selectedStudent.id}/progress/${enrollment.course.id}`);
                                setShowModal(false);
                              }}
                              className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 rounded-lg transition-all duration-200"
                            >
                              <HiOutlineChartBar className="h-3.5 w-3.5" />
                              View Detailed Progress
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Enrollments State */}
                {(!selectedStudent.enrollments || selectedStudent.enrollments.length === 0) && (
                  <div className="text-center py-12 px-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
                      <HiOutlineAcademicCap className="h-8 w-8 text-gray-400" />
                    </div>
                    <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      No Course Enrollments
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This student hasn't enrolled in any courses yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
