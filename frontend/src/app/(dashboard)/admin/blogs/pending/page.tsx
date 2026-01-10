"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
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
  HiOutlineClock,
  HiOutlineNewspaper,
  HiOutlineSearch,
  HiOutlineX,
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

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function PendingBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Pending Blogs - Admin - HACKTOLIVE Academy";
  }, []);

  const fetchPendingBlogs = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/blogs/pending?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch pending blogs");

      const result = await response.json();
      const data = result.data || [];
      setAllBlogs(data);

      // Apply filters
      let filteredData = data;
      if (categoryFilter !== "ALL") {
        filteredData = filteredData.filter(
          (blog: Blog) => blog.category === categoryFilter
        );
      }
      if (searchTerm.trim()) {
        filteredData = filteredData.filter(
          (blog: Blog) =>
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.tags?.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setBlogs(paginatedData);
      setPagination({
        total: filteredData.length,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
      });
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error fetching pending blogs:", error);
        toast.error("Failed to load pending blogs");
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, categoryFilter, searchTerm]);

  useEffect(() => {
    fetchPendingBlogs();
  }, [fetchPendingBlogs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, itemsPerPage]);

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

  // Get unique categories from all blogs
  const categories = Array.from(
    new Set((allBlogs || []).map((blog) => blog.category))
  );

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
      <PageBreadcrumb pageTitle="Pending Blog Approvals" />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Pending Review
              </p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {allBlogs.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineNewspaper className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Categories
              </p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {categories.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineUser className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Authors
              </p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {Array.from(new Set(allBlogs.map((b) => b.author.id))).length}
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
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Pending Approvals
            </h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Review and approve blog posts submitted by students
            </p>
          </div>
          <button
            onClick={fetchPendingBlogs}
            className="h-9 inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <HiOutlineRefresh className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, category, or tags... (Press Enter to search)"
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
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 sm:h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.replace(/_/g, " ")}
                </option>
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
                  <TableCell isHeader className="w-[35%] px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Blog Post
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Student Info
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Submitted
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
                {blogs.map((blog) => (
                  <TableRow
                    key={blog.id}
                    className="group border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/2"
                  >
                    <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <div className="flex items-start gap-2">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                          {blog.mainImage ? (
                            <img
                              src={getFullImageUrl(blog.mainImage, "general")}
                              alt={blog.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <HiOutlineNewspaper className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">
                            {blog.title}
                          </p>
                          <div className="flex items-center gap-1 flex-wrap">
                            {blog.readTime && (
                              <span className="flex items-center gap-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                                <HiOutlineClock className="h-3 w-3" />
                                {blog.readTime}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <div className="flex items-center gap-2">
                        {blog.author?.avatar ? (
                          <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <img
                              src={getFullImageUrl(blog.author.avatar, "avatar")}
                              alt={blog.author.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-6 w-6 shrink-0 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                            <HiOutlineUser className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                            {blog.author?.name}
                          </p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                            {blog.author?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <span
                        className={`inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded ${getCategoryBadgeClass(
                          blog.category
                        )}`}
                      >
                        {blog.category.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <div className="flex items-center gap-1">
                        <HiOutlineCalendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(blog.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openViewModal(blog)}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                          title="View details"
                        >
                          <HiOutlineEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleApproveBlog(blog.id)}
                          disabled={isSubmitting}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-success-600 transition-colors hover:bg-success-100 disabled:opacity-50 dark:text-success-500 dark:hover:bg-success-500/10"
                          title="Approve"
                        >
                          <HiOutlineCheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openRejectModal(blog)}
                          disabled={isSubmitting}
                          className="inline-flex items-center justify-center rounded-lg p-1.5 text-error-600 transition-colors hover:bg-error-100 disabled:opacity-50 dark:text-error-500 dark:hover:bg-error-500/10"
                          title="Reject"
                        >
                          <HiOutlineXCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {blogs.length === 0 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <HiOutlineCheckCircle className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">
                  No pending blogs
                </p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  All blogs have been reviewed
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200 px-3 sm:px-4 py-3 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Show
              </span>
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
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Previous page"
              >
                <span className="text-xs">‹</span>
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
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
                      className={`flex h-7 w-7 items-center justify-center rounded-md border text-xs transition-colors ${
                        pagination.page === page
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                }
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

      {/* View Modal */}
      {showViewModal && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-white/5 dark:bg-gray-900">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Blog Preview
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {selectedBlog.mainImage && (
                <div className="mb-6 overflow-hidden rounded-lg">
                  <img
                    src={getFullImageUrl(selectedBlog.mainImage, "general")}
                    alt={selectedBlog.title}
                    className="h-64 w-full object-cover"
                  />
                </div>
              )}

              <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                {selectedBlog.title}
              </h1>

              <div className="mb-6 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <HiOutlineUser className="h-4 w-4" />
                  {selectedBlog.author?.name}
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineCalendar className="h-4 w-4" />
                  {formatDate(selectedBlog.createdAt)}
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${getCategoryBadgeClass(
                    selectedBlog.category
                  )}`}
                >
                  {selectedBlog.category.replace(/_/g, " ")}
                </span>
              </div>

              {selectedBlog.metadata && (
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  {selectedBlog.metadata}
                </p>
              )}

              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {selectedBlog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-400"
                    >
                      <HiOutlineTag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
              />

              <div className="mt-8 flex gap-3 border-t border-gray-200 pt-6 dark:border-white/5">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    handleApproveBlog(selectedBlog.id);
                  }}
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-success-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-success-700 disabled:opacity-50"
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
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-error-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-700 disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl dark:bg-gray-900">
            <div className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-100 dark:bg-error-500/15">
                  <HiOutlineXCircle className="h-6 w-6 text-error-600 dark:text-error-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Reject Blog
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                    {selectedBlog.title}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reason for rejection{" "}
                  <span className="text-error-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  placeholder="Explain why this blog is being rejected..."
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
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
