"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import { toast } from "@/components/ui/toast";
import {
  HiOutlineBell,
  HiOutlineCheckCircle,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineEye,
  HiOutlineLink,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineSpeakerphone,
  HiOutlineTrash,
  HiOutlineX,
  HiOutlineXCircle,
} from "react-icons/hi";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

interface Notice {
  id: string;
  title?: string | null;
  message: string;
  linkUrl?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface NoticeFormData {
  title: string;
  message: string;
  linkUrl: string;
  isActive: boolean;
  sortOrder: number;
}

const defaultFormData: NoticeFormData = {
  title: "",
  message: "",
  linkUrl: "",
  isActive: true,
  sortOrder: 0,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "HIDDEN">("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);

  const [formData, setFormData] = useState<NoticeFormData>(defaultFormData);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Notice Management - HackToLive Academy";
  }, []);

  const fetchNotices = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/admin/notices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: fetchControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notices");
      }

      const data = await response.json();
      setNotices(Array.isArray(data) ? data : []);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast.error("Failed to load notices", {
          description: "Please try again",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchNotices();
  }, [fetchNotices]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const filteredNotices = notices.filter((notice) => {
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
          ? notice.isActive
          : !notice.isActive;

    const needle = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !needle ||
      (notice.title || "").toLowerCase().includes(needle) ||
      notice.message.toLowerCase().includes(needle) ||
      (notice.linkUrl || "").toLowerCase().includes(needle);

    return matchesStatus && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: notices.length,
    active: notices.filter((n) => n.isActive).length,
    hidden: notices.filter((n) => !n.isActive).length,
  };

  const openCreateModal = () => {
    setSelectedNotice(null);
    setFormData(defaultFormData);
    setShowFormModal(true);
  };

  const openEditModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title || "",
      message: notice.message,
      linkUrl: notice.linkUrl || "",
      isActive: notice.isActive,
      sortOrder: notice.sortOrder,
    });
    setShowFormModal(true);
  };

  const openPreviewModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setShowPreviewModal(true);
  };

  const openDeleteModal = (notice: Notice) => {
    setNoticeToDelete(notice);
    setShowDeleteModal(true);
  };

  const handleSaveNotice = async () => {
    const message = formData.message.trim();
    if (!message) {
      toast.warning("Notice message is required");
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem("token");
      const isEditing = Boolean(selectedNotice);

      const response = await fetch(
        isEditing
          ? `${API_URL}/admin/notices/${selectedNotice?.id}`
          : `${API_URL}/admin/notices`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title.trim(),
            message,
            linkUrl: formData.linkUrl.trim(),
            isActive: formData.isActive,
            sortOrder: Number(formData.sortOrder) || 0,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save notice");
      }

      toast.success(isEditing ? "Notice updated successfully" : "Notice created successfully");
      setShowFormModal(false);
      await fetchNotices();
    } catch {
      toast.error("Failed to save notice", {
        description: "Please try again",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNotice = async () => {
    if (!noticeToDelete) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/notices/${noticeToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete notice");
      }

      toast.success("Notice deleted successfully");
      setShowDeleteModal(false);
      setNoticeToDelete(null);
      await fetchNotices();
    } catch {
      toast.error("Failed to delete notice", {
        description: "Please try again",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleNotice = async (notice: Notice) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/notices/${notice.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !notice.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success(`Notice ${notice.isActive ? "hidden" : "activated"} successfully`);
      await fetchNotices();
    } catch {
      toast.error("Failed to update notice status");
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading && notices.length === 0) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Notice Management" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Notice Management" />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineSpeakerphone className="h-5 w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Notices</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-5 w-5 text-success-500 dark:text-success-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-error-100 dark:bg-error-500/15">
              <HiOutlineXCircle className="h-5 w-5 text-error-500 dark:text-error-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hidden</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.hidden}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Homepage Notice List</h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Manage the scrolling notice banner shown below the marketing navbar
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void fetchNotices()}
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <HiOutlineRefresh className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <Button size="sm" startIcon={<HiOutlinePlus className="h-4 w-4" />} onClick={openCreateModal}>
                Add Notice
              </Button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search title, message or URL... (Enter to search)"
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "HIDDEN")}
              className="h-9 sm:h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  <TableCell isHeader className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Notice
                  </TableCell>
                  <TableCell isHeader className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Order
                  </TableCell>
                  <TableCell isHeader className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                    Updated
                  </TableCell>
                  <TableCell isHeader className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedNotices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="px-4 py-10 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <HiOutlineBell className="mb-3 h-12 w-12 text-gray-400 dark:text-gray-600" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">No notices found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedNotices.map((notice) => (
                    <TableRow key={notice.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/2">
                      <TableCell className="px-4 py-3 align-top">
                        <div className="space-y-1.5">
                          <div className="flex items-start gap-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {notice.title || "Untitled notice"}
                            </p>
                          </div>
                          <p className="max-w-2xl text-xs text-gray-600 line-clamp-2 dark:text-gray-300">
                            {notice.message}
                          </p>
                          {notice.linkUrl ? (
                            <div className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400">
                              <HiOutlineLink className="h-3.5 w-3.5" />
                              <span className="line-clamp-1">{notice.linkUrl}</span>
                            </div>
                          ) : null}
                        </div>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-md bg-gray-100 px-2 text-xs font-semibold text-gray-700 dark:bg-white/5 dark:text-gray-300">
                          {notice.sortOrder}
                        </span>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <Badge variant="light" color={notice.isActive ? "success" : "light"} size="sm">
                          {notice.isActive ? "Active" : "Hidden"}
                        </Badge>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{formatDate(notice.updatedAt)}</span>
                      </TableCell>

                      <TableCell className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openPreviewModal(notice)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-white/5 dark:hover:text-brand-400"
                            title="Preview"
                          >
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(notice)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-white/5 dark:hover:text-blue-400"
                            title="Edit"
                          >
                            <HiOutlinePencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => void handleToggleNotice(notice)}
                            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-success-600 dark:hover:bg-white/5 dark:hover:text-success-400"
                            title={notice.isActive ? "Hide" : "Show"}
                          >
                            {notice.isActive ? <HiOutlineXCircle className="h-4 w-4" /> : <HiOutlineCheckCircle className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => openDeleteModal(notice)}
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
        </div>

        {filteredNotices.length > 0 && (
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
              </select>
              <span className="text-xs text-gray-500 dark:text-gray-400">of {filteredNotices.length} results</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={safePage === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="First page"
              >
                <HiOutlineChevronDoubleLeft className="h-3 w-3" />
              </button>

              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Previous page"
              >
                <HiOutlineChevronLeft className="h-3 w-3" />
              </button>

              <span className="px-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                {safePage} / {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Next page"
              >
                <HiOutlineChevronRight className="h-3 w-3" />
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={safePage === totalPages}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                title="Last page"
              >
                <HiOutlineChevronDoubleRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showFormModal && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedNotice ? "Edit Notice" : "Create Notice"}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 pb-6 pt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Title (optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Breaking / Update / Maintenance"
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Write the ticker message"
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Link URL (optional)</label>
                <input
                  type="text"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, linkUrl: e.target.value }))}
                  placeholder="https://example.com/details"
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: Number(e.target.value) || 0 }))}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">Visibility</label>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))}
                    className={`h-10 w-full rounded-lg border px-3 text-sm font-medium transition-colors ${
                      formData.isActive
                        ? "border-success-300 bg-success-50 text-success-700 dark:border-success-500/30 dark:bg-success-500/15 dark:text-success-300"
                        : "border-gray-300 bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {formData.isActive ? "Visible on homepage" : "Hidden from homepage"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
              <Button variant="outline" onClick={() => setShowFormModal(false)}>Cancel</Button>
              <Button onClick={() => void handleSaveNotice()} disabled={isSaving}>
                {isSaving ? "Saving..." : selectedNotice ? "Update Notice" : "Create Notice"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && selectedNotice && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="sticky top-0 bg-white dark:bg-gray-900 px-6 py-5 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notice Preview</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 dark:border-blue-500/30">
                <div className="flex items-center gap-3 px-4 py-3 text-white">
                  <span className="rounded-md bg-amber-300 px-2 py-1 text-xs font-bold uppercase tracking-wide text-black">
                    Latest Notice
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm">
                    <HiOutlineBell className="h-4 w-4 text-amber-300" />
                    <span className="font-semibold">
                      {selectedNotice.title ? `${selectedNotice.title}: ` : ""}
                      {selectedNotice.message}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && noticeToDelete && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
                <HiOutlineTrash className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="mb-2 text-center text-lg font-semibold text-gray-900 dark:text-white">Delete Notice</h3>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete
                <span className="font-semibold text-gray-700 dark:text-gray-200"> {noticeToDelete.title || "this notice"}</span>
                ? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => void handleDeleteNotice()}
                disabled={isDeleting}
                className="bg-error-500 hover:bg-error-600 disabled:bg-error-300"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
