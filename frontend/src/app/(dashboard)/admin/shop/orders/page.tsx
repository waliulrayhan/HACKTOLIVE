"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "@/components/ui/toast";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import {
  HiOutlineEye,
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineShoppingBag,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineTruck,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCurrencyDollar,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineExclamationCircle,
  HiOutlineXCircle,
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
import { orderService, Order } from '@/lib/shop-service';

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('ALL');
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
  const [statusUpdate, setStatusUpdate] = useState<{
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
    trackingNumber: string
    notes: string
  }>({
    status: 'PENDING',
    trackingNumber: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.title = "Order Management - HACKTOLIVE Academy";
  }, []);

  const fetchOrders = useCallback(async () => {
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }

    fetchControllerRef.current = new AbortController();

    try {
      setLoading(true);
      const response = await orderService.getAllOrders({ limit: 1000 });
      const data = response.data || [];
      setAllOrders(data);

      // Apply filters
      let filteredData = data;
      if (statusFilter !== 'ALL') {
        filteredData = filteredData.filter((order: Order) => order.status === statusFilter);
      }
      if (paymentStatusFilter !== 'ALL') {
        filteredData = filteredData.filter((order: Order) => order.paymentStatus === paymentStatusFilter);
      }
      if (searchTerm.trim()) {
        filteredData = filteredData.filter((order: Order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
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
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders', { description: 'Please try again' });
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, paymentStatusFilter, searchTerm, itemsPerPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentStatusFilter, itemsPerPage]);

  const handleViewOrder = async (orderId: string) => {
    try {
      const order = await orderService.getOrderById(orderId);
      setSelectedOrder(order);
      setStatusUpdate({
        status: order.status as any,
        trackingNumber: order.trackingNumber || '',
        notes: order.notes || '',
      });
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to fetch order details', { description: 'Please try again' });
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setIsSubmitting(true);
      await orderService.updateOrderStatus(selectedOrder.id, {
        status: statusUpdate.status,
        trackingNumber: statusUpdate.trackingNumber || undefined,
        notes: statusUpdate.notes || undefined,
      });
      toast.success('Order status updated successfully!');
      setShowModal(false);
      fetchOrders();
    } catch (error: any) {
      toast.error('Failed to update order status', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'PROCESSING': return 'info';
      case 'SHIPPED': return 'warning';
      case 'DELIVERED': return 'success';
      case 'CANCELLED':
      case 'REFUNDED': return 'error';
      default: return 'light';
    }
  };

  const getPaymentStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING':
      case 'PROCESSING': return 'warning';
      case 'FAILED':
      case 'REFUNDED': return 'error';
      default: return 'light';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  const totalRevenue = allOrders
    .filter(o => o.paymentStatus === 'COMPLETED')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Order Management" />

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
                {allOrders.length}
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
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {allOrders.filter(o => o.status === 'PENDING').length}
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
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                {allOrders.filter(o => o.status === 'DELIVERED').length}
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
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Revenue</p>
              <p className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                ৳{totalRevenue.toLocaleString()}
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
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Orders</h2>
            <p className="mt-0.5 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              View and manage all customer orders
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
                placeholder="Search by order number, customer name, or email... (Press Enter)"
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
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="h-9 sm:h-10 rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="ALL">All Payment</option>
              <option value="PENDING">Payment Pending</option>
              <option value="COMPLETED">Paid</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>
        </div>

        {/* Table */}
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
                      Customer
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
                      Payment
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Status
                    </span>
                  </TableCell>
                  <TableCell isHeader className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      Date
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
                {orders.map((order) => (
                  <TableRow key={order.id} className="group border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-white/5 dark:hover:bg-white/2">
                    <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <span className="text-xs font-semibold text-brand-600 dark:text-brand-500">
                        {order.orderNumber}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {order.customerName}
                        </p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {order.customerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <span className="text-xs text-gray-900 dark:text-white">
                        {order.items?.length || 0}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <span className="text-xs font-semibold text-gray-900 dark:text-white">
                        ৳{order.total.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <Badge color={getPaymentStatusBadgeColor(order.paymentStatus)} variant="light">
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                      <Badge color={getStatusBadgeColor(order.status)} variant="light">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-3 py-2.5 sm:px-4 sm:py-3">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                          title="View order"
                        >
                          <HiOutlineEye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {orders.length === 0 && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <HiOutlineShoppingBag className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">No orders found</p>
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
                className="h-7 rounded-md border border-gray-300 bg-white px-2 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:bg-black/60 dark:backdrop-blur-md">
          <div className="relative bg-white dark:bg-gray-900 dark:ring-1 dark:ring-white/10 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                  <HiOutlineShoppingBag className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
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
                <Badge color={getStatusBadgeColor(selectedOrder.status)} variant="light">
                  {selectedOrder.status}
                </Badge>
                <Badge color={getPaymentStatusBadgeColor(selectedOrder.paymentStatus)} variant="light">
                  {selectedOrder.paymentStatus}
                </Badge>
                <span className="ml-auto text-lg font-bold text-brand-600 dark:text-brand-400">
                  ৳{selectedOrder.total.toLocaleString()}
                </span>
              </div>

              <div className="space-y-5 pt-5">
                {/* Customer & Shipping Section */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Customer & Shipping Details
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15 shrink-0">
                        <svg className="h-4 w-4 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Customer</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedOrder.customerName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{selectedOrder.customerEmail}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{selectedOrder.customerPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15 shrink-0">
                        <HiOutlineTruck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Shipping Address</p>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {selectedOrder.shippingAddress}<br />
                          {selectedOrder.shippingCity}, {selectedOrder.shippingZip}
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
                            {item.selectedOptions && (
                              <span className="rounded bg-gray-200 dark:bg-gray-700 px-2 py-0.5">
                                {JSON.stringify(item.selectedOptions)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">৳{item.total.toLocaleString()}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">৳{(item.total / item.quantity).toLocaleString()} each</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">৳{selectedOrder.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                        <span className="font-medium text-gray-900 dark:text-white">৳{selectedOrder.shippingCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tax</span>
                        <span className="font-medium text-gray-900 dark:text-white">৳{selectedOrder.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                        <span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                        <span className="text-lg font-bold text-brand-600 dark:text-brand-400">৳{selectedOrder.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Update Status Section */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                    Update Order Status
                  </h4>
                  <form onSubmit={handleUpdateStatus} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Order Status
                        </label>
                        <select
                          value={statusUpdate.status}
                          onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value as any })}
                          className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                          disabled={isSubmitting}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                          <option value="REFUNDED">Refunded</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tracking Number
                        </label>
                        <input
                          type="text"
                          value={statusUpdate.trackingNumber}
                          onChange={(e) => setStatusUpdate({ ...statusUpdate, trackingNumber: e.target.value })}
                          className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                          placeholder="Enter tracking number"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Internal Notes
                      </label>
                      <textarea
                        value={statusUpdate.notes}
                        onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        placeholder="Add internal notes about this order..."
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        disabled={isSubmitting}
                        className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="h-10 inline-flex items-center justify-center gap-2 font-medium rounded-lg transition px-5 text-sm bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </>
                        ) : (
                          'Update Status'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
