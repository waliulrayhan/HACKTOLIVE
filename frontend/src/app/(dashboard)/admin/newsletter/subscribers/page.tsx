"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineBan,
  HiOutlineEmojiSad,
  HiOutlineDownload,
  HiOutlineRefresh,
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

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [allSubscribers, setAllSubscribers] = useState<Subscriber[]>([]);
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<{ id: string; email: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Newsletter Subscribers - HackToLive Academy";
  }, []);

  const fetchSubscribers = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/newsletter/subscribers`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error('Failed to fetch subscribers');
      
      const result = await response.json();
      const data = result.data || result || [];
      setAllSubscribers(data);
      
      // Apply filters
      let filteredData = data;
      if (statusFilter !== 'ALL') {
        filteredData = filteredData.filter((sub: Subscriber) => sub.status === statusFilter);
      }
      if (searchTerm.trim()) {
        filteredData = filteredData.filter((sub: Subscriber) =>
          sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setSubscribers(paginatedData);
      setPagination({
        total: filteredData.length,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching subscribers:', error);
        toast.error('Failed to load subscribers', {
          description: 'Please try again',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const openDeleteModal = (subscriberId: string, subscriberEmail: string) => {
    setSubscriberToDelete({ id: subscriberId, email: subscriberEmail });
    setShowDeleteModal(true);
  };

  const handleDeleteSubscriber = async () => {
    if (!subscriberToDelete) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/newsletter/subscribers/${subscriberToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete subscriber');
      
      toast.success('Subscriber deleted successfully!');
      setShowDeleteModal(false);
      setSubscriberToDelete(null);
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to delete subscriber', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportSubscribers = () => {
    const csv = [
      ["Email", "Name", "Status", "Source", "Subscribed At"],
      ...allSubscribers.map((sub) => [
        sub.email,
        sub.name || "",
        sub.status,
        sub.source || "",
        new Date(sub.subscribedAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString()}.csv`;
    a.click();
    
    toast.success('Export successful!', {
      description: 'Subscribers have been exported to CSV',
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'SUBSCRIBED':
        return 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500';
      case 'UNSUBSCRIBED':
        return 'bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-500';
      case 'BOUNCED':
        return 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500';
      case 'COMPLAINED':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-500';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUBSCRIBED':
        return <HiOutlineCheckCircle className="h-3.5 w-3.5" />;
      case 'UNSUBSCRIBED':
        return <HiOutlineXCircle className="h-3.5 w-3.5" />;
      case 'BOUNCED':
        return <HiOutlineBan className="h-3.5 w-3.5" />;
      case 'COMPLAINED':
        return <HiOutlineEmojiSad className="h-3.5 w-3.5" />;
      default:
        return null;
    }
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
        <PageBreadcrumb pageTitle="Newsletter Subscribers" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Newsletter Subscribers" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Subscribers</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{allSubscribers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {allSubscribers.filter(s => s.status === 'SUBSCRIBED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-error-100 dark:bg-error-500/15">
              <HiOutlineXCircle className="h-4 w-4 sm:h-5 sm:w-5 text-error-600 dark:text-error-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Unsubscribed</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {allSubscribers.filter(s => s.status === 'UNSUBSCRIBED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
              <HiOutlineBan className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Bounced</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {allSubscribers.filter(s => s.status === 'BOUNCED').length}
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
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Subscriber List</h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Manage and track all newsletter subscribers
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchSubscribers}
              className="h-9 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
            >
              <HiOutlineRefresh className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button
              onClick={exportSubscribers}
              className="h-9 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30"
            >
              <HiOutlineDownload className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email or name... (Press Enter to search)"
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
              <option value="SUBSCRIBED">Subscribed</option>
              <option value="UNSUBSCRIBED">Unsubscribed</option>
              <option value="BOUNCED">Bounced</option>
              <option value="COMPLAINED">Complained</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  <TableCell isHeader className="w-[30%] px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Source
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Subscribed At
                    </span>
                  </TableCell>
                  <TableCell isHeader className="w-20 px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Actions
                    </span>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-3 py-10 sm:px-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <HiOutlineMail className="h-12 w-12 text-gray-300 dark:text-gray-700" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No subscribers found</p>
                        {(searchTerm || statusFilter !== 'ALL') && (
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setSearchInput('');
                              setStatusFilter('ALL');
                            }}
                            className="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-500"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((subscriber) => (
                    <TableRow 
                      key={subscriber.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/2"
                    >
                      <TableCell className="px-3 py-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/15">
                            <HiOutlineMail className="h-4 w-4 text-brand-500 dark:text-brand-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                              {subscriber.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-3 sm:px-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {subscriber.name || '-'}
                        </p>
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center sm:px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-full ${getStatusBadgeClass(subscriber.status)}`}>
                          {getStatusIcon(subscriber.status)}
                          {subscriber.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-3 sm:px-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {subscriber.source || '-'}
                        </p>
                      </TableCell>
                      <TableCell className="px-3 py-3 sm:px-4">
                        <div className="flex items-center gap-1.5">
                          <HiOutlineCalendar className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDate(subscriber.subscribedAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center sm:px-4">
                        <button
                          onClick={() => openDeleteModal(subscriber.id, subscriber.email)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-error-600 transition-colors hover:bg-error-50 dark:text-error-500 dark:hover:bg-error-500/10"
                          title="Delete subscriber"
                        >
                          <HiOutlineTrash className="h-3.5 w-3.5" />
                        </button>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && subscriberToDelete && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Subscriber
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
                Are you sure you want to delete the subscriber <span className="font-semibold text-gray-900 dark:text-white">{subscriberToDelete.email}</span>?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This action cannot be undone and will permanently remove this subscriber from the system.
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
                onClick={handleDeleteSubscriber}
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
                    Delete Subscriber
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
