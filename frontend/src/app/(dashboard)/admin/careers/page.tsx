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
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
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
  const [showModal, setShowModal] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Career Management - HACKTOLIVE Academy";
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

      if (searchTerm) params.append('search', searchTerm);
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
      
      // Fetch all careers for filters
      if (!allCareers.length) {
        const allResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/career?limit=1000`,
          {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
            },
          }
        );
        const allData = await allResponse.json();
        setAllCareers(allData.data || []);
      }
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
    fetchCareers();
    fetchStats();
  }, [fetchCareers, fetchStats]);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
    setCurrentPage(1);
  };

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
    setShowModal(true);
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

  const getStatusBadgeClass = (status: string) => {
    const classes: Record<string, string> = {
      'ACTIVE': 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500',
      'CLOSED': 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400',
      'DRAFT': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-500',
    };
    return classes[status] || classes['DRAFT'];
  };

  const getDepartmentBadgeClass = (department: string) => {
    const colors: Record<string, string> = {
      'Security Services': 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500',
      'Academy': 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-500',
      'SOC Team': 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-500',
      'Technology': 'bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-500',
    };
    return colors[department] || 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400';
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

  if (loading) {
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

      {/* Filters and Actions */}
      <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search and Create Button */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <HiOutlineSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search careers..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="block w-full rounded-md border border-gray-300 bg-white py-1.5 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-gray-500"
              />
              {searchInput && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <HiOutlineX className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
            </div>
            <Button
              onClick={handleCreateCareer}
              className="whitespace-nowrap"
              size="sm"
            >
              <HiOutlinePlus className="mr-1.5 h-4 w-4" />
              Create Position
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
              <option value="DRAFT">Draft</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
            >
              <option value="10">10 per page</option>
              <option value="25">25 per page</option>
              <option value="50">50 per page</option>
              <option value="100">100 per page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="font-semibold">Position</TableCell>
                <TableCell className="font-semibold">Department</TableCell>
                <TableCell className="font-semibold">Location</TableCell>
                <TableCell className="font-semibold">Type</TableCell>
                <TableCell className="font-semibold">Status</TableCell>
                <TableCell className="font-semibold">Applications</TableCell>
                <TableCell className="font-semibold">Created</TableCell>
                <TableCell className="font-semibold text-right">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {careers.length === 0 ? (
                <TableRow>
                  <TableCell className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No career positions found
                  </TableCell>
                </TableRow>
              ) : (
                careers.map((career) => (
                  <TableRow key={career.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {career.title}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {career.experience}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getDepartmentBadgeClass(career.department)}`}>
                        {career.department}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <HiOutlineLocationMarker className="h-4 w-4" />
                        {career.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {career.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeClass(career.status)}`}>
                        {career.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleViewApplications(career.id, career.title)}
                        className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >
                        {career.applications?.length || 0} applications
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(career.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewModal(career)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5 dark:hover:text-gray-300"
                          title="View Details"
                        >
                          <HiOutlineSearch className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditCareer(career.id)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-white/5 dark:hover:text-brand-400"
                          title="Edit"
                        >
                          <HiOutlinePencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(career.id, career.title)}
                          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-error-600 dark:hover:bg-white/5 dark:hover:text-error-400"
                          title="Delete"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-white/5">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, pagination.total)} of{' '}
              {pagination.total} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={currentPage === pagination.totalPages}
                variant="outline"
                size="sm"
              >
                <HiOutlineChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {showModal && selectedCareer && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedCareer(null);
          }}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{selectedCareer.title}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCareer.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCareer.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCareer.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Experience</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCareer.experience}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Salary</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCareer.salary}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-1 ${getStatusBadgeClass(selectedCareer.status)}`}>
                  {selectedCareer.status}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {selectedCareer.description}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Requirements</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-900 dark:text-white">
                {parseJsonArray(selectedCareer.requirements).map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {selectedCareer.responsibilities && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Responsibilities</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-900 dark:text-white">
                  {parseJsonArray(selectedCareer.responsibilities).map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedCareer.benefits && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Benefits</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-900 dark:text-white">
                  {parseJsonArray(selectedCareer.benefits).map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && careerToDelete && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setCareerToDelete(null);
          }}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Delete Career Position</h3>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Are you sure you want to delete <strong>{careerToDelete.title}</strong>? 
                  This action cannot be undone and will also delete all associated applications.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCareerToDelete(null);
                }}
                variant="outline"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <button
                onClick={handleDeleteCareer}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition px-4 py-3 text-sm bg-error-500 text-white hover:bg-error-600 disabled:bg-error-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
