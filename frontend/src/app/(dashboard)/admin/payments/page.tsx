"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineCurrencyDollar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineRefresh,
  HiOutlineDownload,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineExclamationCircle,
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
import { Modal } from "@/components/ui/modal";

interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  bankTransactionId?: string;
  cardType?: string;
  cardIssuer?: string;
  course?: {
    id: string;
    title: string;
    slug: string;
  };
  product?: {
    id: string;
    name: string;
  };
  createdAt: string;
  validatedAt?: string;
  riskLevel: number;
  riskTitle?: string;
}

interface PaymentStats {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  validated: number;
  processing: number;
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Payment Management - HACKTOLIVE Academy";
  }, []);

  const fetchPayments = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (statusFilter && statusFilter !== "ALL") {
        params.append("status", statusFilter);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/admin/all?${params.toString()}`,
        {
          signal: fetchControllerRef.current.signal,
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch payments");

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPayments(data);
        setPagination({
          total: data.length,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: 1,
        });
      } else if (data.payments) {
        setPayments(data.payments);
        setPagination(data.pagination || {
          total: 0,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: 0,
        });
      } else {
        setPayments([]);
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payments", {
        description: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/admin/stats`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [fetchPayments, fetchStats]);

  const completePayment = async (paymentId: string) => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/admin/complete/${paymentId}`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to complete payment");

      toast.success("Payment completed successfully!");
      setShowViewModal(false);
      fetchPayments();
      fetchStats();
    } catch (error: any) {
      console.error("Error completing payment:", error);
      toast.error("Failed to complete payment", {
        description: "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const viewPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "VALIDATED":
        return "info";
      case "PENDING":
        return "warning";
      case "PROCESSING":
        return "light";
      case "FAILED":
      case "CANCELLED":
      case "REFUNDED":
        return "error";
      default:
        return "light";
    }
  };

  const getRiskBadgeColor = (riskLevel: number) => {
    switch (riskLevel) {
      case 0:
        return "success";
      case 1:
        return "warning";
      default:
        return "error";
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currency || "BDT",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportData = () => {
    const filteredPayments = payments.filter((payment) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        payment.transactionId.toLowerCase().includes(search) ||
        payment.customerEmail.toLowerCase().includes(search) ||
        payment.customerName.toLowerCase().includes(search) ||
        payment.course?.title.toLowerCase().includes(search)
      );
    });

    const headers = ["Transaction ID", "Customer", "Email", "Amount", "Status", "Date"];
    const rows = filteredPayments.map((p) => [
      p.transactionId,
      p.customerName,
      p.customerEmail,
      `${p.amount} ${p.currency}`,
      p.status,
      formatDate(p.createdAt),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("Payment data exported successfully!");
  };

  const filteredPayments = payments.filter((payment) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      payment.transactionId.toLowerCase().includes(search) ||
      payment.customerEmail.toLowerCase().includes(search) ||
      payment.customerName.toLowerCase().includes(search) ||
      payment.course?.title.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Payment Management" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Payment Management" />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
                <HiOutlineCurrencyDollar className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Revenue</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats.totalRevenue, "BDT")}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Completed</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning-100 dark:bg-warning-500/15">
                <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Pending</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                  {stats.pending + stats.processing + stats.validated}
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
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Failed</p>
                <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">{stats.failed}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Alert */}
      {stats && (stats.pending + stats.processing + stats.validated) > 0 && (
        <div className="rounded-md border border-warning-200 bg-warning-50 p-3 sm:p-4 dark:border-warning-500/20 dark:bg-warning-500/10">
          <div className="flex gap-2 sm:gap-3">
            <HiOutlineExclamationCircle className="h-4 w-4 sm:h-5 sm:w-5 text-warning-600 dark:text-warning-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-medium text-warning-900 dark:text-warning-200">
                Pending Payments
              </p>
              <p className="mt-0.5 text-[10px] sm:text-xs text-warning-700 dark:text-warning-300">
                You have {stats.pending + stats.processing + stats.validated} payments requiring attention.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Card */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        {/* Header */}
        <div className="flex flex-col gap-3 border-b border-gray-200 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">All Payments</h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Monitor and manage payment transactions
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                fetchPayments();
                fetchStats();
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <HiOutlineRefresh className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={exportData}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-brand-500 bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-600 hover:border-brand-600"
            >
              <HiOutlineDownload className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
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
                placeholder="Search by transaction ID, email, name, or course..."
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 sm:h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="VALIDATED">Validated</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[840px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/5">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Transaction ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Customer
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Course/Product
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Amount
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
                    Date
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 sm:px-4 py-2 text-left text-[10px] sm:text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Risk
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
                {filteredPayments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/2"
                  >
                    <TableCell className="px-3 sm:px-4 py-3">
                      <div className="font-mono text-[10px] sm:text-xs text-gray-900 dark:text-white">
                        {payment.transactionId.substring(0, 20)}...
                      </div>
                      {payment.bankTransactionId && (
                        <div className="mt-0.5 text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                          Bank: {payment.bankTransactionId.substring(0, 15)}...
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <HiOutlineUser className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                            {payment.customerName}
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                            {payment.customerEmail}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <div className="text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                        {payment.course?.title || payment.product?.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <Badge variant="light" color={getStatusBadgeColor(payment.status)} size="sm">
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <HiOutlineCalendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                        <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                          {formatDate(payment.createdAt)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <Badge variant="light" color={getRiskBadgeColor(payment.riskLevel)} size="sm">
                        {payment.riskLevel === 0 ? "Safe" : payment.riskLevel === 1 ? "Medium" : "High"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-3 sm:px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => viewPaymentDetails(payment)}
                          className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
                          title="View details"
                        >
                          <HiOutlineEye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                        {payment.status === "VALIDATED" && payment.riskLevel === 0 && (
                          <button
                            onClick={() => completePayment(payment.id)}
                            className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-success-50 hover:text-success-600 dark:text-gray-400 dark:hover:bg-success-500/15 dark:hover:text-success-500"
                            title="Complete payment"
                          >
                            <HiOutlineCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredPayments.length === 0 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <HiOutlineCurrencyDollar className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">No payments found</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
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
                className="h-8 rounded-lg border border-gray-300 bg-white px-2 text-xs text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">per page</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  title="First page"
                >
                  <HiOutlineChevronLeft className="h-3.5 w-3.5" />
                  <HiOutlineChevronLeft className="h-3.5 w-3.5 -ml-2" />
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  title="Previous page"
                >
                  <HiOutlineChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage >= pagination.totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  title="Next page"
                >
                  <HiOutlineChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setCurrentPage(pagination.totalPages)}
                  disabled={currentPage >= pagination.totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  title="Last page"
                >
                  <HiOutlineChevronRight className="h-3.5 w-3.5" />
                  <HiOutlineChevronRight className="h-3.5 w-3.5 -ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Details Modal */}
      {showViewModal && selectedPayment && (
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
            <p>Transaction: {selectedPayment.transactionId}</p>
          </div>
        </Modal>
      )}
    </div>
  );
}
