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
    return <TablePageLoadingSkeleton />;
  }

  const totalRevenue = allOrders
    .filter(o => o.paymentStatus === 'COMPLETED')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <>
      <PageBreadcrumb pageTitle="Order Management" />

      <div className="mt-4 sm:mt-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Order Management
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            View and manage customer orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-4 sm:mb-6 grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-md border border-gray-200 bg-white p-3 sm:p-4 dark:border-white/5 dark:bg-white/3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15">
                <HiOutlineShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 dark:text-brand-500" />
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
            <div className="min-w-3xl">
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
            </div>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-3 py-3 dark:border-white/5 sm:px-4">
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="h-8 rounded-lg border border-gray-300 bg-white px-2 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total)} of {pagination.total}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <HiOutlineChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-gray-600 dark:text-gray-400 px-2">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <HiOutlineChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="p-6">
          <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            Order Details - {selectedOrder?.orderNumber}
          </h3>
          {selectedOrder && (
          <div className="space-y-6">
            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Customer Information</h3>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Name:</span> {selectedOrder.customerName}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Email:</span> {selectedOrder.customerEmail}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Phone:</span> {selectedOrder.customerPhone}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Shipping Address</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedOrder.shippingAddress}<br />
                  {selectedOrder.shippingCity}, {selectedOrder.shippingZip}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3">Order Items</h3>
              <div className="space-y-2">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{item.productName}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                      {item.selectedOptions && (
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {JSON.stringify(item.selectedOptions)}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      ৳{item.total.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">৳{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                  <span className="text-gray-900 dark:text-white">৳{selectedOrder.shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                  <span className="text-gray-900 dark:text-white">৳{selectedOrder.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-brand-600 dark:text-brand-500">৳{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Update Status Form */}
            <form onSubmit={handleUpdateStatus} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700 space-y-3">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white">Update Order Status</h3>
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Order Status
                  </label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value as any })}
                    className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
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
                  <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={statusUpdate.trackingNumber}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, trackingNumber: e.target.value })}
                    className="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Enter tracking number"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  value={statusUpdate.notes}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-900 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Add notes"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-200 pt-3 dark:border-gray-700">
                <Button
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Close
                </Button>
                <Button
                  disabled={isSubmitting}
                  className="bg-brand-500 text-white hover:bg-brand-600"
                >
                  {isSubmitting ? 'Updating...' : 'Update Status'}
                </Button>
              </div>
            </form>
          </div>
          )}
        </div>
      </Modal>
    </>
  );
}
