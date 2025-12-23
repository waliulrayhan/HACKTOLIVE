"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import {
  HiOutlineClipboardCheck,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineStar,
  HiOutlineCalendar,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineEye,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineExclamation,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface Assignment {
  id: string;
  title: string;
  description: string;
  maxScore: number;
  dueDate: string | null;
  lesson: {
    id: string;
    title: string;
    module: {
      title: string;
      course: {
        id: string;
        title: string;
      };
    };
  };
  submission?: {
    id: string;
    score: number | null;
    submittedAt: string;
    gradedAt: string | null;
    feedback: string | null;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function StudentAssignmentsPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [allAssignments, setAllAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "graded" | "unsubmitted">("all");
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

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "My Assignments - HACKTOLIVE Academy";
  }, []);

  const fetchAssignments = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/student/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch assignments");

      const data = await response.json();
      setAllAssignments(data);

      // Apply filters
      let filteredData = data;
      
      // Filter by status
      if (filter !== "all") {
        filteredData = filteredData.filter((assignment: Assignment) => {
          const status = getAssignmentStatus(assignment);
          return status === filter;
        });
      }

      // Filter by search
      if (searchTerm.trim()) {
        filteredData = filteredData.filter((assignment: Assignment) =>
          assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assignment.lesson.module.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assignment.lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setAssignments(paginatedData);
      setPagination({
        total: filteredData.length,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching assignments:", error);
        toast.error("Failed to load assignments", {
          description: "Please try again",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, itemsPerPage, filter]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, filter]);

  const getAssignmentStatus = (assignment: Assignment) => {
    if (!assignment.submission) return "unsubmitted";
    if (assignment.submission.gradedAt) return "graded";
    return "pending";
  };

  const getStatusBadge = (assignment: Assignment) => {
    const status = getAssignmentStatus(assignment);
    
    switch (status) {
      case "graded":
        return (
          <Badge color="success" size="sm">
            <HiOutlineCheckCircle className="h-3.5 w-3.5" />
            Graded
          </Badge>
        );
      case "pending":
        return (
          <Badge color="warning" size="sm">
            <HiOutlineClock className="h-3.5 w-3.5" />
            Pending
          </Badge>
        );
      case "unsubmitted":
        return (
          <Badge color="error" size="sm">
            <HiOutlineXCircle className="h-3.5 w-3.5" />
            Not Submitted
          </Badge>
        );
    }
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="My Assignments" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  const pendingCount = allAssignments.filter(a => getAssignmentStatus(a) === "pending").length;
  const gradedCount = allAssignments.filter(a => getAssignmentStatus(a) === "graded").length;
  const unsubmittedCount = allAssignments.filter(a => getAssignmentStatus(a) === "unsubmitted").length;
  const averageScore = allAssignments
    .filter(a => a.submission?.score !== null && a.submission?.score !== undefined)
    .reduce((sum, a, _, arr) => {
      const percentage = ((a.submission!.score! / a.maxScore) * 100);
      return sum + (percentage / arr.length);
    }, 0);

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="My Assignments" />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Assignments</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{allAssignments.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Graded</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{gradedCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Pending Review</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-error-100 dark:bg-error-500/15">
              <HiOutlineXCircle className="h-4 w-4 sm:h-5 sm:w-5 text-error-600 dark:text-error-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Not Submitted</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{unsubmittedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header with Filter Tabs */}
        <div className="border-b border-gray-200 dark:border-white/5">
          <div className="flex flex-col gap-3 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">My Assignments</h2>
              <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Track and manage your course assignments
              </p>
            </div>
            {gradedCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
                <HiOutlineStar className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span className="text-xs font-medium text-brand-700 dark:text-brand-300">
                  Avg Score: {averageScore.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          
          {/* Filter Tabs */}
          <div className="flex border-t border-gray-200 dark:border-white/5 overflow-x-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                filter === "all"
                  ? "border-brand-500 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
              }`}
            >
              All
              <span className="ml-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-semibold">
                {allAssignments.length}
              </span>
            </button>
            <button
              onClick={() => setFilter("unsubmitted")}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                filter === "unsubmitted"
                  ? "border-brand-500 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
              }`}
            >
              Not Submitted
              <span className="ml-1.5 rounded-full bg-error-100 dark:bg-error-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-error-700 dark:text-error-400">
                {unsubmittedCount}
              </span>
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                filter === "pending"
                  ? "border-brand-500 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
              }`}
            >
              Pending
              <span className="ml-1.5 rounded-full bg-warning-100 dark:bg-warning-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-warning-700 dark:text-warning-400">
                {pendingCount}
              </span>
            </button>
            <button
              onClick={() => setFilter("graded")}
              className={`px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                filter === "graded"
                  ? "border-brand-500 text-brand-600 bg-brand-50/50 dark:border-brand-400 dark:text-brand-400 dark:bg-brand-950/20"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
              }`}
            >
              Graded
              <span className="ml-1.5 rounded-full bg-success-100 dark:bg-success-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-success-700 dark:text-success-400">
                {gradedCount}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments by title or course... (Press Enter)"
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
                      Assignment
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-left">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Course / Lesson
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Due Date
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Status
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Score
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
                {assignments.length === 0 ? (
                  <TableRow>
                    <td colSpan={6} className="py-12">
                      <div className="flex flex-col items-center gap-2">
                        <HiOutlineClipboardCheck className="h-12 w-12 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {searchTerm ? 'No assignments found' : filter === "all" ? 'No assignments yet' : `No ${filter} assignments`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {searchTerm 
                            ? 'Try adjusting your search' 
                            : 'Assignments will appear here as you enroll in courses'}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  assignments.map((assignment) => {
                    const status = getAssignmentStatus(assignment);
                    const overdue = !assignment.submission && isOverdue(assignment.dueDate);
                    
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell className="px-3 sm:px-4 py-3">
                          <div className="max-w-xs">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                              {assignment.title}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                              {assignment.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 py-3">
                          <div className="max-w-xs">
                            <p className="text-xs sm:text-sm text-gray-900 dark:text-white line-clamp-1">
                              {assignment.lesson.module.course.title}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                              {assignment.lesson.module.title} / {assignment.lesson.title}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 py-3 text-center">
                          {assignment.dueDate ? (
                            <div className="flex flex-col items-center gap-0.5">
                              <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-error-600 dark:text-error-400' : 'text-gray-900 dark:text-white'}`}>
                                <HiOutlineCalendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span className="text-[10px] sm:text-xs">{new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                              {overdue && (
                                <Badge color="error" size="sm">
                                  <HiOutlineExclamation className="h-3 w-3" />
                                  Overdue
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] sm:text-xs text-gray-400">No due date</span>
                          )}
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 py-3 text-center">
                          {getStatusBadge(assignment)}
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 py-3 text-center">
                          {status === "graded" && assignment.submission ? (
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-success-100 dark:bg-success-500/15">
                                <HiOutlineStar className="h-3 w-3 text-success-600 dark:text-success-400" />
                                <span className="text-xs font-semibold text-success-700 dark:text-success-300">
                                  {assignment.submission.score}/{assignment.maxScore}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                {((assignment.submission.score! / assignment.maxScore) * 100).toFixed(0)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="px-3 sm:px-4 py-3">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => router.push(`/student/courses/${assignment.lesson.module.course.id}/lesson/${assignment.lesson.id}`)}
                              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                status === "unsubmitted"
                                  ? "border border-brand-500 bg-brand-500 text-white hover:bg-brand-600"
                                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                              }`}
                            >
                              <HiOutlineEye className="h-3.5 w-3.5" />
                              {status === "graded" ? "View" : status === "pending" ? "View" : "Submit"}
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
    </div>
  );
}
