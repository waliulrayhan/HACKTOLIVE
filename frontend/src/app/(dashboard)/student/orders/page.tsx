"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/shared/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import {
  HiOutlineShoppingBag,
  HiOutlineEye,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineTruck,
} from "react-icons/hi";

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Order History - HACKTOLIVE Academy";
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data.data || data);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
        <PageBreadcrumb pageTitle="Order History" />
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageBreadcrumb pageTitle="Order History" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Order History</h1>
            <p className="text-muted-foreground mt-1">
              View and track all your orders
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <HiOutlineShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No orders yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => router.push("/shopping")}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Order Number
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Items
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <tr
                        key={order.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-mono text-sm text-foreground">
                            {order.orderNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-foreground">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-foreground">
                            ৳{order.total.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge color={getStatusColor(order.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge color={order.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                            {order.paymentStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => router.push(`/student/orders/${order.orderNumber}`)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
