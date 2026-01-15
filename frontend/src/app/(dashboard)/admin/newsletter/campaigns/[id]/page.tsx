"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import Button from "@/components/ui/button/Button";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlinePaperAirplane,
  HiOutlineCalendar,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineMailOpen,
  HiOutlineCursorClick,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineX,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  body: string;
  status: string;
  scheduledAt: string | null;
  sentAt: string | null;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalOpened: number;
  totalClicked: number;
  createdAt: string;
  updatedAt: string;
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params?.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Campaign Details - HACKTOLIVE Academy";
    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/newsletter/campaigns/${campaignId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch campaign');
      
      const result = await response.json();
      setCampaign(result.data || result);
    } catch (error: any) {
      console.error('Error fetching campaign:', error);
      toast.error('Failed to load campaign', {
        description: 'Please try again',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/newsletter/campaigns/${campaignId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to delete campaign');
      
      toast.success('Campaign deleted successfully!');
      router.push('/admin/newsletter/campaigns');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign', {
        description: 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  const handleSend = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/newsletter/campaigns/${campaignId}/send`,
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
      fetchCampaign();
    } catch (error: any) {
      console.error('Error sending campaign:', error);
      toast.error('Failed to send campaign', {
        description: error.message || 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
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

  const calculateOpenRate = () => {
    if (!campaign || campaign.totalSent === 0) return '0';
    return ((campaign.totalOpened / campaign.totalSent) * 100).toFixed(1);
  };

  const calculateClickRate = () => {
    if (!campaign || campaign.totalSent === 0) return '0';
    return ((campaign.totalClicked / campaign.totalSent) * 100).toFixed(1);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Campaign Details" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Campaign Details" />
        <div className="rounded-md border border-gray-200 bg-white p-8 text-center dark:border-white/5 dark:bg-white/3">
          <p className="text-gray-500 dark:text-gray-400">Campaign not found</p>
          <Button
            onClick={() => router.push('/admin/newsletter/campaigns')}
            className="mt-4 h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-brand-500 text-white hover:bg-brand-600"
          >
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Campaign Details" />

      {/* Header Card */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{campaign.name}</h2>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-full ${getStatusBadgeClass(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {(campaign.status === 'DRAFT' || campaign.status === 'SCHEDULED') && (
              <>
                <Button
                  onClick={() => router.push(`/admin/newsletter/campaigns/${campaignId}/edit`)}
                  className="h-9 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
                >
                  <HiOutlinePencilAlt className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={() => setShowSendModal(true)}
                  className="h-9 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30"
                >
                  <HiOutlinePaperAirplane className="h-4 w-4" />
                  Send Now
                </Button>
              </>
            )}
            {campaign.status !== 'SENDING' && (
              <Button
                onClick={() => setShowDeleteModal(true)}
                className="h-9 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-4 text-sm bg-error-600 text-white hover:bg-error-700 shadow-lg shadow-error-600/30"
              >
                <HiOutlineTrash className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {campaign.totalSent > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                <HiOutlinePaperAirplane className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Sent</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{campaign.totalSent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
                <HiOutlineMailOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Opened</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{calculateOpenRate()}%</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
                <HiOutlineCursorClick className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Clicked</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{calculateClickRate()}%</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-error-100 dark:bg-error-500/15">
                <HiOutlineXCircle className="h-4 w-4 sm:h-5 sm:w-5 text-error-600 dark:text-error-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Failed</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{campaign.totalFailed}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Info */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Campaign Information</h2>
        </div>
        <div className="p-3 sm:p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email Subject</label>
            <p className="text-sm text-gray-900 dark:text-white">{campaign.subject}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Created At</label>
              <div className="flex items-center gap-2">
                <HiOutlineCalendar className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-900 dark:text-white">{formatDate(campaign.createdAt)}</p>
              </div>
            </div>

            {campaign.sentAt && (
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Sent At</label>
                <div className="flex items-center gap-2">
                  <HiOutlineCalendar className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(campaign.sentAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Body Preview */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Email Preview</h2>
        </div>
        <div className="p-3 sm:p-6">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <iframe
              srcDoc={campaign.body}
              className="w-full h-[600px] bg-white"
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>

      {/* Send Confirmation Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/15">
                  <HiOutlinePaperAirplane className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Send Campaign</h3>
              </div>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to send this campaign to all subscribers?
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowSendModal(false)}
                disabled={isSubmitting}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSubmitting}
                className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/30 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineExclamationCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Campaign</h3>
              </div>
              <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete this campaign? This action cannot be undone.
              </p>
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
                className="h-10 inline-flex items-center justify-center font-medium rounded-lg transition px-4 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-error-600 text-white hover:bg-error-700 shadow-lg shadow-error-600/30 disabled:opacity-50"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
