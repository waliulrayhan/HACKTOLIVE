"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineBriefcase,
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlineCurrencyDollar,
  HiOutlineOfficeBuilding,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineEye,
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

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  benefits?: string;
  icon?: string;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  applications?: Array<{ id: string; status: string }>;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CareerStats {
  total: number;
  active: number;
  closed: number;
  draft: number;
  totalApplications: number;
}

export default function CareersManagementPage() {
  const router = useRouter();
  const [careers, setCareers] = useState<Career[]>([]);
  const [allCareers, setAllCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [stats, setStats] = useState<CareerStats | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Career Management - HackToLive Academy";
  }, []);

  const fetchCareers = useCallback(async () => {
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

      if (searchTerm.trim()) params.append('search', searchTerm.trim());
      if (statusFilter && statusFilter !== 'ALL') params.append('status', statusFilter);
      if (departmentFilter && departmentFilter !== 'ALL') params.append('department', departmentFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/career?${params.toString()}`,
        {
          signal: fetchControllerRef.current.signal,
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch careers');

      const data = await response.json();
      setCareers(data.data || []);
      setPagination(data.pagination || {
        total: 0,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: 0,
      });
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error('Error fetching careers:', error);
      toast.error('Failed to fetch careers', {
        description: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, statusFilter, departmentFilter]);

  const fetchAllCareers = useCallback(async () => {
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

      if (!response.ok) throw new Error('Failed to fetch all careers');
      const data = await response.json();
      setAllCareers(data.data || []);
    } catch (error) {
      console.error('Error fetching all careers:', error);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/career/stats`,
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

  useEffect(() => {
    fetchAllCareers();
    fetchStats();
  }, [fetchAllCareers, fetchStats]);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, departmentFilter, itemsPerPage]);

  const openDeleteModal = (careerId: string, careerTitle: string) => {
    setCareerToDelete({ id: careerId, title: careerTitle });
    setShowDeleteModal(true);
  };

  const handleDeleteCareer = async () => {
    if (!careerToDelete) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/career/${careerToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete career');
      
      toast.success('Career position deleted successfully!');
      setShowDeleteModal(false);
      setCareerToDelete(null);
      fetchCareers();
      fetchStats();
      fetchAllCareers();
    } catch (error) {
      console.error('Error deleting career:', error);
      toast.error('Failed to delete career', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewModal = (career: Career) => {
    setSelectedCareer(career);
    setShowViewModal(true);
  };

  const handleEditCareer = (careerId: string) => {
    router.push(`/admin/careers/${careerId}/edit`);
  };

  const handleCreateCareer = () => {
    router.push('/admin/careers/create');
  };

  const handleViewApplications = (careerId: string, careerTitle: string) => {
    router.push(`/admin/applications?careerId=${careerId}`);
  };

  const getStatusBadgeColor = (status: string): 'success' | 'warning' | 'light' => {
    const colors: Record<string, 'success' | 'warning' | 'light'> = {
      'ACTIVE': 'success',
      'DRAFT': 'warning',
      'CLOSED': 'light',
    };
    return colors[status] || 'light';
  };

  const getDepartmentBadgeColor = (department: string): 'info' | 'primary' | 'success' | 'error' | 'light' => {
    const colors: Record<string, 'info' | 'primary' | 'success' | 'error' | 'light'> = {
      'Security Services': 'info',
      'Academy': 'primary',
      'SOC Team': 'success',
      'Technology': 'error',
    };
    return colors[department] || 'light';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const parseJsonArray = (jsonString: string): string[] => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
    }
  };

  const departments = Array.from(new Set((allCareers || []).map(career => career.department)));

  if (loading && !careers.length) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Career Management" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Career Management" />
      
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5">
          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                <HiOutlineBriefcase className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Positions</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-500 dark:text-success-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Active</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-500/15">
                <HiOutlineXCircle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Closed</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.closed}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-500/15">
                <HiOutlineDocumentText className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Draft</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.draft}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
                <HiOutlineUserGroup className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Applications</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.totalApplications}</p>
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
                Career Positions
              </h2>
              <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Manage career opportunities and openings
              </p>
            </div>
            <button
              onClick={handleCreateCareer}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 hover:border-brand-600"
            >
              <HiOutlinePlus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Create Position</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search careers... (Press Enter to search)"
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
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
              <option value="DRAFT">Draft</option>
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-9 sm:h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
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
                    className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Position
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Department
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Location
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Applications
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Created
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
                {careers.length === 0 ? (
                  <TableRow>
                    <TableCell className="px-3 sm:px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="col-span-full">
                        No career positions found
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  careers.map((career) => (
                    <TableRow
                      key={career.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/2"
                    >
                      <TableCell className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                            {career.title}
                          </span>
                          {career.experience && (
                            <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                              {career.experience}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <Badge
                          variant="light"
                          color={getDepartmentBadgeColor(career.department)}
                          size="sm"
                        >
                          {career.department}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                          <HiOutlineLocationMarker className="h-3 w-3" />
                          {career.location}
                        </div>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <Badge
                          variant="light"
                          color={getStatusBadgeColor(career.status)}
                          size="sm"
                        >
                          {career.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <button
                          onClick={() => handleViewApplications(career.id, career.title)}
                          className="text-[10px] sm:text-xs font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300"
                        >
                          {career.applications?.length || 0} applications
                        </button>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(career.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 sm:px-4 py-2.5 sm:py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openViewModal(career)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            title="View Details"
                          >
                            <HiOutlineEye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => handleEditCareer(career.id)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-white/5 dark:hover:text-brand-400"
                            title="Edit"
                          >
                            <HiOutlinePencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(career.id, career.title)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-error-600 dark:hover:bg-white/5 dark:hover:text-error-400"
                            title="Delete"
                          >
                            <HiOutlineTrash className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
      {showViewModal && selectedCareer && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Career Position Details
              </h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedCareer(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 pb-6">
              {/* Title and Status */}
              <div className="pt-5 pb-5 border-b border-gray-200 dark:border-gray-800">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {selectedCareer.title}
                </h4>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="light"
                    color={getStatusBadgeColor(selectedCareer.status)}
                    size="sm"
                  >
                    {selectedCareer.status}
                  </Badge>
                  <Badge
                    variant="light"
                    color={getDepartmentBadgeColor(selectedCareer.department)}
                    size="sm"
                  >
                    {selectedCareer.department}
                  </Badge>
                  {selectedCareer.featured && (
                    <Badge variant="light" color="primary" size="sm">
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="space-y-4 pt-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                      <HiOutlineLocationMarker className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Location</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedCareer.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                      <HiOutlineClock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedCareer.type}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                      <HiOutlineBriefcase className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Experience</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedCareer.experience}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                      <HiOutlineCurrencyDollar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Salary</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedCareer.salary}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                      <HiOutlineUserGroup className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Applications</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {selectedCareer.applications?.length || 0}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
                      <HiOutlineCalendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Created</p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {formatDate(selectedCareer.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="pt-2">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Description</p>
                  <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                    {selectedCareer.description}
                  </p>
                </div>

                {/* Requirements */}
                {selectedCareer.requirements && parseJsonArray(selectedCareer.requirements).length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Requirements</p>
                    <ul className="space-y-1.5">
                      {parseJsonArray(selectedCareer.requirements).map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-brand-500 dark:text-brand-400 mt-1">•</span>
                          <span className="text-sm text-gray-900 dark:text-white flex-1">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Responsibilities */}
                {selectedCareer.responsibilities && parseJsonArray(selectedCareer.responsibilities).length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Responsibilities</p>
                    <ul className="space-y-1.5">
                      {parseJsonArray(selectedCareer.responsibilities).map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-brand-500 dark:text-brand-400 mt-1">•</span>
                          <span className="text-sm text-gray-900 dark:text-white flex-1">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {selectedCareer.benefits && parseJsonArray(selectedCareer.benefits).length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Benefits</p>
                    <ul className="space-y-1.5">
                      {parseJsonArray(selectedCareer.benefits).map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-brand-500 dark:text-brand-400 mt-1">•</span>
                          <span className="text-sm text-gray-900 dark:text-white flex-1">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedCareer(null);
                  }}
                  className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditCareer(selectedCareer.id);
                  }}
                  className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30"
                >
                  <HiOutlinePencil className="h-4 w-4" />
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && careerToDelete && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Career Position
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCareerToDelete(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{careerToDelete.title}</span>?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This action cannot be undone and will permanently remove this career position and all associated applications from the system.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCareerToDelete(null);
                }}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCareer}
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
                    Delete Career
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
