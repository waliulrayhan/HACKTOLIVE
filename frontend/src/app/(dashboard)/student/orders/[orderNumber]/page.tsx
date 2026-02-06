"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import { TablePageLoadingSkeleton } from "@/components/ui/skeleton/Skeleton";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { getFullImageUrl } from '@/lib/image-utils';
import {
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineTruck,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineCreditCard,
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";

interface OrderItem {
  id: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  price: number;
  total: number;
  voucherCode: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingCountry: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  trackingNumber: string | null;
  notes: string | null;
  items: OrderItem[];
}

export default function OrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Order Details - HackToLive Academy";
  }, []);

  useEffect(() => {
    fetchOrder();
  }, [resolvedParams.orderNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop/orders/number/${resolvedParams.orderNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch order");

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
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

  type BadgeColor = "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

  if (loading) {
    return (
      <div className="space-y-4">
        <PageBreadcrumb pageTitle="Order Details" />
        <TablePageLoadingSkeleton />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <PageBreadcrumb pageTitle="Order Details" />
        <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/15">
              <HiOutlineXCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Order not found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button
              onClick={() => router.push("/student/orders")}
              variant="primary"
              className="mt-4"
            >
              <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle={`Order ${order.orderNumber}`} />

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
      >
        <HiOutlineArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Back to Orders
      </button>

      {/* Header Card */}
      <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15 shrink-0">
                <HiOutlineShoppingBag className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Order Details
                </h1>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <HiOutlineCalendar className="h-4 w-4" />
                  <span>
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:items-end gap-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">Order Number</div>
              <div className="font-mono text-base sm:text-lg font-bold text-brand-600 dark:text-brand-500">
                {order.orderNumber}
              </div>
            </div>
          </div>

          {/* <div className="mt-4 flex flex-wrap gap-2">
            <Badge color={getStatusColor(order.status)}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {order.status}
            </Badge>
            <Badge color={order.paymentStatus === 'PAID' || order.paymentStatus === 'COMPLETED' ? 'success' : 'warning'}>
              <HiOutlineCreditCard className="w-3 h-3 mr-1" />
              {order.paymentStatus}
            </Badge>
          </div> */}

          {/* <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
            <Button
              onClick={() => router.push("/student/orders")}
              variant="outline"
              size="sm"
            >
              <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </div> */}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Items */}
          <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Order Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-white/5">
              {order.items.map((item, index) => (
                <div key={item.id} className="p-3 sm:p-4">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {item.productImage ? (
                        <Image
                          src={getFullImageUrl(item.productImage, 'general')}
                          alt={item.productName}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <HiOutlineShoppingBag className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                          {item.productName}
                        </h3>
                        <div className="text-sm sm:text-base font-bold text-gray-900 dark:text-white whitespace-nowrap">
                          {item.total.toLocaleString()} BDT
                        </div>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>{item.price.toLocaleString()} BDT each</span>
                      </div>
                      {item.voucherCode && (
                        <div className="mt-2">
                          <Badge color="info" variant="light">
                            Voucher: {item.voucherCode}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <HiOutlineLocationMarker className="w-5 h-5 text-brand-600 dark:text-brand-500" />
                Shipping Address
              </h2>
            </div>
            <div className="p-3 sm:p-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-500/15 shrink-0">
                    <HiOutlineUser className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Customer Name</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/15 shrink-0">
                    <HiOutlineMail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
                    <p className="text-sm text-gray-900 dark:text-white break-all">{order.customerEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/15 shrink-0">
                    <HiOutlinePhone className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                    <p className="text-sm text-gray-900 dark:text-white">{order.customerPhone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-gray-200 dark:border-white/5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/15 shrink-0">
                    <HiOutlineLocationMarker className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Delivery Address</p>
                    <p className="text-sm text-gray-900 dark:text-white">{order.shippingAddress}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.shippingCity}, {order.shippingZip}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{order.shippingCountry}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <HiOutlineCurrencyDollar className="w-5 h-5 text-brand-600 dark:text-brand-500" />
                Order Summary
              </h2>
            </div>
            <div className="p-3 sm:p-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">{order.subtotal.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Tax</span>
                <span className="font-medium text-gray-900 dark:text-white">{order.tax.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {order.shippingCost === 0 ? 'FREE' : `${order.shippingCost.toLocaleString()} BDT`}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-white/5">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-lg font-bold text-brand-600 dark:text-brand-500">
                    {order.total.toLocaleString()} BDT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
            <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <HiOutlineCreditCard className="w-5 h-5 text-brand-600 dark:text-brand-500" />
                Payment
              </h2>
            </div>
            <div className="p-3 sm:p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery (COD)' : 'Online Payment'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Status</p>
                <div>
                  <Badge color={order.paymentStatus === 'PAID' || order.paymentStatus === 'COMPLETED' ? 'success' : 'warning'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
              {order.transactionId && order.paymentMethod !== 'CASH_ON_DELIVERY' && (
                <div className="pt-3 border-t border-gray-200 dark:border-white/5">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Transaction ID</p>
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
                    <div className="flex items-center gap-2">
                      <HiOutlineCreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                      <p className="text-sm font-mono font-semibold text-purple-700 dark:text-purple-400 break-all">
                        {order.transactionId}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {order.trackingNumber && (
                <div className="pt-3 border-t border-gray-200 dark:border-white/5">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Tracking Number</p>
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                    <div className="flex items-center gap-2">
                      <HiOutlineTruck className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <p className="text-sm font-mono font-semibold text-blue-700 dark:text-blue-400 break-all">
                        {order.trackingNumber}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          {(order.createdAt || order.completedAt) && (
            <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
              <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Timeline</h2>
              </div>
              <div className="p-3 sm:p-4 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 dark:bg-brand-500 shrink-0">
                    <HiOutlineCheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Order Placed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {order.completedAt && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-500 dark:bg-success-500 shrink-0">
                      <HiOutlineCheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Completed</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(order.completedAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="rounded-md border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3">
              <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-white/5">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Order Notes</h2>
              </div>
              <div className="p-3 sm:p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
