"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineShoppingBag,
  HiOutlineEye,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTruck,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineCurrencyDollar,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
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

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  total: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingZip?: string;
  trackingNumber?: string;
  notes?: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
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
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Order History - HACKTOLIVE Academy";
  }, []);

  const fetchOrders = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: fetchControllerRef.current.signal,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      const orderData = data.data || data;
      setAllOrders(orderData);

      // Apply filters
      let filteredData = orderData;
      if (statusFilter !== 'ALL') {
        filteredData = filteredData.filter((order: Order) => order.status === statusFilter);
      }
      if (searchTerm.trim()) {
        filteredData = filteredData.filter((order: Order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setOrders(paginatedData);
      setPagination({
        total: filteredData.length,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(filteredData.length / itemsPerPage),
      });
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Error fetching orders:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusIcon = (status: string) => {
    const icons: any = {
      PENDING: HiOutlineClock,
      CONFIRMED: HiOutlineCheckCircle,
      PROCESSING: HiOutlineClock,
      SHIPPED: HiOutlineTruck,
      DELIVERED: HiOutlineCheckCircle,
      CANCELLED: HiOutlineXCircle,
      REFUNDED: HiOutlineXCircle,
    };
    return icons[status] || HiOutlineClock;
  };

  const getStatusColor = (status: string): BadgeColor => {
    const colors: Record<string, BadgeColor> = {
      PENDING: "warning",
      CONFIRMED: "info",
      PROCESSING: "info",
      SHIPPED: "info",
      DELIVERED: "success",
      CANCELLED: "error",
      REFUNDED: "warning",
    };
    return colors[status] || "light";
  };

  const getPaymentStatusColor = (status: string): BadgeColor => {
    const colors: Record<string, BadgeColor> = {
      PENDING: "warning",
      COMPLETED: "success",
      PAID: "success",
      FAILED: "error",
      REFUNDED: "warning",
    };
    return colors[status] || "light";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <PageBreadcrumb pageTitle="Order History" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  const totalOrders = allOrders.length;
  const pendingOrders = allOrders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
  const deliveredOrders = allOrders.filter(o => o.status === 'DELIVERED').length;
  const totalSpent = allOrders.filter(o => o.paymentStatus === 'PAID' || o.paymentStatus === 'COMPLETED').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Order History" />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
              <HiOutlineShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-brand-500 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Orders</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {totalOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-500/15">
              <HiOutlineClock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Processing</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {pendingOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success-100 dark:bg-success-500/15">
              <HiOutlineCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-success-600 dark:text-success-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Delivered</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {deliveredOrders}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15">
              <HiOutlineCurrencyDollar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                ৳{totalSpent.toLocaleString()}
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
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">My Orders</h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              Track and manage all your orders
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <div className="relative flex-1">
              <HiOutlineSearch className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number... (Press Enter)"
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
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {orders.length === 0 ? (
          <div className="py-12">
            <div className="flex flex-col items-center gap-2">
              <HiOutlineShoppingBag className="h-12 w-12 text-gray-400" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {searchTerm || statusFilter !== 'ALL' ? 'No orders found' : 'No orders yet'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'Try adjusting your filters' 
                  : 'Start shopping to see your orders here'}
              </p>
              {!searchTerm && statusFilter === 'ALL' && (
                <Button
                  onClick={() => router.push('/shopping')}
                  variant="primary"
                  className="mt-4"
                >
                  Browse Products
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/5">
                    <TableRow>
                      <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                          Order #
                        </span>
                      </TableCell>
                      <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                          Date
                        </span>
                      </TableCell>
                      <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                          Items
                        </span>
                      </TableCell>
                      <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                          Total
                        </span>
                      </TableCell>
                      <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                          Status
                        </span>
                      </TableCell>
                      <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                        <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                          Payment
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
                    {orders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <TableRow key={order.id} className="group border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/2">
                          <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                            <span className="text-xs font-semibold text-brand-600 dark:text-brand-500">
                              {order.orderNumber}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                            <span className="text-xs text-gray-900 dark:text-white">
                              {order.items.length}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">
                              ৳{order.total.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                            <div className="flex justify-center">
                              <Badge color={getStatusColor(order.status)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {order.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                            <div className="flex justify-center">
                              <Badge color={getPaymentStatusColor(order.paymentStatus)}>
                                {order.paymentStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                            <div className="flex justify-center gap-2">
                              <Button
                                onClick={() => handleViewOrder(order)}
                                variant="outline"
                                size="sm"
                                className="h-7! px-2.5! text-[10px]! sm:h-8! sm:px-3! sm:text-xs!"
                              >
                                <HiOutlineEye className="h-3 w-3" />
                              </Button>
                              <Button
                                onClick={() => router.push(`/student/orders/${order.orderNumber}`)}
                                variant="primary"
                                size="sm"
                                className="h-7! px-2.5! text-[10px]! sm:h-8! sm:px-3! sm:text-xs!"
                              >
                                Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col gap-3 border-t border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <label htmlFor="itemsPerPage" className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                    Show:
                  </label>
                  <select
                    id="itemsPerPage"
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
                    <HiOutlineChevronDoubleLeft className="h-3 w-3" />
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={pagination.page === 1}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                    title="Previous page"
                  >
                    <HiOutlineChevronLeft className="h-3 w-3" />
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
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page === pagination.totalPages}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                    title="Next page"
                  >
                    <HiOutlineChevronRight className="h-3 w-3" />
                  </button>
                  
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
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                  <HiOutlineShoppingBag className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Details
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedOrder.orderNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <HiOutlineX className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2 pb-5 border-b border-gray-200 dark:border-gray-800">
                <Badge color={getStatusColor(selectedOrder.status)} variant="light">
                  <span className="flex items-center gap-1">
                    {React.createElement(getStatusIcon(selectedOrder.status), { className: "w-3 h-3" })}
                    {selectedOrder.status}
                  </span>
                </Badge>
                <Badge color={getPaymentStatusColor(selectedOrder.paymentStatus)} variant="light">
                  {selectedOrder.paymentStatus}
                </Badge>
                <span className="ml-auto text-lg font-bold text-brand-600 dark:text-brand-400">
                  ৳{selectedOrder.total.toLocaleString()}
                </span>
              </div>

              <div className="space-y-5 pt-5">
                {/* Order Info */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Order Information
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15 shrink-0">
                        <HiOutlineShoppingBag className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Order Number</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{selectedOrder.orderNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15 shrink-0">
                        <HiOutlineClock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Order Date</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items Section */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Order Items ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shrink-0">
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.productName}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span>৳{item.price.toLocaleString()} each</span>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Info */}
                {selectedOrder.trackingNumber && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                    <div className="flex items-start gap-3">
                      <HiOutlineTruck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Tracking Number</p>
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{selectedOrder.trackingNumber}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedOrder.notes && (
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</p>
                    <p className="text-sm text-gray-900 dark:text-white">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                onClick={() => setShowModal(false)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
