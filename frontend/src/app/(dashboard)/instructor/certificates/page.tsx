"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import StudentPerformanceModal from "@/components/instructor/StudentPerformanceModal";
import {
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
  HiOutlineDownload,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineEye,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
} from "react-icons/hi";
import { HiOutlineTrophy } from "react-icons/hi2";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface CertificateRequest {
  id: string;
  status: "PENDING" | "ISSUED" | "REJECTED";
  requestedAt: string;
  issuedAt?: string;
  verificationCode?: string;
  student: {
    id: string;
    user: {
      name: string;
      email: string;
      avatar?: string;
    };
  };
  course: {
    id: string;
    title: string;
    thumbnail?: string;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function InstructorCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateRequest[]>([]);
  const [allCertificates, setAllCertificates] = useState<CertificateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [processing, setProcessing] = useState<string | null>(null);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedCertificateId, setSelectedCertificateId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const fetchControllerRef = useRef<AbortController | null>(null);

  const fetchCertificates = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/instructor/certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: fetchControllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Failed to fetch certificate requests");

      const data = await response.json();
      setAllCertificates(data);

      // Apply filters
      let filteredData = data;
      if (statusFilter !== "ALL") {
        filteredData = filteredData.filter(
          (cert: CertificateRequest) => cert.status === statusFilter
        );
      }
      if (searchTerm.trim()) {
        filteredData = filteredData.filter(
          (cert: CertificateRequest) =>
            cert.student.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.student.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.course.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setCertificates(paginatedData);
      setPagination({
        total: filteredData.length,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
      });
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error fetching certificates:", error);
        toast.error("Failed to load certificate requests");
      }
    } finally {
      setLoading(false);
    }
  }, [apiUrl, currentPage, searchTerm, itemsPerPage, statusFilter]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, statusFilter]);

  const handleIssueCertificate = async (certificateId: string) => {
    try {
      setProcessing(certificateId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/instructor/certificates/${certificateId}/issue`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to issue certificate");

      toast.success("Certificate Issued!", {
        description: "The student can now download their certificate.",
      });

      // Refresh the list
      fetchCertificates();
    } catch (error) {
      console.error("Error issuing certificate:", error);
      toast.error("Failed to issue certificate");
    } finally {
      setProcessing(null);
    }
  };

  const handleReviewPerformance = (certificateId: string) => {
    setSelectedCertificateId(certificateId);
    setShowPerformanceModal(true);
  };

  const handleRejectCertificate = async (certificateId: string) => {
    try {
      setProcessing(certificateId);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiUrl}/instructor/certificates/${certificateId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to reject certificate");

      toast.success("Certificate Rejected");

      // Refresh the list
      fetchCertificates();
    } catch (error) {
      console.error("Error rejecting certificate:", error);
      toast.error("Failed to reject certificate");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge color="warning">
            <div className="flex items-center gap-1">
              <HiOutlineClock className="h-3.5 w-3.5" />
              Pending
            </div>
          </Badge>
        );
      case "ISSUED":
        return (
          <Badge color="success">
            <div className="flex items-center gap-1">
              <HiOutlineCheckCircle className="h-3.5 w-3.5" />
              Issued
            </div>
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge color="error">
            <div className="flex items-center gap-1">
              <HiOutlineXCircle className="h-3.5 w-3.5" />
              Rejected
            </div>
          </Badge>
        );
      default:
        return <Badge color="light">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const pendingCount = allCertificates.filter((c) => c.status === "PENDING").length;
  const issuedCount = allCertificates.filter((c) => c.status === "ISSUED").length;
  const rejectedCount = allCertificates.filter((c) => c.status === "REJECTED").length;

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Certificate Requests" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Certificate Requests" />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineTrophy className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Requests</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{allCertificates.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Issued</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{issuedCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-error-100 dark:bg-error-500/15">
              <HiOutlineXCircle className="h-4 w-4 sm:h-5 sm:w-5 text-error-600 dark:text-error-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Rejected</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Certificate Requests</h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Review and manage student certificate requests
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          {["PENDING", "ISSUED", "REJECTED", "ALL"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === status
                  ? "bg-brand-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
              }`}
            >
              {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
              <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                statusFilter === status 
                  ? "bg-white/20" 
                  : "bg-gray-200 dark:bg-gray-700"
              }`}>
                {status === "ALL" 
                  ? allCertificates.length 
                  : allCertificates.filter((c) => c.status === status).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name, email, or course... (Press Enter to search)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(searchInput);
                }
              }}
              className="h-9 sm:h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-10 text-xs text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearchTerm("");
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
                      Course
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Status
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Requested
                    </span>
                  </th>
                  <th className="px-3 sm:px-4 py-3 text-center">
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Verification Code
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
                {certificates.length === 0 ? (
                  <TableRow>
                    <td colSpan={6} className="py-12">
                      <div className="flex flex-col items-center gap-2">
                        <HiOutlineTrophy className="h-12 w-12 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {searchTerm 
                            ? "No certificate requests found" 
                            : statusFilter !== "ALL" 
                            ? `No ${statusFilter.toLowerCase()} certificate requests` 
                            : "No certificate requests yet"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {searchTerm
                            ? "Try adjusting your search"
                            : statusFilter === "PENDING"
                            ? "You don't have any pending certificate requests at the moment."
                            : statusFilter === "ISSUED"
                            ? "You haven't issued any certificates yet."
                            : "Certificate requests will appear here"}
                        </p>
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  certificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {cert.student.user.avatar ? (
                            <img
                              src={cert.student.user.avatar.startsWith('http') 
                                ? cert.student.user.avatar 
                                : `${process.env.NEXT_PUBLIC_API_URL}${cert.student.user.avatar}`}
                              alt={cert.student.user.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white text-xs font-semibold">
                              {cert.student.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                              {cert.student.user.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                              {cert.student.user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2">
                          <HiOutlineAcademicCap className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                          <span className="text-xs sm:text-sm text-gray-900 dark:text-white">
                            {cert.course.title}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        {getStatusBadge(cert.status)}
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <HiOutlineCalendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            {new Date(cert.requestedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3 text-center">
                        {cert.verificationCode ? (
                          <code className="rounded bg-gray-200 px-2 py-0.5 text-xs font-mono dark:bg-gray-700">
                            {cert.verificationCode}
                          </code>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-3">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          {cert.status === "PENDING" ? (
                            <>
                                <button
                                onClick={() => handleReviewPerformance(cert.id)}
                                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 transition-colors"
                                title="Review Performance"
                                >
                                <HiOutlineChartBar className="h-3.5 w-3.5" />
                                Review
                                </button>
                                <button
                                onClick={() => handleRejectCertificate(cert.id)}
                                disabled={processing === cert.id}
                                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                title="Reject"
                                >
                                <HiOutlineXCircle className="h-3.5 w-3.5" />
                                Reject
                                </button>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
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
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Previous page"
              >
                <HiOutlineChevronLeft className="h-3 w-3" />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (pagination.totalPages <= 7) return true;
                  if (page === 1 || page === pagination.totalPages) return true;
                  if (Math.abs(page - pagination.page) <= 1) return true;
                  return false;
                })
                .map((page, index, array) => {
                  if (index > 0 && array[index - 1] !== page - 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="px-2 text-gray-400">...</span>
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs transition-colors ${
                            pagination.page === page
                              ? "border-brand-500 bg-brand-500 text-white"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs transition-colors ${
                        pagination.page === page
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

              {/* Next Page */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
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

      {/* Student Performance Modal */}
      {showPerformanceModal && selectedCertificateId && (
        <StudentPerformanceModal
          isOpen={showPerformanceModal}
          certificateId={selectedCertificateId}
          onClose={() => {
            setShowPerformanceModal(false);
            setSelectedCertificateId(null);
          }}
          onIssue={async (certificateId) => {
            await handleIssueCertificate(certificateId);
            setShowPerformanceModal(false);
            setSelectedCertificateId(null);
          }}
          onReject={async (certificateId) => {
            await handleRejectCertificate(certificateId);
            setShowPerformanceModal(false);
            setSelectedCertificateId(null);
          }}
        />
      )}
    </div>
  );
}
