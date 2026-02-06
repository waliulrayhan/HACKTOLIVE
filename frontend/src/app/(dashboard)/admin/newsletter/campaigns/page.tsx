"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineMail,
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlinePencilAlt,
  HiOutlineEye,
  HiOutlinePlus,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineExclamationCircle,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlinePaperAirplane,
  HiOutlineBan,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChartBar,
  HiOutlineMailOpen,
  HiOutlineCursorClick,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalOpened: number;
  totalClicked: number;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
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
  const [campaignToDelete, setCampaignToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [campaignToSend, setCampaignToSend] = useState<{ id: string; name: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Email Campaigns - HackToLive Academy";
  }, []);

  const fetchCampaigns = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/newsletter/campaigns`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error('Failed to fetch campaigns');
      
      const result = await response.json();
      const data = result.data || result || [];
      setAllCampaigns(data);
      
      // Apply filters
      let filteredData = data;
      if (statusFilter !== 'ALL') {
        filteredData = filteredData.filter((campaign: Campaign) => campaign.status === statusFilter);
      }
      if (searchTerm.trim()) {
        filteredData = filteredData.filter((campaign: Campaign) =>
          campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setCampaigns(paginatedData);
      setPagination({
        total: filteredData.length,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching campaigns:', error);
        toast.error('Failed to load campaigns', {
          description: 'Please try again',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const openDeleteModal = (campaignId: string, campaignName: string) => {
    setCampaignToDelete({ id: campaignId, name: campaignName });
    setShowDeleteModal(true);
    setShowActionsMenu(null);
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/newsletter/campaigns/${campaignToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete campaign');
      
      toast.success('Campaign deleted successfully!');
      setShowDeleteModal(false);
      setCampaignToDelete(null);
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSendModal = (campaignId: string, campaignName: string) => {
    setCampaignToSend({ id: campaignId, name: campaignName });
    setShowSendModal(true);
    setShowActionsMenu(null);
  };

  const handleSendCampaign = async () => {
    if (!campaignToSend) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/newsletter/campaigns/${campaignToSend.id}/send`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to send campaign');
      
      const data = await response.json();
      toast.success('Campaign is being sent!', {
        description: data.message || 'Emails are being sent to subscribers',
      });
      setShowSendModal(false);
      setCampaignToSend(null);
      fetchCampaigns();
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      toast.error('Failed to send campaign', {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCampaign = () => {
    router.push('/admin/newsletter/campaigns/create');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'SENT':
        return 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-500';
      case 'SENDING':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500';
      case 'SCHEDULED':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-500';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400';
      case 'CANCELLED':
        return 'bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-500';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SENT':
        return <HiOutlineCheckCircle className="h-3.5 w-3.5" />;
      case 'SENDING':
        return <HiOutlinePaperAirplane className="h-3.5 w-3.5" />;
      case 'SCHEDULED':
        return <HiOutlineClock className="h-3.5 w-3.5" />;
      case 'DRAFT':
        return <HiOutlinePencilAlt className="h-3.5 w-3.5" />;
      case 'CANCELLED':
        return <HiOutlineXCircle className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  const calculateOpenRate = (campaign: Campaign) => {
    if (campaign.totalSent === 0) return 0;
    return (campaign.totalOpened / campaign.totalSent) * 100;
  };

  const calculateClickRate = (campaign: Campaign) => {
    if (campaign.totalSent === 0) return 0;
    return (campaign.totalClicked / campaign.totalSent) * 100;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate stats
  const totalSent = allCampaigns.reduce((sum, c) => sum + c.totalSent, 0);
  const totalOpened = allCampaigns.reduce((sum, c) => sum + c.totalOpened, 0);
  const totalClicked = allCampaigns.reduce((sum, c) => sum + c.totalClicked, 0);
  const overallOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Email Campaigns" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Email Campaigns" />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineMail className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Campaigns</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{allCampaigns.length}</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlinePaperAirplane className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Sent</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {totalSent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineMailOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Open Rate</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {overallOpenRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineCursorClick className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Clicks</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {totalClicked.toLocaleString()}
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
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Campaign List</h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Create and manage email campaigns
            </p>
          </div>
          <Button
            onClick={handleCreateCampaign}
            className="h-9 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30"
          >
            <HiOutlinePlus className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by campaign name or subject... (Press Enter to search)"
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
              <option value="DRAFT">Draft</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="SENDING">Sending</option>
              <option value="SENT">Sent</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  <TableCell isHeader className="w-[20%] px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Campaign Name
                    </span>
                  </TableCell>
                  <TableCell isHeader className="w-[20%] px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Subject
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Sent
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Open Rate
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Click Rate
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Created
                    </span>
                  </TableCell>
                  <TableCell isHeader className="w-32 px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Actions
                    </span>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="px-3 py-10 sm:px-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <HiOutlineMail className="h-12 w-12 text-gray-300 dark:text-gray-700" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No campaigns found</p>
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
                  campaigns.map((campaign) => (
                    <TableRow 
                      key={campaign.id}
                      className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/2"
                    >
                      <TableCell className="px-3 py-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-500/15">
                            <HiOutlineMail className="h-4 w-4 text-brand-500 dark:text-brand-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                              {campaign.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-3 sm:px-4">
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                          {campaign.subject}
                        </p>
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center sm:px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-full ${getStatusBadgeClass(campaign.status)}`}>
                          {getStatusIcon(campaign.status)}
                          {campaign.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center sm:px-4">
                        {campaign.totalSent > 0 ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {campaign.totalSent.toLocaleString()}
                            </p>
                            {campaign.totalFailed > 0 && (
                              <p className="text-[10px] text-error-600 dark:text-error-500">
                                {campaign.totalFailed} failed
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 dark:text-gray-400">-</p>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center sm:px-4">
                        {campaign.totalSent > 0 ? (
                          <div className="flex flex-col items-center gap-1">
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {calculateOpenRate(campaign).toFixed(1)}%
                            </p>
                            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all"
                                style={{ width: `${Math.min(100, calculateOpenRate(campaign))}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 dark:text-gray-400">-</p>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center sm:px-4">
                        {campaign.totalSent > 0 ? (
                          <div className="flex flex-col items-center gap-1">
                            <p className="text-xs font-medium text-gray-900 dark:text-white">
                              {calculateClickRate(campaign).toFixed(1)}%
                            </p>
                            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-success-500 dark:bg-success-400 rounded-full transition-all"
                                style={{ width: `${Math.min(100, calculateClickRate(campaign))}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 dark:text-gray-400">-</p>
                        )}
                      </TableCell>
                      <TableCell className="px-3 py-3 sm:px-4">
                        <div className="flex items-center gap-1.5">
                          <HiOutlineCalendar className="h-3.5 w-3.5 text-gray-400" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {formatDate(campaign.createdAt)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-3 text-center sm:px-4">
                        <div className="relative">
                          <button
                            data-campaign-id={campaign.id}
                            onClick={() => setShowActionsMenu(showActionsMenu === campaign.id ? null : campaign.id)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                            title="Actions"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
                              <circle cx="8" cy="3" r="1.5" />
                              <circle cx="8" cy="8" r="1.5" />
                              <circle cx="8" cy="13" r="1.5" />
                            </svg>
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

      {/* Actions Dropdown Menu */}
      {showActionsMenu && campaigns.find(c => c.id === showActionsMenu) && (
        <>
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setShowActionsMenu(null)}
          />
          <div 
            className="fixed z-[9999] w-48 rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
            style={{
              top: `${document.querySelector(`[data-campaign-id="${showActionsMenu}"]`)?.getBoundingClientRect().bottom ?? 0}px`,
              left: `${(document.querySelector(`[data-campaign-id="${showActionsMenu}"]`)?.getBoundingClientRect().right ?? 0) - 192}px`,
            }}
          >
            <div className="py-1">
              <button
                onClick={() => {
                  router.push(`/admin/newsletter/campaigns/${showActionsMenu}`);
                  setShowActionsMenu(null);
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <HiOutlineEye className="h-4 w-4" />
                View Details
              </button>
              
              {(campaigns.find(c => c.id === showActionsMenu)?.status === 'DRAFT' || 
                campaigns.find(c => c.id === showActionsMenu)?.status === 'SCHEDULED') && (
                <>
                  <button
                    onClick={() => {
                      router.push(`/admin/newsletter/campaigns/${showActionsMenu}/edit`);
                      setShowActionsMenu(null);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <HiOutlinePencilAlt className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      const campaign = campaigns.find(c => c.id === showActionsMenu);
                      if (campaign) openSendModal(campaign.id, campaign.name);
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-xs text-blue-600 hover:bg-gray-50 dark:text-blue-400 dark:hover:bg-gray-700"
                  >
                    <HiOutlinePaperAirplane className="h-4 w-4" />
                    Send Now
                  </button>
                </>
              )}
              
              {campaigns.find(c => c.id === showActionsMenu)?.status !== 'SENDING' && (
                <button
                  onClick={() => {
                    const campaign = campaigns.find(c => c.id === showActionsMenu);
                    if (campaign) openDeleteModal(campaign.id, campaign.name);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-xs text-error-600 hover:bg-gray-50 dark:text-error-500 dark:hover:bg-gray-700"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Send Confirmation Modal */}
      {showSendModal && campaignToSend && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/15">
                  <HiOutlinePaperAirplane className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Send Campaign
                </h3>
              </div>
              <button
                onClick={() => setShowSendModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to send the campaign <span className="font-semibold text-gray-900 dark:text-white">{campaignToSend.name}</span> to all subscribers?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This action will send emails to all active subscribers and cannot be undone.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowSendModal(false)}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSendCampaign}
                className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <HiOutlinePaperAirplane className="h-4 w-4" />
                    Send Campaign
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && campaignToDelete && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Delete Campaign
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
                Are you sure you want to delete the campaign <span className="font-semibold text-gray-900 dark:text-white">{campaignToDelete.name}</span>?
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                This action cannot be undone and will permanently remove this campaign from the system.
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
                onClick={handleDeleteCampaign}
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
                    Delete Campaign
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
