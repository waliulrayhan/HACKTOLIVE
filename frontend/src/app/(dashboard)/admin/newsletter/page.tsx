"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { DashboardLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import Button from "@/components/ui/button/Button";
import {
  HiOutlineMail,
  HiOutlineUsers,
  HiOutlinePaperAirplane,
  HiOutlineUserRemove,
  HiOutlinePlus,
  HiOutlineViewList,
  HiOutlineTrendingUp,
  HiOutlineCheckCircle,
} from "react-icons/hi";

interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribed: number;
  totalCampaigns: number;
  sentCampaigns: number;
  recentSubscriptions: number;
  subscriptionRate: string;
}

export default function NewsletterDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<NewsletterStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Newsletter Management - HACKTOLIVE Academy";
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/admin/newsletter/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load newsletter stats", {
        description: "Please try refreshing the page",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Newsletter Management" />
        <DashboardLoadingSkeleton />
      </div>
    );
  }

  const subscriptionRate = stats?.subscriptionRate || "0";
  const churnRate = stats?.totalSubscribers
    ? ((stats.unsubscribed / stats.totalSubscribers) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Newsletter Management" />

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <Button
          variant="primary"
          onClick={() => router.push("/admin/newsletter/campaigns/create")}
          className="flex items-center gap-1.5"
        >
          <HiOutlinePlus className="h-4 w-4" />
          <span className="hidden sm:inline">Create Campaign</span>
          <span className="sm:hidden">Create</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/newsletter/campaigns")}
          className="flex items-center gap-1.5"
        >
          <HiOutlineViewList className="h-4 w-4" />
          <span className="hidden sm:inline">View Campaigns</span>
          <span className="sm:hidden">Campaigns</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/admin/newsletter/subscribers")}
          className="flex items-center gap-1.5"
        >
          <HiOutlineUsers className="h-4 w-4" />
          <span className="hidden sm:inline">View Subscribers</span>
          <span className="sm:hidden">Subscribers</span>
        </Button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
              <HiOutlineUsers className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Subscribers</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats?.totalSubscribers || 0}</p>
            </div>
          </div>
          <div className="mt-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            <span className="text-green-600 dark:text-green-400">+{stats?.recentSubscriptions || 0}</span> in last 30 days
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
              <HiOutlineMail className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Active Subscribers</p>
              <p className="text-base sm:text-xl font-bold text-green-600 dark:text-green-400">{stats?.activeSubscribers || 0}</p>
            </div>
          </div>
          <div className="mt-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            {subscriptionRate}% subscription rate
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlinePaperAirplane className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Campaigns</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats?.totalCampaigns || 0}</p>
            </div>
          </div>
          <div className="mt-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            {stats?.sentCampaigns || 0} sent
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-500/15">
              <HiOutlineUserRemove className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Unsubscribed</p>
              <p className="text-base sm:text-xl font-bold text-red-600 dark:text-red-400">{stats?.unsubscribed || 0}</p>
            </div>
          </div>
          <div className="mt-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            {churnRate}% churn rate
          </div>
        </div>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => router.push("/admin/newsletter/campaigns/create")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
                <HiOutlinePlus className="h-4 w-4 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Create New Campaign</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Send emails to your subscribers</p>
              </div>
            </button>
            <button
              onClick={() => router.push("/admin/newsletter/campaigns")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
                <HiOutlineViewList className="h-4 w-4 text-purple-600 dark:text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">View All Campaigns</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage existing campaigns</p>
              </div>
            </button>
            <button
              onClick={() => router.push("/admin/newsletter/subscribers")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
                <HiOutlineUsers className="h-4 w-4 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Manage Subscribers</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">View and manage your subscriber list</p>
              </div>
            </button>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">Email Marketing Tips</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15">
                <HiOutlineTrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Best Time to Send</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Tuesday-Thursday, 10 AM - 2 PM for optimal engagement</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
                <HiOutlineMail className="h-4 w-4 text-purple-600 dark:text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Subject Line</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Keep it under 50 characters for better open rates</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15">
                <HiOutlineCheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Mobile Friendly</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">60% of emails are opened on mobile devices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
