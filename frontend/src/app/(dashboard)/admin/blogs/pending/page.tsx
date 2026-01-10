"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineRefresh,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { getFullImageUrl } from "@/lib/image-utils";

interface Blog {
  id: string;
  title: string;
  slug: string;
  mainImage?: string;
  metadata?: string;
  content: string;
  category: string;
  blogType: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  readTime?: string;
  tags?: string[];
  approvalStatus: string;
  createdAt: string;
  _count?: {
    comments: number;
    likes: number;
  };
}

export default function PendingBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Pending Blogs - Admin - HACKTOLIVE Academy";
  }, []);

  const fetchPendingBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/pending?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch pending blogs");

      const result = await response.json();
      setBlogs(result.data || []);
      setTotalPages(result.meta?.totalPages || 0);
      setTotalBlogs(result.meta?.total || 0);
    } catch (error) {
      console.error("Error fetching pending blogs:", error);
      toast.error("Failed to load pending blogs");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchPendingBlogs();
  }, [fetchPendingBlogs]);

  const handleApproveBlog = async (blogId: string) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !user.id) {
        toast.error("User not authenticated");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/${blogId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ adminId: user.id }),
        }
      );

      if (!response.ok) throw new Error("Failed to approve blog");

      toast.success("Blog approved and published successfully!");
      fetchPendingBlogs();
    } catch (error) {
      console.error("Error approving blog:", error);
      toast.error("Failed to approve blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRejectModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleRejectBlog = async () => {
    if (!selectedBlog) return;

    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !user.id) {
        toast.error("User not authenticated");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/${selectedBlog.id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            adminId: user.id,
            reason: rejectionReason,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to reject blog");

      toast.success("Blog rejected successfully!");
      setShowRejectModal(false);
      setSelectedBlog(null);
      fetchPendingBlogs();
    } catch (error) {
      console.error("Error rejecting blog:", error);
      toast.error("Failed to reject blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setShowViewModal(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryBadgeClass = (category: string) => {
    const colors: Record<string, string> = {
      CYBERSECURITY_INSIGHTS:
        "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-500",
      NEWS: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-500",
      TUTORIALS:
        "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-500",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-400"
    );
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Pending Blogs" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Pending Blogs for Approval" />

      {/* Header */}
      <div className="rounded-md border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Pending Blog Approvals
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Review and approve blog posts submitted by students
            </p>
          </div>
          <button
            onClick={fetchPendingBlogs}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <HiOutlineRefresh className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mt-4 flex gap-4">
          <div className="rounded-lg bg-warning-50 px-4 py-2 dark:bg-warning-950/20">
            <p className="text-xs text-warning-600 dark:text-warning-400">
              Pending Approval
            </p>
            <p className="text-lg font-bold text-warning-700 dark:text-warning-300">
              {totalBlogs}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <HiOutlineCheckCircle className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            <p className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
              No pending blogs
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              All blogs have been reviewed
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gray-50 dark:border-white/5 dark:bg-white/3">
                  <TableCell isHeader className="px-4 py-3">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Blog
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Author
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Submitted
                    </span>
                  </TableCell>
                  <TableCell isHeader className="w-48 px-4 py-3 text-center">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Actions
                    </span>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow
                    key={blog.id}
                    className="group border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/2"
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        {blog.mainImage && (
                          <div className="h-16 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                            <img
                              src={getFullImageUrl(blog.mainImage, "general")}
                              alt={blog.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1">
                            {blog.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {blog.metadata}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {blog.author?.avatar ? (
                          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <img
                              src={getFullImageUrl(blog.author.avatar, "avatar")}
                              alt={blog.author.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <HiOutlineUser className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {blog.author?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {blog.author?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadgeClass(
                          blog.category
                        )}`}
                      >
                        {blog.category.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <HiOutlineCalendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(blog.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openViewModal(blog)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                          title="View blog"
                        >
                          <HiOutlineEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleApproveBlog(blog.id)}
                          disabled={isSubmitting}
                          className="inline-flex h-8 px-3 items-center justify-center gap-1 rounded-md bg-success-600 text-xs font-medium text-white hover:bg-success-700 disabled:opacity-50"
                          title="Approve blog"
                        >
                          <HiOutlineCheckCircle className="h-4 w-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => openRejectModal(blog)}
                          disabled={isSubmitting}
                          className="inline-flex h-8 px-3 items-center justify-center gap-1 rounded-md bg-error-600 text-xs font-medium text-white hover:bg-error-700 disabled:opacity-50"
                          title="Reject blog"
                        >
                          <HiOutlineXCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-white/5">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-white/5 dark:bg-gray-900">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Blog Preview
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <HiOutlineEye className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {selectedBlog.mainImage && (
                <div className="mb-6 overflow-hidden rounded-lg">
                  <img
                    src={getFullImageUrl(selectedBlog.mainImage, "general")}
                    alt={selectedBlog.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedBlog.title}
              </h1>

              <div className="flex items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <HiOutlineUser className="h-4 w-4" />
                  {selectedBlog.author?.name}
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineCalendar className="h-4 w-4" />
                  {formatDate(selectedBlog.createdAt)}
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getCategoryBadgeClass(
                    selectedBlog.category
                  )}`}
                >
                  {selectedBlog.category.replace(/_/g, " ")}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {selectedBlog.metadata}
              </p>

              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBlog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400"
                    >
                      <HiOutlineTag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />

              <div className="mt-8 flex gap-3 border-t border-gray-200 pt-6 dark:border-white/5">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleApproveBlog(selectedBlog.id);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-success-600 px-4 py-2 text-sm font-medium text-white hover:bg-success-700 disabled:opacity-50"
                >
                  <HiOutlineCheckCircle className="h-5 w-5" />
                  Approve & Publish
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    openRejectModal(selectedBlog);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-error-600 px-4 py-2 text-sm font-medium text-white hover:bg-error-700 disabled:opacity-50"
                >
                  <HiOutlineXCircle className="h-5 w-5" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineXCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Reject Blog
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedBlog.title}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for rejection <span className="text-error-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  placeholder="Explain why this blog is being rejected..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectBlog}
                  disabled={isSubmitting || !rejectionReason.trim()}
                  className="flex-1 rounded-lg bg-error-600 px-4 py-2 text-sm font-medium text-white hover:bg-error-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Rejecting..." : "Reject Blog"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
