"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "./_components/AppHeader";
import AppSidebar from "./_components/AppSidebar";
import Backdrop from "./_components/Backdrop";
import React, { useMemo } from "react";
import {
  GridIcon,
  UserCircleIcon,
  FileIcon,
  PieChartIcon,
  CheckCircleIcon,
  BoxIconLine,
  GroupIcon,
  LockIcon,
  BoxIcon,
  TaskIcon,
  DocsIcon,
  VideoIcon,
  UserIcon,
} from "@/icons/index";
import { FiShoppingCart } from "react-icons/fi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user } = useAuth();

  // Dynamic sidebar items based on user role
  const { navItems, othersItems } = useMemo(() => {
    if (user?.role === "STUDENT") {
      return {
        navItems: [
          {
            icon: <GridIcon />,
            name: "Dashboard",
            path: "/student/dashboard",
          },
          {
            icon: <FileIcon />,
            name: "My Courses",
            subItems: [
              { icon: <VideoIcon />, name: "All Courses", path: "/student/courses" },
              { icon: <TaskIcon />, name: "Assignments", path: "/student/assignments" },
              { icon: <CheckCircleIcon />, name: "Certificates", path: "/student/certificates" },
            ],
          },
          {
            icon: <PieChartIcon />,
            name: "Progress",
            path: "/student/progress",
          },
          {
            icon: <BoxIconLine />,
            name: "Browse Courses",
            path: "/academy/courses",
          },
          {
            icon: <DocsIcon />,
            name: "Blogs",
            path: "/student/blogs",
          },
          {
            icon: <BoxIcon />,
            name: "Order History",
            path: "/student/orders",
          },
          {
            icon: <UserCircleIcon />,
            name: "Profile",
            path: "/student/profile",
          },
        ],
        othersItems: [],
      };
    } else if (user?.role === "ADMIN") {
      return {
        navItems: [
          {
            icon: <GridIcon />,
            name: "Dashboard",
            path: "/admin/dashboard",
          },
          {
            icon: <GroupIcon />,
            name: "User Management",
            subItems: [
              { icon: <GroupIcon />, name: "All Users", path: "/admin/users" },
              { icon: <UserIcon />, name: "Instructors", path: "/admin/instructors" },
            ],
          },
          {
            icon: <CheckCircleIcon />,
            name: "Course Approval",
            path: "/admin/courses",
          },
          {
            icon: <DocsIcon />,
            name: "Blogs",
            path: "/admin/blogs",
          },
          {
            icon: <FiShoppingCart className="w-5 h-5" />,
            name: "Shop",
            subItems: [
              { icon: <BoxIcon />, name: "Products", path: "/admin/shop/products" },
              { icon: <GridIcon />, name: "Categories", path: "/admin/shop/categories" },
              { icon: <BoxIconLine />, name: "Orders", path: "/admin/shop/orders" },
            ],
          },
          {
            icon: <BoxIcon />,
            name: "Career Center",
            subItems: [
              { icon: <FileIcon />, name: "Job Postings", path: "/admin/careers" },
              { icon: <DocsIcon />, name: "Applications", path: "/admin/applications" },
            ],
          },
          // {
          //   icon: <PieChartIcon />,
          //   name: "System Analytics",
          //   path: "/admin/analytics",
          // },
          {
            icon: <UserCircleIcon />,
            name: "Profile",
            path: "/admin/profile",
          },
        ],
        othersItems: [],
      };
    } else if (user?.role === "INSTRUCTOR") {
      return {
        navItems: [
          {
            icon: <GridIcon />,
            name: "Dashboard",
            path: "/instructor/dashboard",
          },
          {
            icon: <FileIcon />,
            name: "My Courses",
            subItems: [
              { icon: <VideoIcon />, name: "All Courses", path: "/instructor/courses" },
              { icon: <BoxIconLine />, name: "Create Course", path: "/instructor/courses/create" },
              { icon: <TaskIcon />, name: "Assignments", path: "/instructor/assignments" },
              { icon: <CheckCircleIcon />, name: "Certificates", path: "/instructor/certificates" },
            ],
          },
          {
            icon: <UserIcon />,
            name: "Students",
            path: "/instructor/students",
          },
          // {
          //   icon: <PieChartIcon />,
          //   name: "Analytics",
          //   path: "/instructor/analytics",
          // },
          {
            icon: <DocsIcon />,
            name: "Blogs",
            path: "/instructor/blogs",
          },
          {
            icon: <UserCircleIcon />,
            name: "Profile",
            path: "/instructor/profile",
          },
        ],
        othersItems: [],
      };
    }

    // Default items for non-role-specific pages
    return {
      navItems: undefined,
      othersItems: undefined,
    };
  }, [user?.role]);

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <AppSidebar navItems={navItems} othersItems={othersItems} />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
