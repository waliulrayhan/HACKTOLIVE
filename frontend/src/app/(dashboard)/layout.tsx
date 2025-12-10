"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "./_components/AppHeader";
import AppSidebar from "./_components/AppSidebar";
import Backdrop from "./_components/Backdrop";
import React, { useMemo } from "react";
import { GridIcon, UserCircleIcon } from "@/icons/index";
import { FaBook, FaChartLine, FaCertificate, FaGraduationCap, FaUsers, FaCheckCircle, FaCog, FaShieldAlt, FaChartBar, FaUserGraduate, FaVideo, FaFileAlt } from "react-icons/fa";

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
            icon: <FaBook className="w-5 h-5" />,
            name: "My Courses",
            path: "/student/courses",
          },
          {
            icon: <FaChartLine className="w-5 h-5" />,
            name: "Progress",
            path: "/student/progress",
          },
          {
            icon: <FaCertificate className="w-5 h-5" />,
            name: "Certificates",
            path: "/student/certificates",
          },
          {
            icon: <FaGraduationCap className="w-5 h-5" />,
            name: "Browse Courses",
            path: "/student/browse",
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
            icon: <FaBook className="w-5 h-5" />,
            name: "My Courses",
            path: "/instructor/courses",
          },
          {
            icon: <FaUserGraduate className="w-5 h-5" />,
            name: "Students",
            path: "/instructor/students",
          },
          {
            icon: <FaChartBar className="w-5 h-5" />,
            name: "Analytics",
            path: "/instructor/analytics",
          },
          {
            icon: <FaFileAlt className="w-5 h-5" />,
            name: "Assignments",
            path: "/instructor/assignments",
          },
          {
            icon: <FaVideo className="w-5 h-5" />,
            name: "Content Library",
            path: "/instructor/library",
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
