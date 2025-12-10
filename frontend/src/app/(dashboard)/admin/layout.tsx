"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "../_components/AppHeader";
import AppSidebar from "../_components/AppSidebar";
import Backdrop from "../_components/Backdrop";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GridIcon, UserCircleIcon } from "@/icons/index";
import { FaUsers, FaChartLine, FaBook, FaCheckCircle, FaCog, FaShieldAlt } from "react-icons/fa";

const adminNavItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    icon: <FaUsers className="w-5 h-5" />,
    name: "User Management",
    path: "/admin/users",
  },
  {
    icon: <FaCheckCircle className="w-5 h-5" />,
    name: "Course Approval",
    path: "/admin/courses",
  },
  {
    icon: <FaBook className="w-5 h-5" />,
    name: "All Courses",
    path: "/admin/all-courses",
  },
  {
    icon: <FaChartLine className="w-5 h-5" />,
    name: "System Analytics",
    path: "/admin/analytics",
  },
  {
    icon: <FaShieldAlt className="w-5 h-5" />,
    name: "Security",
    path: "/admin/security",
  },
  {
    icon: <FaCog className="w-5 h-5" />,
    name: "Settings",
    path: "/admin/settings",
  },
  {
    icon: <UserCircleIcon />,
    name: "Profile",
    path: "/admin/profile",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar navItems={adminNavItems} othersItems={[]} />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
