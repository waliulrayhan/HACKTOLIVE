"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
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
      
      const data = await response.json();
      setAllStudents(data);
      
      // Apply search filter
      let filteredData = data;
      if (searchTerm.trim()) {
        filteredData = data.filter((student: Student) =>
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

  const openViewModal = async (student: Student) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/instructor/students/${student.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch student details');
      
      const detailedStudent = await response.json();
      setSelectedStudent(detailedStudent);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast.error('Failed to load student details', {
        description: 'Please try again',
      });
    }
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
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Students</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{totalEnrolled}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{activeStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{completedStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/15">
              <HiOutlineAcademicCap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Enrollments</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{totalEnrollments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
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

      {/* Table */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Student
                </th>
                <th className="text-left text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Email
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Enrolled Courses
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Completed
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Certificates
                </th>
                <th className="text-center text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Joined Date
                </th>
                <th className="text-right text-xs font-semibold text-gray-700 dark:text-gray-300 px-4 py-3">
                  Actions
                </th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={student.avatar || '/images/default-avatar.png'}
                        alt={student.name}
                        size="small"
                      />
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {student.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {student.email}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {student.enrolledCourses}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {student.completedCourses}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Badge color="success" size="sm">
                      {student.certificatesEarned}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openViewModal(student)}
                        className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                        title="View Details"
                      >
                        <HiOutlineEye className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {students.length === 0 && (
                <TableRow>
                  <td colSpan={7} className="py-12 text-center">
                    <HiOutlineUsers className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      No students found
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

      {/* View Student Modal */}
      {showModal && selectedStudent && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedStudent(null);
          }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Student Details</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar
                  src={selectedStudent.avatar || '/images/default-avatar.png'}
                  alt={selectedStudent.name}
                  size="large"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <HiOutlineMail className="h-4 w-4" />
                    {selectedStudent.email}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 mt-1">
                    <HiOutlineCalendar className="h-3 w-3" />
                    Joined {new Date(selectedStudent.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 border border-gray-200 rounded-lg dark:border-white/5">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedStudent.enrolledCourses}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Enrolled</p>
                </div>
                <div className="text-center p-3 border border-gray-200 rounded-lg dark:border-white/5">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedStudent.completedCourses}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                </div>
                <div className="text-center p-3 border border-gray-200 rounded-lg dark:border-white/5">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedStudent.certificatesEarned}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Certificates</p>
                </div>
              </div>

            {selectedStudent.enrollments && selectedStudent.enrollments.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Course Enrollments
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedStudent.enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="p-3 border border-gray-200 rounded-lg dark:border-white/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {enrollment.course.title}
                        </p>
                        <Badge 
                          color={enrollment.status === 'COMPLETED' ? 'success' : 'primary'}
                          size="sm"
                        >
                          {enrollment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                          <div
                            className="h-2 bg-brand-500 rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {enrollment.progress}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
