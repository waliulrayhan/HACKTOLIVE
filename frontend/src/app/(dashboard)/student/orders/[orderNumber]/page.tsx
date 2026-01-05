"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
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
    document.title = "Order Details - HACKTOLIVE Academy";
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
      <div className="min-h-screen bg-background">
        <PageBreadcrumb pageTitle="Order Details" />
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <PageBreadcrumb pageTitle="Order Details" />
        <div className="p-6">
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Order not found
            </h3>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => router.push("/student/orders")}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="min-h-screen bg-background">
      <PageBreadcrumb pageTitle={`Order ${order.orderNumber}`} />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Order Details
              </h1>
              <p className="text-muted-foreground">
                Order placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-2">Order Number</div>
              <div className="font-mono text-lg font-semibold text-foreground">
                {order.orderNumber}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Badge color={getStatusColor(order.status)}>
              <StatusIcon className="w-4 h-4 mr-1" />
              {order.status}
            </Badge>
            <Badge color={order.paymentStatus === 'PAID' ? 'success' : 'warning'}>
              {order.paymentStatus}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">Order Items</h2>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground text-xs text-center">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.productName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Qty: {item.quantity}</span>
                        <span>৳{item.price.toLocaleString()} each</span>
                      </div>
                      {item.voucherCode && (
                        <div className="mt-2">
                          <Badge color="info">
                            Voucher: {item.voucherCode}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">
                        ৳{item.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <HiOutlineLocationMarker className="w-5 h-5" />
                  Shipping Address
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-2 text-foreground">
                  <div className="flex items-center gap-2">
                    <HiOutlineUser className="w-4 h-4 text-muted-foreground" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlineMail className="w-4 h-4 text-muted-foreground" />
                    <span>{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiOutlinePhone className="w-4 h-4 text-muted-foreground" />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-foreground">{order.shippingAddress}</p>
                    <p className="text-muted-foreground">
                      {order.shippingCity}, {order.shippingZip}
                    </p>
                    <p className="text-muted-foreground">{order.shippingCountry}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">Order Summary</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>৳{order.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax</span>
                  <span>৳{order.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Shipping</span>
                  <span>{order.shippingCost === 0 ? 'FREE' : `৳${order.shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>৳{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <HiOutlineCreditCard className="w-5 h-5" />
                  Payment Information
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Payment Method</div>
                  <div className="text-foreground font-medium">
                    {order.paymentMethod.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Payment Status</div>
                  <Badge color={order.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                    {order.paymentStatus}
                  </Badge>
                </div>
                {order.trackingNumber && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Tracking Number</div>
                    <div className="text-foreground font-mono text-sm">
                      {order.trackingNumber}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            {order.completedAt && (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">Order Timeline</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                      <HiOutlineCheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Order Placed</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {order.completedAt && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-success-500 flex items-center justify-center shrink-0">
                        <HiOutlineCheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Completed</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.completedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {order.notes && (
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-xl font-semibold text-foreground">Order Notes</h2>
                </div>
                <div className="p-6">
                  <p className="text-foreground">{order.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
