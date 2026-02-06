"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineDocumentText,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClipboardCheck,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineDownload,
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

interface Application {
  id: string;
  careerId: string;
  name: string;
  email: string;
  phone: string;
  experience?: string;
  resumeUrl?: string;
  coverLetter: string;
  status: 'PENDING' | 'REVIEWING' | 'SHORTLISTED' | 'INTERVIEWED' | 'ACCEPTED' | 'REJECTED';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  career: {
    id: string;
    title: string;
    department: string;
    location: string;
  };
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApplicationStats {
  total: number;
  pending: number;
  reviewing: number;
  shortlisted: number;
  interviewed: number;
  accepted: number;
  rejected: number;
}

export default function ApplicationsManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const careerIdFromUrl = searchParams.get('careerId');

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [careerFilter, setCareerFilter] = useState<string>(careerIdFromUrl || 'ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [careers, setCareers] = useState<any[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: '' as Application['status'],
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Applications Management - HackToLive Academy";
  }, []);

  const fetchApplications = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter && statusFilter !== 'ALL') params.append('status', statusFilter);
      if (careerFilter && careerFilter !== 'ALL') params.append('careerId', careerFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/career/applications/list?${params.toString()}`,
        {
          signal: fetchControllerRef.current.signal,
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch applications');

      const data = await response.json();
      setApplications(data.data || []);
      setPagination(data.pagination || {
        total: 0,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: 0,
      });
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications', {
        description: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, careerFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/career/applications/stats`,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  const fetchCareers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/career?limit=1000`,
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch careers');
      const data = await response.json();
      setCareers(data.data || []);
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
    fetchStats();
    fetchCareers();
  }, [fetchApplications, fetchStats, fetchCareers]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const openDeleteModal = (applicationId: string, applicantName: string) => {
    setApplicationToDelete({ id: applicationId, name: applicantName });
    setShowDeleteModal(true);
  };

  const handleDeleteApplication = async () => {
    if (!applicationToDelete) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/career/applications/${applicationToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete application');
      
      toast.success('Application deleted successfully!');
      setShowDeleteModal(false);
      setApplicationToDelete(null);
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error('Failed to delete application', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewModal = (application: Application) => {
    setSelectedApplication(application);
    setShowViewModal(true);
  };

  const openStatusModal = (application: Application) => {
    setSelectedApplication(application);
    setStatusUpdateData({
      status: application.status,
      notes: application.notes || '',
    });
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplication) return;

    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/career/applications/${selectedApplication.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(statusUpdateData),
        }
      );

      if (!response.ok) throw new Error('Failed to update application status');
      
      toast.success('Application status updated successfully!');
      setShowStatusModal(false);
      setSelectedApplication(null);
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application', {
        description: 'Please try again',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const classes: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-500',
      'REVIEWING': 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500',
      'SHORTLISTED': 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-500',
      'INTERVIEWED': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-500',
      'ACCEPTED': 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500',
      'REJECTED': 'bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-500',
    };
    return classes[status] || classes['PENDING'];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Applications Management" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Applications Management" />
      
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-7">
          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                <HiOutlineDocumentText className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-500/15">
                <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
                <HiOutlineEye className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Reviewing</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.reviewing}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
                <HiOutlineClipboardCheck className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Shortlisted</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.shortlisted}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/15">
                <HiOutlineUser className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Interviewed</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.interviewed}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-500 dark:text-success-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Accepted</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.accepted}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-error-100 dark:bg-error-500/15">
                <HiOutlineXCircle className="h-4 w-4 sm:h-5 sm:w-5 text-error-500 dark:text-error-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Rejected</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                Job Applications
              </h2>
              <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Manage and review job applications
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search applicants... (Press Enter to search)"
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
              <option value="PENDING">Pending</option>
              <option value="REVIEWING">Reviewing</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEWED">Interviewed</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              value={careerFilter}
              onChange={(e) => setCareerFilter(e.target.value)}
              className="h-9 sm:h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Positions</option>
              {careers.map((career) => (
                <option key={career.id} value={career.id}>{career.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-3 sm:px-4 py-2 text-center text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Applicant
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 sm:px-4 py-2 text-center text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Position
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 sm:px-4 py-2 text-center text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Contact
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 sm:px-4 py-2 text-center text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Experience
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 sm:px-4 py-2 text-center text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 sm:px-4 py-2 text-center text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Applied
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 sm:px-4 py-2 text-center text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="px-3 sm:px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <HiOutlineDocumentText className="h-10 w-10 text-gray-400" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">No applications found</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Applications will appear here once candidates apply
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => (
                  <TableRow
                    key={application.id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/2"
                  >
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <HiOutlineUser className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {application.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {application.career.title}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                          {application.career.department}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <div className="flex flex-col gap-1 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <HiOutlineMail className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[150px]">{application.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HiOutlinePhone className="h-3 w-3 shrink-0" />
                          {application.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                        {application.experience || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusBadgeClass(application.status)}`}>
                        {application.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        <HiOutlineCalendar className="h-3 w-3 shrink-0" />
                        {formatDate(application.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openViewModal(application)}
                          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-300"
                          title="View Details"
                        >
                          <HiOutlineEye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openStatusModal(application)}
                          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-white/5 dark:hover:text-brand-400"
                          title="Update Status"
                        >
                          <HiOutlineClipboardCheck className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(application.id, application.name)}
                          className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-error-600 dark:hover:bg-white/5 dark:hover:text-error-400"
                          title="Delete"
                        >
                          <HiOutlineTrash className="h-3.5 w-3.5" />
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
          <div className="flex flex-col gap-3 border-t border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 dark:border-white/5">
            <div className="flex items-center gap-2 text-xs">
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
                      <span className="px-1 sm:px-2 text-gray-400 text-xs">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs font-medium transition-colors ${
                        pagination.page === page
                          ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400'
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
      {showViewModal && selectedApplication && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Application Details
              </h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedApplication(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6">
              {/* Applicant Info */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-gray-200 dark:border-gray-800 pt-5">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {selectedApplication.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedApplication.status)}`}>
                      {selectedApplication.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 pt-5 pb-5 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                    <HiOutlineBriefcase className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Position</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.career.title}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                    <HiOutlineBriefcase className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Department</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.career.department}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                    <HiOutlineMail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
                    <p className="text-sm text-gray-900 dark:text-white break-all">{selectedApplication.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                    <HiOutlinePhone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                    <HiOutlineClock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Experience</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedApplication.experience || 'Not specified'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                    <HiOutlineCalendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Applied On</p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(selectedApplication.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="pt-5 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Cover Letter</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </p>
                </div>

                {selectedApplication.resumeUrl && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Resume / CV</p>
                    <div className="flex gap-2">
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}${selectedApplication.resumeUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <HiOutlineEye className="h-4 w-4" />
                        View PDF
                      </a>
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}${selectedApplication.resumeUrl}`}
                        download
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <HiOutlineDownload className="h-4 w-4" />
                        Download
                      </a>
                    </div>
                  </div>
                )}

                {selectedApplication.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Internal Notes</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {selectedApplication.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800 rounded-b-xl">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedApplication(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setShowStatusModal(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 rounded-lg transition-colors"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedApplication && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Update Application Status
              </h3>
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedApplication(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={statusUpdateData.status}
                  onChange={(e) => setStatusUpdateData(prev => ({ 
                    ...prev, 
                    status: e.target.value as Application['status'] 
                  }))}
                  className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-gray-800 dark:text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWING">Reviewing</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEWED">Interviewed</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Internal Notes
                </label>
                <textarea
                  value={statusUpdateData.notes}
                  onChange={(e) => setStatusUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  placeholder="Add notes about this application..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800 rounded-b-xl">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedApplication(null);
                }}
                disabled={updatingStatus}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={updatingStatus}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {updatingStatus && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {updatingStatus ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && applicationToDelete && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Application</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setApplicationToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete the application from <strong>{applicationToDelete.name}</strong>? 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800 rounded-b-xl">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setApplicationToDelete(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteApplication}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-error-500 hover:bg-error-600 dark:bg-error-600 dark:hover:bg-error-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
